import {
  MAIL_CLIENT,
  MAIL_PASS,
  MAIL_USER,
  RAZORPAY_WEBHOOK_SECRET,
} from "@/config";
import {
  bookingPayload,
  usersPayload,
} from "@/interfaces/types/bookingInterfaces";
import {
  BookingRooms,
  hotelDetails,
  UserBookings,
} from "@/repository/booking.repository";
import Booking from "@/sequilizedir/models/booking.model";
import HotelSettings from "@/sequilizedir/models/hotelSettings.model";
import razorpayInstance from "@/services/razorpay/razorpay.service";
import { sendWhatsAppMessage } from "@/services/whatsApp/whatsApp.service";
import { generalResponse } from "@/utils/generalResponse";
import crypto from "crypto";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

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
      currency: "INR",
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
    return generalResponse(
      req,
      res,
      data,
      "booking create successfully",
      false
    );
  } catch (error) {
    throw error;
  }
};

const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return generalResponse(
        req,
        res,
        null,
        "Webhook secret not configured",
        false,
        "error",
        500
      );
    }

    const receivedSignature = req.headers["x-razorpay-signature"] as string;
    if (!receivedSignature) {
      return generalResponse(
        req,
        res,
        null,
        "No signature received",
        false,
        "error",
        400
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      return generalResponse(
        req,
        res,
        null,
        "Invalid webhook signature",
        false,
        "error",
        400
      );
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const payment = payload.payment.entity;
      const notes = payment.notes || {};

      try {
        const bookingNotes: bookingPayload = {
          check_in: notes.check_in,
          check_out: notes.check_out,
          rooms: notes.rooms,
          total_guests: notes.total_guests,
          mattress: notes.mattress,
          amount: notes.amount,
        };
        const userPayload: usersPayload = {
          first_name: notes.first_name,
          last_name: notes.last_name,
          phone_number: notes.phone_number,
          email: notes.email,
          address1: notes.address1,
          address2: notes.address2,
          city: notes.city,
          state: notes.state,
        };
        const userData = await UserBookings(userPayload, req.transaction);
        notes.user_id = userData.id;
        await BookingRooms(bookingNotes, req.transaction);
        await sendWhatsAppMessage(notes.phone_number, notes);
        return generalResponse(
          req,
          res,
          { paymentId: payment.id },
          "Payment processed successfully",
          false
        );
      } catch (err) {
        console.error("DB Insert Failed", err);
        return generalResponse(
          req,
          res,
          null,
          "Booking creation failed",
          false,
          "error",
          500
        );
      }
    }
    return generalResponse(req, res, null, "Webhook received", false);
  } catch (error) {
    console.error("Webhook processing error:", error);
    return generalResponse(
      req,
      res,
      null,
      "Webhook processing failed",
      false,
      "error",
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
      "Dashboard details fetch successfully",
      false
    );
  } catch (error) {
    console.log("🚀 ~ :146 ~ DashboardController ~ error:", error);
    return generalResponse(
      req,
      res,
      null,
      "Webhook processing failed",
      false,
      "error",
      500
    );
  }
};

const contactToMail = async (req: Request, res: Response) => {
  try {
    const { full_name, phone_number, message, email } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER, // Your Gmail address
        pass: MAIL_PASS, // App Password
      },
    });
    const mailOptions = {
      from: `"Swaminarayan Yatri Bhavan" <${MAIL_USER}>`,
      to: MAIL_CLIENT, // Send to client email
      subject: "New Contact Inquiry - Swaminarayan Yatri Bhavan",
      html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #e65100;">Swaminarayan Yatri Bhavan</h2>
            <p>You have received a new inquiry from the contact form.</p>

            <hr style="border: none; border-top: 1px solid #ccc;" />

            <p><strong>Full Name:</strong> ${full_name}</p>
            <p><strong>Phone Number:</strong> ${phone_number}</p>
            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Message:</strong></p>
            <p style="margin-left: 16px;">${message}</p>
            
            <hr style="border: none; border-top: 1px solid #ccc;" />

            <p style="font-size: 0.9rem; color: #888;">
            This message was submitted via the Swaminarayan Yatri Bhavan website.
            </p>
            </div>`,
    };
    await transporter.sendMail(mailOptions);
    return generalResponse(req, res, null, "Mail sent successfully", false);
  } catch (error) {
    console.log("🚀 ~ :205 ~ contactToMail ~ error:", error);
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
      console.log("No expired bookings found");
      return;
    }
    let totalRoomsToRelease = 0;
    for (const booking of expiredBookings) {
      totalRoomsToRelease += booking.rooms_booked;
      await booking.destroy();
    }
    const hotelSettings = await HotelSettings.findOne();
    if (hotelSettings) {
      hotelSettings.available_rooms =
        (hotelSettings.available_rooms || 0) + totalRoomsToRelease;
      hotelSettings.booked_rooms = Math.max(
        (hotelSettings.booked_rooms || 0) - totalRoomsToRelease,
        0
      );
      await hotelSettings.save();
    }
    console.log(
      `Released ${totalRoomsToRelease} rooms and removed ${expiredBookings.length} bookings`
    );
  } catch (error) {
    console.log("🚀 ~ :264 ~ releaseBookedRooms ~ error:", error);
  }
};

export {
  contactToMail,
  createBookingHandler,
  DashboardController,
  razorpayWebhook,
  releaseBookedRooms,
};
