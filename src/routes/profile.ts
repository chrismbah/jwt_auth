import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profile";
import { validateToken } from "../middlewares/validateToken";

const router = Router();

router.get("/", validateToken, getUserProfile);
router.get("/update-profile", validateToken, updateUserProfile);

export default router;
