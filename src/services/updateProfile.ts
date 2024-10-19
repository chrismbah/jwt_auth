import { User } from "../types/user";
import { db } from "../db/connection";

export const updateProfile = async (userId: string, userInfo: User) => {
  const { first_name, last_name, phone_number } = userInfo;

  try {
    const updateUserQuery = `
      UPDATE users 
      SET first_name = ?, last_name = ?, phone_number = ? 
      WHERE user_id = ?
    `;

    // Execute the update query
    await db
      .promise()
      .execute<any[]>(updateUserQuery, [
        first_name,
        last_name,
        phone_number,
        userId,
      ]);

    // Fetch the updated user
    const getUserById = "SELECT * FROM users WHERE user_id = ?";
    const [res] = await db.promise().execute<any[]>(getUserById, [userId]);

    // Return the updated user data
    return {
      statusCode: 200,
      status: "Success",
      message: "Profile successfully updated",
      data: res[0], // Send only the first result (the updated user)
    };
  } catch (error) {
    // Handle any unexpected errors during the process
    console.error("Error updating user profile:", error);
    throw new Error("Database Error: Unable to update profile");
  }
};
