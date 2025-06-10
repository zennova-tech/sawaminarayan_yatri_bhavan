import express from "express";
import bookingRoutes from "./booking.routes";

const router = express.Router();

router.use("/api/payment", bookingRoutes);

export default router;
