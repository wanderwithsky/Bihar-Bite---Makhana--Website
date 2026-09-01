import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Use root .env
dotenv.config({ path: '../.env' });

// Initialize Supabase admin client to bypass RLS for notifications
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.resend.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER || 'resend',
    pass: process.env.EMAIL_PASS || '',
  },
});

/**
 * Ensures idempotency. Returns true if notification should be sent, false if already sent/pending.
 */
async function canSendNotification(orderId, channel) {
  try {
    // Attempt to insert a 'pending' record. If it already exists due to UNIQUE constraint, it fails.
    const { data, error } = await supabase
      .from('order_notifications')
      .insert([{ order_id: orderId, channel, status: 'pending' }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        console.log(`Notification for ${channel} already exists for order ${orderId}. Skipping.`);
        return false;
      }
      console.error(`Error checking idempotency for ${channel}:`, error);
      return false; // Fail safe: don't send if we can't verify
    }
    return true;
  } catch (err) {
    console.error('Error in canSendNotification:', err);
    return false;
  }
}

async function updateNotificationStatus(orderId, channel, status) {
  await supabase
    .from('order_notifications')
    .update({ status })
    .eq('order_id', orderId)
    .eq('channel', channel);
}

export const sendOrderEmail = async (order) => {
  if (!await canSendNotification(order.id, 'email')) return false;

  try {
    const itemsList = order.items.map(i => `${i.name} × ${i.quantity}`).join('\n');
    const emailBody = `
Hello ${order.customer_name},

Thank you for ordering from Bihar Bite.

Your order has been successfully confirmed.

Order ID:
#${order.id}

Order Date:
${order.date}

Order Items:
${itemsList}

Subtotal:
₹${order.total - (order.shippingCharge || 0)}

Delivery:
₹${order.shippingCharge || 0}

Grand Total:
₹${order.total}

Expected Delivery:
${order.delivery_end_date || '3-5 Business Days'}

Delivery Address:
${order.shipping_address}

Payment Method:
${order.payment_method === 'cod' ? 'CASH ON DELIVERY' : 'ONLINE PAYMENT'}

Message:
Your Bihar Bite order is confirmed and will be delivered to the above address by ${order.delivery_end_date || 'the expected delivery date'}.

Track Your Order:
https://biharbite.com/track-order?orderId=${order.id}
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Info@biharbite.com',
      to: order.customer_email,
      subject: `Bihar Bite Order Confirmed - Order #${order.id}`,
      text: emailBody.trim(),
    });

    await updateNotificationStatus(order.id, 'email', 'sent');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    await updateNotificationStatus(order.id, 'email', 'failed');
    return false;
  }
};

export const sendOrderWhatsApp = async (order) => {
  if (!await canSendNotification(order.id, 'whatsapp')) return false;

  if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn('WhatsApp API credentials not found. Skipping WhatsApp notification.');
    await updateNotificationStatus(order.id, 'whatsapp', 'failed');
    return false;
  }

  try {
    const itemsList = order.items.map(i => `${i.name} × ${i.quantity}`).join('\n');
    const message = `Hello ${order.customer_name} 👋\n\nYour Bihar Bite order has been confirmed successfully! 🎉\n\n🧾 Order ID: #${order.id}\n\n📦 Order:\n${itemsList}\n\n💰 Total: ₹${order.total}\n\n🚚 Expected Delivery:\n${order.delivery_end_date || '3-5 Business Days'}\n\n📍 Delivery Address:\n${order.shipping_address}\n\n💳 Payment:\n${order.payment_method === 'cod' ? 'CASH ON DELIVERY' : 'ONLINE PAYMENT'}\n\nYour order will be delivered to the above address by the expected delivery date.\n\nTrack your order:\nhttps://biharbite.com/track-order?orderId=${order.id}\n\nThank you for choosing Bihar Bite ❤️`;

    // Ensure mobile number is formatted properly (e.g., add country code if missing)
    let mobile = order.customer_mobile;
    if (mobile && !mobile.startsWith('+') && !mobile.startsWith('91') && mobile.length === 10) {
      mobile = '91' + mobile;
    }
    // Clean up any non-numeric characters except +
    mobile = mobile.replace(/[^\d+]/g, '');

    const response = await fetch(process.env.WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: mobile,
        type: 'text',
        text: { body: message }
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('WhatsApp API Error:', errData);
      throw new Error('WhatsApp API returned ' + response.status);
    }

    await updateNotificationStatus(order.id, 'whatsapp', 'sent');
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    await updateNotificationStatus(order.id, 'whatsapp', 'failed');
    return false;
  }
};
