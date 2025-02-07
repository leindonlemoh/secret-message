'use client'
import React, { useState, useEffect } from 'react'
import {logout} from '../../lib/auth-actions'
import {getUser} from '../../utils/supabase/getUser'
import { useRouter } from 'next/navigation'
const NavBar = ({setActive,active}) => {
   const [user, setUser] = useState(null);
   const router = useRouter();

    useEffect(() => {
       const fetchUser = async () => {
      const userData = await getUser();
      if (userData) {
          setUser(userData);
// console.log('userData',userData)
        } else {
          console.log('No user logged in');
          setUser(null); 
        }
      };
  
      fetchUser(); 
    }, []); 
  
  

  return (
<div className="bg-blue-900 w-full p-4">
  <div className="flex justify-between items-center">
    {/* Left Logo or Title */}
    <div className="text-white text-xl font-bold">
      MyWebsite
    </div>


{user && <div>
    <div className="space-x-4">
      <button className={`text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2  ${active == 'profile' ? 'border-2 border-white rounded-lg':''}`}
     onClick={() => {setActive('profile')
      router.push(`?tab=profile`)
     }}
      >
        Profile
      </button>
      <button className={`text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2 ${active == 'feed' ? 'border-2 border-white rounded-lg':''}`}
      onClick={() => {setActive('feed')
        router.push(`?tab=feed`)
      }}
      >
        Feed
      </button>
    </div></div>}


    <div>

    {user &&  
    
    <form>

    <button className="text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      formAction={logout}
      >
        Logout
      </button>
        </form>
      
      }
    </div>
  </div>
</div>


  )
}

export default NavBar