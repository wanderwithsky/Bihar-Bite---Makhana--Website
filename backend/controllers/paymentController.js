import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import db from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise' });
    }

    const options = {
      amount, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Store in MySQL database
    const [result] = await db.query(
      `INSERT INTO orders (razorpay_order_id, amount, customer_name, customer_email, customer_phone, status) 
       VALUES (?, ?, ?, ?, ?, 'created')`,
      [order.id, amount, customerName, customerEmail, customerPhone]
    );

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful, update status in DB
      await db.query(
        `UPDATE orders SET razorpay_payment_id = ?, status = 'paid' WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

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
