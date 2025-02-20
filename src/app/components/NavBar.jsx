"use client";
import React, { useState, useEffect } from "react";
import { logout } from "../../lib/auth-actions";
import { deleteUserAuth } from "../../utils/supabase/deleteUser";
import { getUser } from "../../utils/supabase/getUser";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
const NavBar = ({ setActive, active }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const fetchUser = async () => {
    const userData = await getUser();
    if (userData) {
      setUser(userData);
    } else {
      return;
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const onDeleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteUserAuth(user?.id);
        if (res.status == 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          }).then(async () => {
            const response = await logout();

            if (response?.status == 200) {
              Swal.fire({
                title: "Signed Out!",
                text: "Succesfully signed out",
                icon: "success",
              }).then(() => {
                router.push("/");
              });
            }
          });
        } else {
          Swal.fire({
            title: "Something Went wrong",
            text: "Something",
            icon: "error",
          });
        }
      }
    });
  };
  return (
    <div className="bg-blue-900 w-full p-4">
      <div className="flex justify-between items-center">
        {/* Left Logo or Title */}
        <h2 className="text-white text-xl font-bold">Secret Message App </h2>

        {user && (
          <div>
            <div className="space-x-4">
              <button
                className={`text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2  ${
                  active == "profile" ? "border-2 border-white rounded-lg" : ""
                }`}
                onClick={() => {
                  setActive("profile");
                  router.push(`?tab=profile`);
                }}
              >
                Profile
              </button>
              <button
                className={`text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2 ${
                  active == "feed" ? "border-2 border-white rounded-lg" : ""
                }`}
                onClick={() => {
                  setActive("feed");
                  router.push(`?tab=feed`);
                }}
              >
                Feed
              </button>
              <button
                className={`text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2 ${
                  active == "friends" ? "border-2 border-white rounded-lg" : ""
                }`}
                onClick={() => {
                  setActive("friends");
                  router.push(`?tab=friends`);
                }}
              >
                Friendships
              </button>
            </div>
          </div>
        )}

        <div>
          {user && (
            <form className="flex gap-x-1">
              <button
                className="text-white hover:bg-blue-700 hover:text-blue-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                formAction={logout}
              >
                Logout
              </button>
              {user && (
                <button type="button" onClick={onDeleteAccount}>
                  Delete Account
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
