import { createClient } from "../utils/supabase/client";
const supabase = createClient();

export async function addFriend(userId, friendId) {
  // fetch auth user's profile's friend column
  const { data: user1Data, error: user1Error } = await supabase
    .from("profile")
    .select("friends")
    .eq("user_id", userId)
    .single();

  if (user1Error) {
    console.error("Error fetching user1 data", user1Error);
    return { status: 500, message: "Error fetching user1 data" };
  }

  // If the user already has a friends array, append the new friendId
  const updatedFriendsUser1 = user1Data.friends
    ? [...user1Data.friends, friendId] //spread or push on array
    : [friendId];

  // update profile friend (user auth/ current user)
  const { error: user1UpdateError } = await supabase
    .from("profile")
    .update({ friends: updatedFriendsUser1 })
    .eq("user_id", userId);

  if (user1UpdateError) {
    console.error("Error adding friend for user1", user1UpdateError);
    return { status: 500, message: "Error adding friend for user1" };
  }

  // Fget friend Id's profile's friends col
  const { data: friendData, error: friendError } = await supabase
    .from("profile")
    .select("friends")
    .eq("user_id", friendId)
    .single();

  if (friendError) {
    console.error("Error fetching friend data", friendError);
    return { status: 500, message: "Error fetching friend data" };
  }

  const updatedFriendsUser2 = friendData.friends
    ? [...friendData.friends, userId] // Append userId
    : [userId]; // If no friends yet, start the array with userId

  // Update the friend's friends array
  const { error: friendUpdateError } = await supabase
    .from("profile")
    .update({ friends: updatedFriendsUser2 })
    .eq("user_id", friendId);

  if (friendUpdateError) {
    console.error("Error adding friend for user2", friendUpdateError);
    return { status: 500, message: "Error adding friend for user2" };
  }

  return { status: 200, message: "Friend added successfully" };
}
