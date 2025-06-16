import { Transaction } from 'sequelize';
import razorpayInstance from '@/services/razorpay/razorpay.service';
import { generalResponse } from '@/utils/generalResponse';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { RAZORPAY_WEBHOOK_SECRET } from '@/config';
import { BookingRooms, hotelDetails } from '@/repository/booking.repository';
import Booking from '@/sequilizedir/models/booking.model';
import HotelSettings from '@/sequilizedir/models/hotelSettings.model';
import { bookingPayload } from '@/interfaces/types/bookingInterfaces';
import { sendWhatsAppMessage } from '@/services/whatsApp/whatsApp.service';

type OrderCreateRequestBody = {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string | number>;
};

const createBookingHandler = async (req: Request, res: Response) => {
  try {
    const {
      check_in,
      check_out,
      rooms,
      guest_per_room,
      amount,
      mattress,
      first_name,
      last_name,
      phone_number,
      email,
    } = req.body;
    const options: OrderCreateRequestBody = {
      amount: amount * 100,
      receipt: `receipt_${Date.now()}`,
      notes: {
        check_in,
        check_out,
        rooms,
        guest_per_room,
        mattress,
        first_name,
        last_name,
        phone_number,
        email,
        amount,
      },
      currency: 'INR',
    };

    const data = await razorpayInstance.orders.create(options);
    return generalResponse(req, res, data, 'booking create sucessfully', false);
  } catch (error) {
    throw error;
  }
};

const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return generalResponse(
        req,
        res,
        null,
        'Webhook secret not configured',
        false,
        'error',
        500
      );
    }

    const receivedSignature = req.headers['x-razorpay-signature'] as string;
    if (!receivedSignature) {
      return generalResponse(
        req,
        res,
        null,
        'No signature received',
        false,
        'error',
        400
      );
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (generatedSignature !== receivedSignature) {
      return generalResponse(
        req,
        res,
        null,
        'Invalid webhook signature',
        false,
        'error',
        400
      );
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const notes = payment.notes || {};

      try {
        // Your booking creation logic here
        await BookingRooms(notes, payment.id, payment.method, req.transaction);
        await sendWhatsAppMessage(notes.phone_number, notes);

        return generalResponse(
          req,
          res,
          { paymentId: payment.id },
          'Payment processed successfully',
          false
        );
      } catch (err) {
        console.error('DB Insert Failed', err);
        return generalResponse(
          req,
          res,
          null,
          'Booking creation failed',
          false,
          'error',
          500
        );
      }
    }
    return generalResponse(req, res, null, 'Webhook received', false);
  } catch (error) {
    console.error('Webhook processing error:', error);
    return generalResponse(
      req,
      res,
      null,
      'Webhook processing failed',
      false,
      'error',
      500
    );
  }
};

const DashboardController = async (req: Request, res: Response) => {
  try {
    const dashboardData = await hotelDetails(req);
    return generalResponse(
      req,
      res,
      dashboardData,
      'Dashboard details fetch successfully',
      false
    );
  } catch (error) {
    console.log('🚀 ~ :146 ~ DashboardController ~ error:', error);
    return generalResponse(
      req,
      res,
      null,
      'Webhook processing failed',
      false,
      'error',
      500
    );
  }
};

export { createBookingHandler, razorpayWebhook, DashboardController };
