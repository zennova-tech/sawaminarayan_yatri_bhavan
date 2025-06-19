import { AdminDashboard, DeleteBooking } from '@/controllers/admin.controller';
import { authMiddleware } from '@/middleware/auth';
import validationMiddleware from '@/middleware/validation';
import {
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

export default router;
