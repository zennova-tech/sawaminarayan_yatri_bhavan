import express from 'express';
import bookingRoutes from './booking.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import { contactToMail } from '@/controllers/booking.controller';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/api/payment', bookingRoutes);

router.use('/admin', adminRoutes);

router.post('/api/contact', contactToMail);

export default router;
