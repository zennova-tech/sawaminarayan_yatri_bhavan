import {
  createBookingHandler,
  razorpayWebhook,
} from "@/controllers/booking.controller";
import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

// Create a new booking with payment
router.post("/create-order", createBookingHandler);

// Webhook route with raw body handling
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

export default router;
