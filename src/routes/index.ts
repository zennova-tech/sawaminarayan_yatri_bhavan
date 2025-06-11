import express from "express";
import bookingRoutes from "./booking.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/api/payment", bookingRoutes);

export default router;
