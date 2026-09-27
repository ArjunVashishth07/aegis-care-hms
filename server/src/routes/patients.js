import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../middleware/logger.js';

const router = express.Router();

/**
 * GET /api/patients
 * Search patients by name, UHID, or phone.
 */
router.get('/', async (req, res) => {
  try {
    const { query: searchQuery, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (searchQuery) {
      const q = searchQuery.trim();
      query = query.or(`full_name.ilike.%${q}%,uhid.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    const { data, count, error } = await query;

    if (error) {
      logger.error('Error searching patients:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({
      success: true,
      count,
      data,
    });
  } catch (err) {
    logger.error('Unexpected error in /patients:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * GET /api/patients/:id
 * Fetches a single patient with history of appointments, beds, and bills.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: patient, error } = await supabase
      .from('patients')
      .select(`
        *,
        appointments:appointments (
          id,
          token_no,
          status,
          queue_priority,
          scheduled_at,
          doctor:doctors (full_name, department, room_no)
        ),
        bills:bills (
          id,
          bill_number,
          total_amount,
          payment_status,
          payment_method,
          created_at
        ),
        beds:beds (
          id,
          bed_number,
          ward,
          status,
          admitted_at
        )
      `)
      .eq('id', id)
      .single();

    if (error || !patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (err) {
    logger.error('Error fetching patient profile:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/patients
 * Registers a new patient.
 */
router.post('/', async (req, res) => {
  try {
    const { full_name, age, gender, blood_group, phone, address, uhid } = req.body;

    if (!full_name || !age) {
      return res.status(400).json({
        success: false,
        error: 'Patient full name and age are required.',
      });
    }

    const assignedUhid = uhid || `AC-${Math.floor(10000 + Math.random() * 90000)}`;

    const { data, error } = await supabase
      .from('patients')
      .insert({
        uhid: assignedUhid,
        full_name,
        age: Number(age),
        gender: gender || 'Male',
        blood_group: blood_group || 'O+',
        phone: phone || null,
        address: address || null,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating patient:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Patient registered: ${full_name} (${assignedUhid})`);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data,
    });
  } catch (err) {
    logger.error('Error registering patient:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
