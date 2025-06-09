import { createBookingHandler } from "@/controllers/booking.controller";
import express, { Router } from "express";


const router: Router = express.Router();

// Create a new booking with payment
router.post("/", createBookingHandler);


export default router;
