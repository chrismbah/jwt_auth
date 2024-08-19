import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const database = process.env.DB;
const password = process.env.DB_PASSWORD;

export const db = mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password,
    database,
  });