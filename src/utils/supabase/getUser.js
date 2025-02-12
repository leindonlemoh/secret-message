import { createClient } from "./client";

export async function getUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  if (data && data.user) {
    return {
      id: data.user.id,
      name: data.user.user_metadata.full_name,
      email: data.user.email,
    };
  } else {
    return null;
  }
}
