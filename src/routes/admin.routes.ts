import {
  AdminDashboard,
  createBooking,
  createRoomRule,
  DeleteBooking,
  DeleteRoomRule,
} from "@/controllers/admin.controller";
import { authMiddleware } from "@/middleware/auth";
import validationMiddleware from "@/middleware/validation";
import {
  bookingSchema,
  checkInDateSchema,
  deleteBookingSchema,
  deleteRoomRuleSchema,
  roomRuleSchema,
} from "@/validationSchema/checkInDateSchema";
import express, { Router } from "express";

const router: Router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  validationMiddleware(checkInDateSchema, "query"),
  AdminDashboard
);

router.delete(
  "/booking",
  authMiddleware,
  validationMiddleware(deleteBookingSchema, "query"),
  DeleteBooking
);

router.post(
  "/booking",
  authMiddleware,
  validationMiddleware(bookingSchema, "body"),
  createBooking
);

router.post(
  "/price-rule",
  authMiddleware,
  validationMiddleware(roomRuleSchema, "body"),
  createRoomRule
);

router.put(
  "/price-rule/:id",
  authMiddleware,
  validationMiddleware(roomRuleSchema, "body"),
  updateRoomRule
);

router.delete(
  "/price-rule",
  authMiddleware,
  validationMiddleware(deleteRoomRuleSchema, "body"),
  DeleteRoomRule
);

export default router;
