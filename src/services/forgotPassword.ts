import { db } from "../db/connection";
import { User } from "../types/user";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const sendPasswordResetEmail = async (email: string) => {
  // Check if user exists
  const findUserQuery = `SELECT * FROM users WHERE email = ?`;
  const [userRows] = await db.promise().execute<any[]>(findUserQuery, [email]);

  if (userRows.length === 0) {
    return {
      status: "error",
      statusCode: 404,
      message: "User not found",
      error: { code: 404, details: "User not found" },
    };
  }
  const token = crypto.randomBytes(20).toString("hex"); // Generate a reset token
  console.log(token);

  // Saving the token and expiration time in the database to verify later
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour

  console.log(expiryDate);
  const updateResetTokenQuery = `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`;
  await db
    .promise()
    .execute<any[]>(updateResetTokenQuery, [token, expiryDate, email]);

  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "👋 Hello from Node.js 🚀: Password Reset Request.",
    text: `You requested a password reset. Click the link below to reset your password or copy the token and test on Postman ${token}`,
  };
  await transporter.sendMail(mailOptions);

  return {
    status: "success",
    statusCode: 200,
    message: "Password reset email sent",
  };
};

export const verifyToken = async (token: string) => {
  const verifyTokenQuery =
    "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()";
  const [userRows] = await db
    .promise()
    .execute<any[]>(verifyTokenQuery, [token]);
  return userRows[0] as User | null; // Return the user for further processing
};

export const updatePassword = async (token: string, newPassword: string) => {
  const user = await verifyToken(token);
  if (!user) {
    return {
      status: "error",
      statusCode: 401,
      message: "Invalid or expired token",
    };
  }
  console.log(newPassword);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword);
  const updatePasswordQuery =
    "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id= ?";
  await db
    .promise()
    .execute(updatePasswordQuery, [hashedPassword, user.user_id]);
  return {
    status: "success",
    statusCode: 200,
    message: "Password has been reset successfully",
  };
};
