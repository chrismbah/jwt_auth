import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: any; // This will hold the user data from the token
}

export const validateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!JWT_SECRET) throw new Error("JWT is not defined");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract the token part after 'Bearer'

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          statusCode: 403,
          status: "error",
          message: "Token is not valid or expired",
        });
      }
      // Attach user data from the token to the request object
      req.user = decoded;
      // Continue to the next middleware or route handler
      next();
    });
  } else {
    // If no token is provided in the Authorization header
    return res.status(401).json({
      statusCode: 401,
      status: "error",
      message: "Authorization token is missing",
    });
  }
};
