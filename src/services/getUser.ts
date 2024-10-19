import { db } from "../db/connection";

export const getUser = async (userId: string) => {
  const getUserInfoQuery = "SELECT * FROM users WHERE user_id = ?";
  const [users] = await db.promise().execute<any[]>(getUserInfoQuery, [userId]);
  const user = users[0];
  if (!user)
    return {
      statusCode: 404,
      message: "User not found",
    };
  return {
    statusCode: 200,
    status: "User Profile",
    data: user,
  };
};
