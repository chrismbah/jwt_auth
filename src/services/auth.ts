import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection";
import { User } from "../types/user";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

interface UserInfo {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
export const registerUserService = async (userInfo: UserInfo) => {
  const { email, password, first_name, last_name } = userInfo;
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  const [existingUsers] = await db
    .promise()
    .execute<any[]>(checkUserQuery, [email]);

  if (existingUsers.length > 0) {
    return {
      status: "error",
      statusCode: 409,
      message: "Email already exists",
      error: {
        code: 409,
        details: "A user with the provided email already exists.",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
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

  const newUserQuery = "SELECT * FROM users WHERE id = ?";
  const [newUserRows] = await db
    .promise()
    .execute<any[]>(newUserQuery, [result.insertId]);
  const newUser = newUserRows[0];

  return {
    status: "success",
    statusCode: 201,
    message: "User successfully created",
    data: {
      user_id: newUser.user_id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone_number: newUser.phone_number,
      is_active: newUser.is_active === 1,
      last_login: newUser.last_login,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    },
  };
};

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
    { expiresIn: "7d" }
  );

  return {
    status: "success",
    statusCode: 200,
    message: "Login successful",
    data: {
      token,
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
