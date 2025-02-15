"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { createClient } from "../../utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation"; // Use useRouter for redirection
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import Friends from "../pages/Friends";
import CompleteAccount from "../components/CompleteAccount";
import { fetchData } from "../../utils/fetchData";
const Page = () => {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [isActivePage, setIsActivePage] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();
  const tab = searchParams.get("tab");
  useEffect(() => {
    if (tab) {
      setIsActivePage(tab);
    }
  }, [tab]);
  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data?.user) {
        setUser(data.user);

        const { data: userProfile, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
        setUserName(userProfile?.name);
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (userProfile) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      }
    };

    fetchUser();
  }, [router]);
  if (user === null) {
    return <div> You are not Logged In</div>;
  }

  return (
    <div>
      <NavBar setActive={setIsActivePage} active={isActivePage} />
      <p>Welcome, {userName}</p>
      {!hasProfile && <CompleteAccount />}
      {isActivePage == "profile" && hasProfile && <Profile />}
      {isActivePage == "feed" && hasProfile && <Feed />}
      {isActivePage == "friends" && hasProfile && <Friends />}
    </div>
  );
};

export default Page;
