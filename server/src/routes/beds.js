import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../middleware/logger.js';

const router = express.Router();

/**
 * GET /api/beds
 * Fetches bed occupancy matrix joined with patient details.
 */
router.get('/', async (req, res) => {
  try {
    const { ward, status } = req.query;

    let query = supabase
      .from('beds')
      .select(`
        id,
        bed_number,
        ward,
        department,
        status,
        admitted_at,
        created_at,
        patient:patients (
          id,
          uhid,
          full_name,
          age,
          gender,
          blood_group
        )
      `)
      .order('bed_number', { ascending: true });

    if (ward && ward !== 'All') {
      query = query.eq('ward', ward);
    }
    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const { data: beds, error } = await query;

    if (error) {
      logger.error('Error fetching beds matrix:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    const total = beds.length;
    const available = beds.filter((b) => b.status === 'Available').length;
    const occupied = beds.filter((b) => b.status === 'Occupied').length;
    const maintenance = beds.filter((b) => b.status === 'Maintenance').length;

    res.json({
      success: true,
      stats: {
        total,
        available,
        occupied,
        maintenance,
        occupancyRate: total > 0 ? Math.round((occupied / total) * 100) : 0,
      },
      data: beds,
    });
  } catch (err) {
    logger.error('Unexpected error in /beds:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/beds/:id/allocate
 * Allocates a bed to a patient (status: Occupied).
 */
router.post('/:id/allocate', async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_id, patient_name, department } = req.body;

    let targetPatientId = patient_id;

    // If only patient name is provided, create quick patient record
    if (!targetPatientId && patient_name) {
      const { data: newPatient, error: pErr } = await supabase
        .from('patients')
        .insert({
          uhid: `AC-${Math.floor(10000 + Math.random() * 90000)}`,
          full_name: patient_name,
          age: 45,
          gender: 'Other',
        })
        .select()
        .single();

      if (!pErr && newPatient) {
        targetPatientId = newPatient.id;
      }
    }

    const { data: updatedBed, error } = await supabase
      .from('beds')
      .update({
        status: 'Occupied',
        patient_id: targetPatientId || null,
        admitted_at: new Date().toISOString(),
        ...(department ? { department } : {}),
      })
      .eq('id', id)
      .select(`
        *,
        patient:patients (*)
      `)
      .single();

    if (error) {
      logger.error(`Error allocating bed ${id}:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Bed ${updatedBed.bed_number} allocated to patient ${targetPatientId}`);

    res.json({
      success: true,
      message: `Bed ${updatedBed.bed_number} allocated successfully`,
      data: updatedBed,
    });
  } catch (err) {
    logger.error('Error allocating bed:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/beds/:id/discharge
 * Discharges patient from bed, setting it to Available or Maintenance.
 */
router.post('/:id/discharge', async (req, res) => {
  try {
    const { id } = req.params;
    const { next_status = 'Available' } = req.body;

    const { data: dischargedBed, error } = await supabase
      .from('beds')
      .update({
        status: next_status,
        patient_id: null,
        admitted_at: null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error(`Error discharging bed ${id}:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Bed ${dischargedBed.bed_number} discharged (status: ${next_status})`);

    res.json({
      success: true,
      message: `Bed ${dischargedBed.bed_number} marked as ${next_status}`,
      data: dischargedBed,
    });
  } catch (err) {
    logger.error('Error discharging bed:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PATCH /api/beds/:id/status
 * Updates bed maintenance or available status.
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Available', 'Occupied', 'Maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updatePayload = { status };
    if (status !== 'Occupied') {
      updatePayload.patient_id = null;
      updatePayload.admitted_at = null;
    }

    const { data, error } = await supabase
      .from('beds')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      message: `Bed ${data.bed_number} updated to ${status}`,
      data,
    });
  } catch (err) {
    logger.error('Error updating bed status:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
