import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes"

const router = Router();
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/profile", profileRoutes);

export default router