import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import Post from "../../components/Post";
import useSWR from "swr";
import Loading from "../../components/Loading";
import { deleteMessage } from "../../../lib/server-actions";
const Feed = ({ user }) => {
  console.log("user", user);
  // const [messagesContent, setMessagesContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
  const fetchPost = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const { data: messages, error } = await supabase
      .from("message")
      .select("*")
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
    isLoading: postLoading,
  } = useSWR("fetch_message", fetchPost, {
    refreshInterval: 10000,
  });

  return (
    <div className="flex justify-center items-center">
      {postLoading ? (
        <Loading />
      ) : (
        <div className="w-[60%]">
          {messagesContent.map((items, index) => {
            return (
              <div key={index}>
                <div key={index}>
                  <Post
                    content={items}
                    isLoading={isLoading}
                    user={user}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feed;
