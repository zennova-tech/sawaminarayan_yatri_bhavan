// services/razorpayInstance.ts
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '@/config';
import Razorpay from 'razorpay';
console.log('🚀 ~ RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID);

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;
