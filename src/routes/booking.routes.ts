import {
  createBookingHandler,
  DashboardController,
  razorpayWebhook,
} from '@/controllers/booking.controller';
import { HotelSettingUpdate } from '@/controllers/hotelSetting.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

// Create a new booking with payment
router.post('/create-order', createBookingHandler);

router.get('/dashboard', DashboardController);

router.put('/hotel-settings', HotelSettingUpdate);

// Webhook route with raw body handling
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

export default router;
