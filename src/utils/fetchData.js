import { createClient } from "./supabase/client";

// General-purpose fetch function that can handle dynamic conditions
export const fetchData = async (from, conditions) => {
  const supabase = createClient();

  let query = supabase
    .from(from)
    .select("*")
    .order("created_at", { ascending: false });

  for (const [key, value] of Object.entries(conditions)) {
    query = query.eq(key, value);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const checkFriendRequest = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("sender_id", id);
  if (error) {
    console.error(error);
  }
  console.log(data);
  return data;
};
