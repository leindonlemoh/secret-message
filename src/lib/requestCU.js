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
        status: "pending",
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

export async function updateRequest(id, status) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "User is not authenticated in updating request server action"
    );
    return { message: "User not authenticated" };
  }
  const { data, error } = await supabase
    .from("friend_requests")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    console.error("Error updating request", error);
    return { status: 500, message: "Error updating request" };
  }
  // revalidatePath('/home')

  return { status: 200, message: "Success" };
}

export async function addFrinedList(
  senderId,
  sender_name,
  receiverId,
  receiver_name
) {
  try {
    // Insert for the sender
    const { error: senderError } = await supabase.from("profile").insert([
      {
        user_id: senderId,
        name: sender_name,
        friends: [receiverId], // Add receiver to the sender's friends list
      },
    ]);

    // Check if the sender insertion was successful
    if (senderError) {
      console.error("Error inserting sender friend list:", senderError);
      return {
        status: 500,
        message: `Error creating friend list for sender: ${senderError.message}`,
      };
    }

    // Insert for the receiver if the sender insertion is successful
    const { error: receiverError } = await supabase.from("friend_list").insert([
      {
        user_id: receiverId,
        name: receiver_name,
        friends: [senderId], // Add sender to the receiver's friends list
      },
    ]);

    // Check if the receiver insertion was successful
    if (receiverError) {
      console.error("Error inserting receiver friend list:", receiverError);
      return {
        status: 500,
        message: `Error creating friend list for receiver: ${receiverError.message}`,
      };
    }

    // If both insertions were successful
    return { status: 200, message: "Success" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { status: 500, message: "An unexpected error occurred" };
  }
}
