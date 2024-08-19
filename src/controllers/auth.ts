import { Response, Request } from "express";
import { db } from "../db/connection";
import bcrypt from "bcryptjs";

interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  is_active: number;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}
interface UserInfo {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const registerUser = async (req: Request<UserInfo>, res: Response) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    const [existingUsers] = await db
      .promise()
      .execute<any[]>(checkUserQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        status: "error",
        message: "Email already exists",
        error: {
          code: 409,
          details: "A user with the provided email already exists.",
        },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    const insertUserQuery =
      "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .execute<any>(insertUserQuery, [
        email,
        hashedPassword,
        first_name,
        last_name,
      ]);
    // Fetch created user
    const newUserQuery = "SELECT * FROM users WHERE id = ?";
    const [newUserRows] = await db
      .promise()
      .execute<any[]>(newUserQuery, [result.insertId]);
    const newUser: User = newUserRows[0];
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "User successfully created",
      data: {
        user_id: newUser.user_id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone_number: newUser.phone_number,
        is_active: newUser.is_active === 1 ? true : false,
        last_login: newUser.last_login,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      },
    });
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
