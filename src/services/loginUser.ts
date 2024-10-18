import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import { User } from "../types/user";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_TIME = 7 * 24 * 60 * 60;

export const loginUserService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const loginDate = new Date();
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  // Check if user exists
  const findUserQuery = "SELECT * FROM users WHERE email = ?";
  const [userRows] = await db.promise().execute<any[]>(findUserQuery, [email]);

  if (userRows.length === 0) {
    return {
      status: "error",
      statusCode: 401,
      message: "Invalid email or password",
      error: { code: 401, details: "User not found" },
    };
  }

  const user: User = userRows[0];

  if (!user.is_active) {
    return {
      status: "error",
      statusCode: 403,
      message: "Account is inactive. Please contact support.",
      error: { code: 403, details: "Inactive account" },
    };
  }
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return {
      status: "error",
      statusCode: 401,
      message: "Invalid email or password",
      error: { code: 401, details: "Incorrect password" },
    };
  }
  // Generate JWT
  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION_TIME }
  );

  // Update the last login in database
  const updateLastLoginQuery =
    "UPDATE users SET last_login = ? WHERE user_id = ?";
  await db.promise().execute(updateLastLoginQuery, [loginDate, user.user_id]);

  return {
    status: "success",
    statusCode: 200,
    message: "Login successful",
    data: {
      token,
      expiresIn: TOKEN_EXPIRATION_TIME,
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      is_active: user.is_active === 1,
      last_login: loginDate,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};
