import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import Post from "../../components/Post";
import useSWR from "swr";
import Loading from "../../components/Loading";
const Feed = ({ user }) => {
  console.log("user", user);
  // const [messagesContent, setMessagesContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  } = useSWR("fetch_messages", fetchPost, {
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
                <Post content={items} setIsLoading={setIsLoading} user={user} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Feed;
