"use server";
import { createClient } from "../utils/supabase/server";
const supabase = await createClient();

export async function createRequest(senderId, name, receiverId) {
  if (!senderId || !receiverId || senderId === receiverId) {
    console.error("Invalid sender or receiver.");
    return { status: 400, message: "Invalid sender or receiver." };
  }

  try {
    const { error } = await supabase.from("friend_requests").insert([
      {
        sender_name: name,
        sender_id: senderId,
        receiver_id: receiverId,
        status: "pending", // Ensure the status is 'pending'
      },
    ]);

    if (error) {
      console.error("Error inserting request:", error);
      return { status: 500, message: `Error sending Request ${error.message}` };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return { status: 500, message: "An unexpected error occurred" };
  }

  return { status: 200, message: "Success" };
}
