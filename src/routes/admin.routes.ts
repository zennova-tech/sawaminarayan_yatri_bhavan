import { AdminDashboard, createBooking, DeleteBooking } from '@/controllers/admin.controller';
import { authMiddleware } from '@/middleware/auth';
import validationMiddleware from '@/middleware/validation';
import {
  bookingSchema,
  checkInDateSchema,
  deleteBookingSchema,
} from '@/validationSchema/checkInDateSchema';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get(
  '/dashboard',
  authMiddleware,
  validationMiddleware(checkInDateSchema, 'query'),
  AdminDashboard
);

router.delete(
  '/booking',
  authMiddleware,
  validationMiddleware(deleteBookingSchema, 'query'),
  DeleteBooking
);

router.post(
  '/booking',
  authMiddleware,
  validationMiddleware(bookingSchema, 'body'),
  createBooking
);

export default router;
