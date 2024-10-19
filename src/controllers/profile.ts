import { AuthRequest } from "../middlewares/validateToken";
import { Response } from "express";
import { serverErrorMessage } from "../utils/serverErrorMessage";
import { getUser } from "../services/getUser";
import { updateProfile } from "../services/updateProfile";

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const result = await getUser(user.user_id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json(serverErrorMessage);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const userInfo = req.body;
    const result = await updateProfile(user.user_id, userInfo);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json(serverErrorMessage);
  }
};
