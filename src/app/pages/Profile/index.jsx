import React, { useState, useEffect } from "react";
import CreatePost from "../../components/CreatePost";
import Post from "../../components/Post";

import { createClient } from "../../../utils/supabase/client";

const Profile = () => {
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
      .eq("user_id", user.id)
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
  return (
    <div>
      <div>
        <CreatePost setIsLoading={setIsLoading} fetchPost={fetchPost} />
      </div>
      <div>
        {messagesContent.map((items, index) => {
          return (
            <div key={index}>
              <Post
                content={items}
                setIsLoading={setIsLoading}
                fetchPost={fetchPost}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
