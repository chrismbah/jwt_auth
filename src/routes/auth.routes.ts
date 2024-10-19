import { Router } from "express";
import { validateToken } from "../middlewares/validateToken";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
} from "../controllers/auth";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", validateToken, changePassword);

export default router;
