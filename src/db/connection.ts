import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const database = process.env.DB;
const password = process.env.DB_PASSWORD;

// Create the connection configuration
const dbConfig = {
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "root",
  password,
  database,
};

// Create connection pool instead of single connection
export const db = mysql.createPool(dbConfig);

// Test the connection and handle errors
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database Connection Error:", err);
    return;
  }
  console.log("Successfully connected to the database");
  connection.release();
});

// Handle pool errors
db.on("error", (err) => {
  console.error("Database Pool Error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Database connection was closed.");
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("Database has too many connections.");
  }
  if (err.code === "ECONNREFUSED") {
    console.error("Database connection was refused.");
  }
});
