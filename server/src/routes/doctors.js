import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../middleware/logger.js';

const router = express.Router();

/**
 * GET /api/doctors
 * Fetches all consulting doctors with department info and current queue count.
 */
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;

    let query = supabase.from('doctors').select('*').order('full_name');

    if (department && department !== 'All') {
      query = query.eq('department', department);
    }

    const { data: doctors, error } = await query;

    if (error) {
      logger.error('Error fetching doctors:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    // Fetch active appointments to compute real-time queue count per doctor
    const { data: activeAppointments } = await supabase
      .from('appointments')
      .select('doctor_id, status')
      .in('status', ['In-Queue', 'With Doctor']);

    const queueMap = {};
    activeAppointments?.forEach((apt) => {
      queueMap[apt.doctor_id] = (queueMap[apt.doctor_id] || 0) + 1;
    });

    const doctorsWithQueue = doctors.map((doc) => ({
      ...doc,
      currentQueue: queueMap[doc.id] || 0,
    }));

    res.json({
      success: true,
      count: doctorsWithQueue.length,
      data: doctorsWithQueue,
    });
  } catch (err) {
    logger.error('Unexpected error in /doctors:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
