"use server";
import { createClient } from "../utils/supabase/server";
const supabase = await createClient();

export async function createRequest(senderId, name, reciverId) {
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();

  // if (!user) {
  //   console.error("User is not authenticated in addMessage server action");
  //   return { message: "User not authenticated" };
  // }

  const { error } = await supabase.from("friend_requests").insert([
    {
      sender_name: name,
      sender_id: senderId,
      receiver_id: reciverId,
      status: "pending",
    },
  ]);

  if (error) {
    console.error(error, "sss");
    return {
      status: 500,
      message: `Error sending Request ${error}`,
    };
  }

  //   revalidatePath("/home?tab=profile");

  return { status: 200, message: "Success" };
}
