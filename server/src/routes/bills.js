import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../middleware/logger.js';

const router = express.Router();

/**
 * GET /api/bills
 * Fetches all invoices joined with patient details.
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabase
      .from('bills')
      .select(`
        id,
        bill_number,
        items,
        total_amount,
        payment_status,
        payment_method,
        created_at,
        patient:patients (
          id,
          uhid,
          full_name,
          age,
          gender,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'All') {
      query = query.eq('payment_status', status);
    }

    const { data: bills, error } = await query;

    if (error) {
      logger.error('Error fetching bills:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    const totalRevenue = bills
      .filter((b) => b.payment_status === 'Paid')
      .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalCount: bills.length,
        paidCount: bills.filter((b) => b.payment_status === 'Paid').length,
        pendingCount: bills.filter((b) => b.payment_status === 'Pending').length,
        totalRevenue,
      },
      data: bills,
    });
  } catch (err) {
    logger.error('Unexpected error in /bills:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * POST /api/bills
 * Creates a new invoice for a patient.
 */
router.post('/', async (req, res) => {
  try {
    const {
      patient_id,
      patient_name,
      items = [],
      total_amount,
      payment_method = 'UPI / Card',
      payment_status = 'Pending',
    } = req.body;

    let targetPatientId = patient_id;

    if (!targetPatientId && patient_name) {
      const { data: pData } = await supabase
        .from('patients')
        .select('id')
        .ilike('full_name', `%${patient_name}%`)
        .limit(1)
        .single();

      if (pData) {
        targetPatientId = pData.id;
      }
    }

    if (!targetPatientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required to generate an invoice.',
      });
    }

    const calculatedTotal =
      total_amount !== undefined
        ? total_amount
        : items.reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const billNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: newBill, error } = await supabase
      .from('bills')
      .insert({
        patient_id: targetPatientId,
        bill_number: billNumber,
        items,
        total_amount: calculatedTotal,
        payment_status,
        payment_method,
      })
      .select(`
        *,
        patient:patients (*)
      `)
      .single();

    if (error) {
      logger.error('Error generating bill:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Invoice generated: ${billNumber} for ₹${calculatedTotal}`);

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newBill,
    });
  } catch (err) {
    logger.error('Error in POST /bills:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * PATCH /api/bills/:id/settle
 * Settles payment on an invoice (status: Paid).
 */
router.patch('/:id/settle', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method = 'UPI / Card' } = req.body;

    const { data: settledBill, error } = await supabase
      .from('bills')
      .update({
        payment_status: 'Paid',
        payment_method,
      })
      .eq('id', id)
      .select(`
        *,
        patient:patients (*)
      `)
      .single();

    if (error) {
      logger.error(`Error settling bill ${id}:`, error);
      return res.status(500).json({ success: false, error: error.message });
    }

    logger.info(`Bill ${settledBill.bill_number} settled via ${payment_method}`);

    res.json({
      success: true,
      message: `Invoice ${settledBill.bill_number} settled successfully!`,
      data: settledBill,
    });
  } catch (err) {
    logger.error('Error settling bill:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
