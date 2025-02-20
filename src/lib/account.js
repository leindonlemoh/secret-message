"use server";

import { createClient } from "../utils/supabase/server";
const supabase = await createClient();

export async function addProfile(formData) {
  const { data, error } = await supabase.from("profile").insert([
    {
      name: `${formData?.firstName} ${formData?.lastName}`,
      user_id: formData?.id,
    },
  ]);

  if (error) {
    console.error(error);
    return {
      status: 500,
      message: `Error inserting message ${JSON.stringify(error)}`,
    };
  }
  return { status: 200, message: "Success" };
}
