import express from "express";
import bookingRoutes from "./booking.routes";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/api/payment", bookingRoutes);

router.use("/admin", adminRoutes)

export default router;
