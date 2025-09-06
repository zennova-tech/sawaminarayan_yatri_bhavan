import { MAIL_CLIENT, RAZORPAY_WEBHOOK_SECRET } from '@/config';
import { bookingPayload } from '@/interfaces/types/bookingInterfaces';
import {
  BookingRooms,
  checkIfPaymentProcessed,
  hotelDetails,
} from '@/repository/booking.repository';
import Booking from '@/sequilizedir/models/booking.model';
import { sendMail } from '@/services/mail/mail.service';
import razorpayInstance from '@/services/razorpay/razorpay.service';
import { sendWhatsAppMessage } from '@/services/whatsApp/whatsApp.service';
import { generalResponse } from '@/utils/generalResponse';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

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
      total_guests,
      amount,
      mattress,
      first_name,
      last_name,
      phone_number,
      email,
      address1,
      address2,
      city,
      state,
    } = req.body;
    const options: OrderCreateRequestBody = {
      amount: amount * 100,
      receipt: `receipt_${Date.now()}`,
      currency: 'INR',
      notes: {
        check_in,
        check_out,
        rooms,
        total_guests,
        mattress,
        first_name,
        last_name,
        phone_number,
        email,
        amount,
        address1,
        address2,
        city,
        state,
      },
    };

    const data = await razorpayInstance.orders.create(options);
    return generalResponse(req, res, data, 'booking create successfully', false);
  } catch (error) {
    throw error;
  }
};

const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return generalResponse(req, res, null, 'Webhook secret not configured', false, 'error', 500);
    }

    const receivedSignature = req.headers['x-razorpay-signature'] as string;
    if (!receivedSignature) {
      return generalResponse(req, res, null, 'No signature received', false, 'error', 400);
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (generatedSignature !== receivedSignature) {
      return generalResponse(req, res, null, 'Invalid webhook signature', false, 'error', 400);
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const payment = payload.payment.entity;
      const notes = payment.notes || {};
      const paymentId = payment.id;

      const existingBooking = await checkIfPaymentProcessed(paymentId); // You need to implement this
      if (existingBooking) {
        console.log(`Payment ${paymentId} already processed, skipping...`);
        return generalResponse(req, res, { paymentId }, 'Payment already processed', true);
      }

      try {
        const bookingNotes: bookingPayload = {
          check_in: notes.check_in,
          check_out: notes.check_out,
          rooms: notes.rooms,
          total_guests: notes.total_guests,
          mattress: notes.mattress,
          amount: notes.amount,
          first_name: notes.first_name,
          last_name: notes.last_name,
          phone_number: notes.phone_number,
          email: notes.email,
          address1: notes.address1,
          address2: notes.address2,
          city: notes.city,
          state: notes.state,
          payment_status: 'paid',
          amount_paid: notes.amount,
          amount_due: 0,
          remarks: notes.remarks,
          updated_amount: notes?.updated_amount,
        };

        await BookingRooms(bookingNotes, req.transaction, payment.id, payment.method);
        await sendMail(
          bookingNotes.email,
          'Booking Confirmation - Thank you for booking with us!',
          bookingNotes,
        );
        await sendMail(MAIL_CLIENT, 'New Booking Received', bookingNotes, true);
        await sendWhatsAppMessage(notes.phone_number, notes);
        return generalResponse(
          req,
          res,
          { paymentId: payment.id },
          'Payment processed successfully',
          false,
        );
      } catch (err) {
        console.error('DB Insert Failed', err);
        return generalResponse(req, res, null, 'Booking creation failed', false, 'error', 500);
      }
    }
    return generalResponse(req, res, null, 'Webhook received', false);
  } catch (error) {
    console.error('Webhook processing error:', error);
    return generalResponse(req, res, null, 'Webhook processing failed', false, 'error', 500);
  }
};

const DashboardController = async (req: Request, res: Response) => {
  try {
    const dashboardData = await hotelDetails(req);
    return generalResponse(req, res, dashboardData, 'Dashboard details fetch successfully', false);
  } catch (error) {
    console.log('🚀 ~ :146 ~ DashboardController ~ error:', error);
    return generalResponse(req, res, null, 'Webhook processing failed', false, 'error', 500);
  }
};

const contactToMail = async (req: Request, res: Response) => {
  try {
    const { full_name, phone_number, message, email } = req.body;
    await sendMail(
      MAIL_CLIENT,
      'New Contact Inquiry - Swaminarayan Yatri Bhavan',
      {
        full_name,
        phone_number,
        message,
        email,
      },
      false,
      true,
    );
    return generalResponse(req, res, null, 'Mail sent successfully', false);
  } catch (error) {
    console.log('🚀 ~ :205 ~ contactToMail ~ error:', error);
  }
};

const releaseBookedRooms = async () => {
  try {
    const currentDate = new Date();
    const expiredBookings = await Booking.findAll({
      where: {
        check_out: {
          [Op.lte]: currentDate,
        },
      },
    });
    if (expiredBookings.length === 0) {
      console.log('No expired bookings found');
      return;
    }
    let totalRoomsToRelease = 0;
    for (const booking of expiredBookings) {
      totalRoomsToRelease += booking.rooms_booked;
      if (booking.status === 'pending') {
        await booking.update({ status: 'closed' });
      }
    }
    console.log(
      `Released ${totalRoomsToRelease} rooms and removed ${expiredBookings.length} bookings`,
    );
  } catch (error) {
    console.log('🚀 ~ :264 ~ releaseBookedRooms ~ error:', error);
  }
};

export {
  contactToMail,
  createBookingHandler,
  DashboardController,
  razorpayWebhook,
  releaseBookedRooms,
};
