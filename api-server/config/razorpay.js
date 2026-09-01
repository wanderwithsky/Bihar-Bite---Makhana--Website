import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

let razorpay = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.error('[RAZORPAY_INIT_ERROR] Failed to initialize Razorpay:', error.message);
}

export default razorpay;
