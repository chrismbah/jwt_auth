import { Router } from "express";
import authRoutes from "./auth";
import profileRoutes from "./profile"

const router = Router();
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/profile", profileRoutes);

export default router