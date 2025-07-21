import { calculatePrice } from '@/controllers/admin.controller';
import {
  createBookingHandler,
  DashboardController,
  razorpayWebhook,
} from '@/controllers/booking.controller';
import {
  getAvailableRoomsController,
  HotelSettingUpdate,
} from '@/controllers/hotelSetting.controller';
import validationMiddleware from '@/middleware/validation';
import { calculatePriceSchema } from '@/validationSchema/checkInDateSchema';
import express, { Router } from 'express';

const router: Router = express.Router();

// Create a new booking with payment
router.post('/create-order', createBookingHandler);

router.get('/dashboard', DashboardController);

router.put('/hotel-settings', HotelSettingUpdate);

router.get('/available-rooms', getAvailableRoomsController);

router.get(
  "/price-rule/calculate",
  validationMiddleware(calculatePriceSchema, "query"),
  calculatePrice

)

// Webhook route with raw body handling
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  razorpayWebhook
);

export default router;
