import {
  AdminDashboard,
  createBooking,
  createRoomRule,
  DeleteBooking,
  DeleteRoomRule,
  PriceRules,
  updateRoomRule,
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

router.get(
  "/price-rule",
  authMiddleware,
  PriceRules
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
  validationMiddleware(deleteRoomRuleSchema, "query"),
  DeleteRoomRule
);

export default router;
