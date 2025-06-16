import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
export const {
  PORT,
  DATABASE_URL,
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET,
  SECRET_KEY,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
} = process.env;
