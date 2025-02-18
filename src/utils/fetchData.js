import { createClient } from "./supabase/client";

// General-purpose fetch function that can handle dynamic conditions
export const fetchData = async (from, conditions) => {
  console.log(conditions);
  const supabase = createClient();
  if (from != undefined && conditions != undefined) {
    let query = supabase
      .from(from)
      .select("*")
      .order("created_at", { ascending: false });

    for (const [key, value] of Object.entries(conditions)) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error.message);
    }

    return data;
  }
};

export const checkFriendRequest = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .or(`sender_id.eq.${id},receiver_id.eq.${id}`); // Use the `.or` method to check for both sender_id and receiver_id

  if (error) {
    console.error("Error fetching friend requests:", error);
  }

  return data;
};
