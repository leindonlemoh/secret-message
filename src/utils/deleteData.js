"use server";
import { createClient } from "./supabase/server";

export async function deleteData(from, id) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("User is not authenticated in delete Message server action");
    return { message: "User not authenticated" };
  }

  const { error } = await supabase.from(from).delete().match({ id: id });

  if (error) {
    console.error("Error deleting message", error);
    return { status: 500, message: "Error inserting message" };
  }
  // revalidatePath('/home')

  return { status: 200, message: "Success" };
}
