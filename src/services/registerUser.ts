import bcrypt from "bcryptjs";
import { db } from "../db/connection";
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

