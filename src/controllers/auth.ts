import { Response, Request } from "express";
import { registerUserService, loginUserService } from "../services/auth";

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
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server Error",
      error: {
        code: 500,
        details: "An unexpected error occurred while processing the request.",
      },
    });
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
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server Error",
      error: {
        code: 500,
        details: "An unexpected error occurred while processing the request.",
      },
    });
  }
};
