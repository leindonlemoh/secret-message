import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
const Feed = () => {
  const [messagesContent, setMessagesContent] = useState([]);
  const fetchPost = async () => {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const { data: messages, error } = await supabase
      .from("messages")
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
  return (
    <div className="flex justify-center items-center">
      <p className="text-3xl">Ongoing ...</p>
    </div>
  );
};

export default Feed;
