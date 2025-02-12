"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { createClient } from "../utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();
  console.log(formData, "form");

  const data = {
    email: formData?.email,
    password: formData?.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { status: 500, message: error?.message };
  } else {
    console.log("success");
    return { status: 200, message: "Successfully Logged In" };
  }
}
export async function signup(formData) {
  const supabase = await createClient();

  const firstName = formData.firstName;
  const lastName = formData.lastName;

  const data = {
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.email,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { status: 500, message: error };
  } else {
    return { status: 200, message: "Check your email" };
  }
  // revalidatePath("/", "layout");
  // redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  const { user, error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
