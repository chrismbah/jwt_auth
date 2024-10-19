import { Response, Request } from "express";
import { registerUserService } from "../services/registerUser";
import { loginUserService } from "../services/loginUser";
import {
  updatePassword,
  sendPasswordResetEmail,
} from "../services/resetPassword";
import { changeUserPassword } from "../services/changePassword";
import { AuthRequest } from "../middlewares/validateToken";
import { serverErrorMessage } from "../utils/serverErrorMessage";

type UserInfo = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export const registerUser = async (
  req: Request<{}, {}, UserInfo>,
  res: Response
) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const result = await registerUserService({
      email,
      password,
      first_name,
      last_name,
    });
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json(serverErrorMessage);
  }
};

export const loginUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Email and password are required",
        error: {
          code: 400,
          details: "Missing email or password",
        },
      });
    }
    const result = await loginUserService({ email, password });
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json(serverErrorMessage);
  }
};

export const requestPasswordReset = async (
  req: Request<{}, {}, { email: string }>,
  res: Response
) => {
  const { email } = req.body;
  try {
    const result = await sendPasswordResetEmail(email);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json(serverErrorMessage);
  }
};

export const resetPassword = async (
  req: Request<{}, {}, { newPassword: string; token: string }>,
  res: Response
) => {
  const { token, newPassword } = req.body;
  try {
    // Call service to verify token and update password
    const result = await updatePassword(token, newPassword);
    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json(serverErrorMessage);
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  console.log(oldPassword);
  console.log(newPassword);
  console.log(user);
  try {
    const result = await changeUserPassword(oldPassword, newPassword, user);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json(serverErrorMessage);
  }
};
