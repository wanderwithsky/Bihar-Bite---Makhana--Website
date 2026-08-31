import express from 'express';
import { sendOrderEmail, sendOrderWhatsApp } from '../services/notificationService.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const router = express.Router();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

router.post('/order-confirmation', async (req, res) => {
  const { order } = req.body;

  if (!order || !order.id) {
    return res.status(400).json({ error: 'Order details missing' });
  }

  try {
    // 1. Verify that the order actually exists in Supabase
    const { data: dbOrder, error } = await supabase
      .from('orders')
      .select('id')
      .eq('id', order.id)
      .single();

    if (error || !dbOrder) {
      console.error(`Attempt to send notification for non-existent order ID: ${order.id}`);
      return res.status(404).json({ error: 'Order not found in database' });
    }

    // 2. Dispatch notifications asynchronously (don't block the response)
    // Run them in parallel
    Promise.allSettled([
      sendOrderEmail(order),
      sendOrderWhatsApp(order)
    ]).then(results => {
      const emailResult = results[0];
      const whatsappResult = results[1];
      console.log(`Notification results for ${order.id}:`, {
        email: emailResult.status === 'fulfilled' ? emailResult.value : 'failed',
        whatsapp: whatsappResult.status === 'fulfilled' ? whatsappResult.value : 'failed'
      });
    });

    // 3. Return success immediately so frontend doesn't hang
    return res.status(200).json({ success: true, message: 'Notifications queued' });
  } catch (err) {
    console.error('Error in /order-confirmation route:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
