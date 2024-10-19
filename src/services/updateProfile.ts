import { User } from "../types/user";
import { db } from "../db/connection";

export const updateProfile = async (userId: string, userInfo: User) => {
  const { first_name, last_name, phone_number } = userInfo;
  const updateUserQuery =
    "UPDATE users SET (first_name, last_name, phone_number) = (?, ?, ?) WHERE user_id = ? ";
  const [res] = await db
    .promise()
    .execute<any[]>(updateUserQuery, [first_name, last_name, phone_number]);
  const user = res[0];
  return {
    statusCode: 201,
    status: "Profile Successfully Updated",
    data: user,
  };
};
