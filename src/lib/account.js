"use server";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";
const supabase = await createClient();

export async function addProfile(formData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User is not authenticated in addMessage server action");
    return { message: "User not authenticated" };
  }

  const { data, error } = await supabase.from("profile").insert([
    {
      name: `${formData?.firstName} ${formData?.lastName}`,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error(error);
    return { status: 500, message: "Error inserting message" };
  } else if (formData?.firstName == "" && formData?.lastName) {
    return;
  }
  return { status: 200, message: "Success" };
}
