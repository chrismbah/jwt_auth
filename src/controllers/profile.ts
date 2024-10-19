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

    // Check if user data exists
    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "User is not authenticated",
      });
    }

    // Validate input fields (basic validation)
    const { first_name, last_name, phone_number } = userInfo;
    if (!first_name || !last_name || !phone_number) {
      return res.status(400).json({
        status: "Error",
        message: "Missing required fields (first_name, last_name, phone_number)",
      });
    }

    // Call the service to update the user profile
    const result = await updateProfile(user.user_id, userInfo);

    // Send back the result from the service
    return res.status(result.statusCode).json(result);
  } catch (err) {
    console.error("Error in updateUserProfile:");

    // Send a generic error response if something goes wrong
    return res.status(500).json({
      status: "Error",
      message: "Internal Server Error. Please try again later.",
    });
  }
};

