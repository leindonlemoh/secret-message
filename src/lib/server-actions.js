"use server";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
const supabase = await createClient();

export async function addMessage(formData) {
  const content = formData.get("content");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user?.user_metadata?.full_name);
  if (!user) {
    console.error("User is not authenticated in addMessage server action");
    return { message: "User not authenticated" };
  }

  const { data, error } = await supabase.from("message").insert([
    {
      content,
      user_id: user.id,
      posted_by: user.user_metadata.full_name,
    },
  ]);

  if (error) {
    console.error(error);
    return { status: 500, message: "Error inserting message" };
  }

  revalidatePath("/home?tab=profile");

  return { status: 200, message: "Success" };
}

export async function deleteMessage(formData) {
  const messageId = formData.get("id");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User is not authenticated in delete Message server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase
    .from("message")
    .delete()
    .match({ id: messageId, user_id: user.id });

  if (error) {
    console.error("Error deleting message", error);
    return { status: 500, message: "Error inserting message" };
  }
  // revalidatePath('/home')

  return { status: 200, message: "Success" };
}

export async function updateMessage(formData) {
  const id = formData.get("id");
  const content = formData.get("content");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(content);
  if (!user) {
    console.error(
      "User is not authenticated in updating Message server action"
    );
    return { message: "User not authenticated" };
  }
  const { data, error } = await supabase
    .from("message")
    .update({
      content,
    })
    .match({ id: id, user_id: user.id });

  if (error) {
    console.log(content + "content");
    console.log(id, "id");
    console.error("Error updating message", error);
    return { status: 500, message: "Error updating message" };
  }
  // revalidatePath('/home')

  return { status: 200, message: "Success" };
}

export async function getCurrentUser() {
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return;
  }

  console.log("Current user:", user);
  return user;
}
