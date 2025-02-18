import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import Post from "../../components/Post";
const Feed = ({ user }) => {
  console.log("user", user);
  const [messagesContent, setMessagesContent] = useState([]);
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

    setMessagesContent(messages);
  };
  useEffect(() => {
    fetchPost();
  }, []);
  useEffect(() => {
    console.log(messagesContent);
  }, [messagesContent]);
  return (
    <div className="flex justify-center items-center">
      <div className="w-[60%]">
        {messagesContent.map((items, index) => {
          return (
            <div key={index}>
              <Post
                content={items}
                setIsLoading={setIsLoading}
                fetchPost={fetchPost}
                user={user}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
