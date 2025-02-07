'use client'
import React,{useState, useEffect} from "react";
import Image from "next/image";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import { useRouter } from 'next/navigation' 
import { getUser } from "../utils/supabase/getUser";
export default function Home() {
  
  // const [user, setUser] = useState(null);
  const router = useRouter(); 

         useEffect(() => {
            const fetchUser = async () => {
           const userData = await getUser();
           
           if (userData) {
              //  setUser(userData);
               router.push('/home')
             } else {
               console.log('No user logged in');
              //  setUser(null); 
             }
           };
       
           fetchUser(); 
         }, [router]); 

  return (
<div className="w-full h-full border-2">
  <NavBar/>
  <div className="flex flex-row items-center p-[10px]">
    <Login />
    <div className="border-2 border-[yellow] h-[210px] mx-1"></div>
    <Register />
  </div>
</div>




  );
}
