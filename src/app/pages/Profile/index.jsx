import React, { useState, useEffect } from "react";
import CreatePost from "../../components/CreatePost";
import Post from "../../components/Post";
import useSWR, { mutate } from "swr";
import { createClient } from "../../../utils/supabase/client";
import { deleteMessage } from "../../../lib/server-actions";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
const Profile = ({ name, user, userAuth }) => {
  console.log(userAuth);
  const [refresh, setRefresh] = useState(false);

  const fetchPost = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const { data: messages, error } = await supabase
      .from("message")
      .select("*")
      .eq("user_id", userAuth?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    return messages;
  };

  const {
    data: messagesContent = [],
    error,
    isLoading,
  } = useSWR("fetch_message", fetchPost, {
    refreshInterval: 10000,
  });

  const onDelete = async (e, id) => {
    e.preventDefault();
    setRefresh(true);

    const response = await deleteMessage(id);

    if (response?.status === 200) {
      Swal.fire({
        title: "Message Deleted",
        text: "Your Message was Deleted",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setRefresh(false);
        mutate("fetch_message");
      });
    }
  };

  useEffect(() => {
    console.log(messagesContent);
  }, [messagesContent]);

  return (
    <div>
      <CreatePost name={user?.name} userAuth={userAuth?.id} />
      <h3 className="text-2xl text-yellow-300">Your recent messages</h3>
      {refresh ? (
        <Loading />
      ) : (
        <div>
          {messagesContent.map((items, index) => (
            <div key={index}>
              <Post
                content={items}
                isLoading={isLoading}
                user={user}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
