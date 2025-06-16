import { AdminDashboard } from "@/controllers/admin.controller";
import { authMiddleware } from "@/middleware/auth";
import validationMiddleware from "@/middleware/validation";
import { checkInDateSchema } from "@/validationSchema/checkInDateSchema";
import express, { Router } from "express";

const router: Router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  validationMiddleware(checkInDateSchema, "query"),
  AdminDashboard
);

export default router;
