'use client'
import React, { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation' // Use useRouter for redirection
import Feed from '../pages/Feed'
import Profile from '../pages/Profile'
const Page = () => {
  const [user, setUser] = useState(null);
  const [isActivePage,setIsActivePage] = useState('profile')
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data?.user) {
        console.log(data.user);
        setUser(data.user);
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
      <p>Welcome, {user?.user_metadata?.full_name}</p> 
     {isActivePage == 'profile' && <Profile />}
      {isActivePage == 'feed' && <Feed />}
    </div>
  );
};

export default Page;
