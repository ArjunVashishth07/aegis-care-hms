import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../middleware/logger.js';

const router = express.Router();

/**
 * GET /api/appointments/queue
 * Fetches live appointments queue joined with patient demographics and doctor info.
 */
router.get('/queue', async (req, res) => {
  try {
    const { department, status, search } = req.query;

    let query = supabase
      .from('appointments')
      .select(`
        id,
        token_no,
        status,
        queue_priority,
        scheduled_at,
        created_at,
        patient:patients (
          id,
          uhid,
          full_name,
          age,
          gender,
          blood_group,
          phone,
          address
        ),
        doctor:doctors (
          id,
          full_name,
          department,
          specialization,
          room_no
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Error fetching appointments queue:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Client-side/in-memory filtering for department and search if joins don't filter directly
    let filtered = data || [];
    if (department && department !== 'All') {
      filtered = filtered.filter((item) => item.doctor?.department === department);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.token_no?.toLowerCase().includes(q) ||
          item.patient?.full_name?.toLowerCase().includes(q) ||
          item.patient?.uhid?.toLowerCase().includes(q) ||
          item.doctor?.full_name?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (err) {
    logger.error('Unexpected error in /queue:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/appointments/book
 * Registers patient (if not already existing) and books a new OPD token slip.
 */
router.post('/book', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      department,
      doctor_id,
      priority = 'Normal',
      phone,
      blood_group,
      address,
    } = req.body;

    if (!name || !age) {
      return res.status(400).json({
        success: false,
        error: 'Patient name and age are required.',
      });
    }

    // 1. Resolve or create patient
    const randomUhid = `AC-${Math.floor(10000 + Math.random() * 90000)}`;
    const { data: newPatient, error: patientError } = await supabase
      .from('patients')
      .insert({
        uhid: randomUhid,
        full_name: name,
        age: Number(age),
        gender: gender || 'Male',
        blood_group: blood_group || 'O+',
        phone: phone || null,
        address: address || null,
      })
      .select()
      .single();

    if (patientError) {
      logger.error('Error registering patient for appointment:', patientError);
      return res.status(500).json({ success: false, error: patientError.message });
    }

    // 2. Resolve Doctor
    let resolvedDoctorId = doctor_id;
    if (!resolvedDoctorId && department) {
      const { data: docData } = await supabase
        .from('doctors')
        .select('id')
        .eq('department', department)
        .limit(1)
        .single();

      if (docData) {
        resolvedDoctorId = docData.id;
      }
    }

    // Fallback doctor if none resolved
    if (!resolvedDoctorId) {
      const { data: fallbackDoc } = await supabase
        .from('doctors')
        .select('id')
        .limit(1)
        .single();
      resolvedDoctorId = fallbackDoc?.id;
    }

    // 3. Compute next token number
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    const tokenNum = 100 + (count || 0) + 1;
    const tokenNo = `A-${tokenNum}`;

    // 4. Insert appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_id: newPatient.id,
        doctor_id: resolvedDoctorId,
        token_no: tokenNo,
        status: 'In-Queue',
        queue_priority: priority,
        scheduled_at: new Date().toISOString(),
      })
      .select(`
        id,
        token_no,
        status,
        queue_priority,
        scheduled_at,
        created_at,
        patient:patients (*),
        doctor:doctors (*)
      `)
      .single();

    if (appointmentError) {
      logger.error('Error creating appointment:', appointmentError);
      return res.status(500).json({ success: false, error: appointmentError.message });
    }

    logger.info(`New appointment booked: Token #${tokenNo} for ${name} (${department})`);

    res.status(201).json({
      success: true,
      message: 'OPD Slip generated successfully',
      data: appointment,
    });
  } catch (err) {
    logger.error('Unexpected error in /book:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PATCH /api/appointments/:id/status
 * Updates appointment status (In-Queue, With Doctor, Completed)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['In-Queue', 'With Doctor', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select(`
        id,
        token_no,
        status,
        queue_priority,
        patient:patients (full_name, uhid),
        doctor:doctors (full_name, department)
      `)
      .single();

    if (error) {
      logger.error(`Error updating appointment ${id} status:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Updated appointment ${id} (${data.token_no}) to ${status}`);

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data,
    });
  } catch (err) {
    logger.error('Unexpected error updating status:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/appointments/call-next
 * Calls the next waiting patient in queue
 */
router.post('/call-next', async (req, res) => {
  try {
    const { department } = req.body;

    let query = supabase
      .from('appointments')
      .select(`
        id,
        token_no,
        status,
        queue_priority,
        patient:patients (id, full_name, uhid, age, gender),
        doctor:doctors (id, full_name, department, room_no)
      `)
      .eq('status', 'In-Queue')
      .order('created_at', { ascending: true })
      .limit(10);

    const { data: waitingList, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    let nextPatient = waitingList?.[0];
    if (department && department !== 'All') {
      nextPatient = waitingList.find((p) => p.doctor?.department === department);
    }

    if (!nextPatient) {
      return res.status(404).json({
        success: false,
        message: 'No waiting patients found for the specified department.',
      });
    }

    // Update status to 'With Doctor'
    const { data: updated, error: updateError } = await supabase
      .from('appointments')
      .update({ status: 'With Doctor' })
      .eq('id', nextPatient.id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError.message });
    }

    logger.info(`Called next patient: Token #${nextPatient.token_no} (${nextPatient.patient?.full_name})`);

    res.json({
      success: true,
      message: `Called patient ${nextPatient.patient?.full_name} (Token ${nextPatient.token_no})`,
      data: {
        ...nextPatient,
        status: 'With Doctor',
      },
    });
  } catch (err) {
    logger.error('Error in /call-next:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
