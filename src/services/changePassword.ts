import bcrypt from "bcryptjs";
import { db } from "../db/connection";
import dotenv from "dotenv";
import { User } from "../types/user";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const changeUserPassword = async (
  oldPassword: string,
  newPassword: string,
  user: User
) => {
  if (!JWT_SECRET) {
    throw new Error("JWT is not defined");
  }
  console.log(user);
  const FIND_USER_BY_ID = "SELECT * FROM users WHERE user_id = ?";
  const [userRows] = await db
    .promise()
    .execute<any[]>(FIND_USER_BY_ID, [user.user_id]);

  if (userRows.length === 0) {
    return {
      status: "Error",
      statusCode: 404,
      message: "User not found",
    };
  }
  const { password_hash } = userRows[0];
  const isPasswordValid = await bcrypt.compare(oldPassword, password_hash);
  console.log(isPasswordValid);
  if (!isPasswordValid)
    return {
      status: "Error",
      statusCode: 401,
      message: "Old password is not valid",
    };

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  if (!hashedNewPassword) throw new Error("Couldnt hash password");
  const updatePasswordQuery =
    "UPDATE users SET password_hash = ? WHERE user_id = ?";
  await db
    .promise()
    .execute<any[]>(updatePasswordQuery, [hashedNewPassword, user.user_id]);

  return {
    statusCode: 201,
    status: "Success",
    message: "Password updated successfully",
  };
};
