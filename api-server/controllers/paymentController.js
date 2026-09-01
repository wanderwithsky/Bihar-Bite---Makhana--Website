import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure dotenv is loaded before reading process.env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
let supabase = null;
try {
  if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
} catch (error) {
  console.error('[SUPABASE_INIT_ERROR] Failed to initialize Supabase:', error.message);
}

export const createOrder = async (req, res) => {
  try {
    const { app_order_id, amount: clientAmount, customerName, customerEmail, customerPhone } = req.body;

    if (!app_order_id) {
      return res.status(400).json({ error: 'Missing order ID' });
    }

    if (!razorpay) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server. Check RAZORPAY_KEY_ID.' });
    }

    console.log('[RAZORPAY] using Supabase URL:', supabaseUrl.substring(0, 20) + '...');
    console.log('[RAZORPAY] querying order ID:', app_order_id);

    let finalAmountRupees = clientAmount; // Fallback

    let dbOrder = null;
    let orderError = null;

    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('total')
        .eq('id', app_order_id)
        .single();
      dbOrder = data;
      orderError = error;
    } else {
      console.log('[SUPABASE_ERROR] Supabase client not initialized, skipping DB order lookup.');
    }

    if (orderError || !dbOrder) {
      console.log('[RAZORPAY] could not fetch from DB (RLS or missing), trusting client amount:', finalAmountRupees);
    } else {
      finalAmountRupees = dbOrder.total;
      console.log('[RAZORPAY] securely fetched order from DB:', dbOrder);
      console.log('[RAZORPAY] validated amount (rupees):', finalAmountRupees);
    }

    const amountInPaise = Math.round(Number(finalAmountRupees) * 100); // amount in smallest currency unit (paise)
    
    console.log('[RAZORPAY] normalized amount in paise:', amountInPaise);

    if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise' });
    }

    const options = {
      amount: amountInPaise, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);
    console.log('[RAZORPAY] order created:', razorpayOrder.id);

    let updateError = null;
    if (supabase) {
      const { error } = await supabase
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', app_order_id);
      updateError = error;
    }

    if (updateError) {
      console.log('[RAZORPAY] note: could not update razorpay_order_id in DB (RLS restricted or column missing). Will verify upon payment completion.', updateError.message);
    }

    res.status(200).json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message || String(error) });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, app_order_id } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !app_order_id) {
      return res.status(400).json({ error: 'Missing payment details or order ID' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      let dbError = null;
      if (supabase) {
        const { error } = await supabase
          .from('orders')
          .update({ 
            payment_status: 'Paid',
            payment_method: 'online',
            razorpay_order_id,
            razorpay_payment_id
          })
          .eq('id', app_order_id);
        dbError = error;
      } else {
        console.log('[SUPABASE_ERROR] Supabase client not initialized, skipping DB update.');
        return res.status(500).json({ success: false, error: 'Database update failed (Supabase missing)' });
      }

      if (dbError) {
        console.error('Failed to update Supabase order:', dbError);
        // Even if DB update fails, signature was valid, but we might want to return 500
        return res.status(500).json({ success: false, error: 'Database update failed' });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).send('Webhook signature or secret missing');
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send('Invalid webhook signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity || payload.order?.entity;
      const razorpay_order_id = paymentEntity?.order_id || paymentEntity?.id;

      if (razorpay_order_id) {
        // Idempotently update the order
        const { error: dbError } = await supabase
          .from('orders')
          .update({
            paymentStatus: 'Paid',
            paymentMethod: 'online'
          })
          .eq('razorpay_order_id', razorpay_order_id);

        if (dbError) {
          console.error('Webhook: Failed to update Supabase order:', dbError);
          // Return 500 so Razorpay retries the webhook
          return res.status(500).send('Failed to process webhook');
        }
      }
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
};
