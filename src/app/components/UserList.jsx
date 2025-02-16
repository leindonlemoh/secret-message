import React, { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { createRequest } from "../../lib/sendRequest";
import { deleteData } from "../../utils/deleteData";
import { fetchData, checkFriendRequest } from "../../utils/fetchData";
import { getUser } from "../../utils/supabase/getUser";
import Swal from "sweetalert2";
import useSWR, { mutate } from "swr";

const UserList = () => {
  const [userAuth, setUserAuth] = useState({
    id: "",
    name: "",
  });

  // Fetch Users
  const fetchUsers = async () => {
    const supabase = createClient();
    const { data: users, error } = await supabase
      .from("profile")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }

    return users;
  };

  // Fetch user authentication data
  const fetchOwn = async () => {
    const userData = await getUser();
    if (!userData?.id) {
      console.error("User not found.");
      return;
    }
    const response = await fetchData("profile", { user_id: userData?.id });
    if (response[0]?.user_id && response[0]?.name) {
      setUserAuth({
        id: response[0]?.user_id,
        name: response[0]?.name,
      });
    } else {
      console.error("Profile data not found or missing fields.");
    }
  };

  // Fetch friend requests
  const fetchMyRequests = async () => {
    if (!userAuth?.id) return [];
    const response = await checkFriendRequest(userAuth?.id);
    return response || [];
  };

  useEffect(() => {
    fetchOwn();
  }, []);

  const {
    data: userList = [], // Default empty array if no data
    error,
    isLoading,
  } = useSWR("fetch_users", fetchUsers, {
    refreshInterval: 10000,
  });

  const {
    data: myRequests = [], // Default empty array if no data
    error: reqError,
    isLoading: reqLoading,
  } = useSWR("fetch_request", fetchMyRequests, {
    refreshInterval: 10000,
  });

  const onCancelRequest = async (e, id) => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteData("friend_requests", id);
        if (response.status == 200) {
          Swal.fire("Cancelled!", "", "success").then(() => {
            mutate("fetch_users");
            mutate("fetch_request");
          });
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const sendRequest = async (e, id) => {
    e.preventDefault();
    if (!userAuth?.id) {
      console.error("User is not authenticated.");
      return;
    }
    const response = await createRequest(userAuth?.id, userAuth?.name, id);
    if (response.status === 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Request has been sent",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("fetch_users");
        mutate("fetch_request");
      });
    } else {
      console.error("Error sending request:", response.message);
    }
  };

  if (isLoading || reqLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[25vh] border-2 border-[red] flex flex-row flex-wrap gap-4 ps-1 pt-5">
      {userList?.map((userItems, index) => {
        if (userItems?.user_id !== userAuth?.id) {
          const matchedRequest = myRequests.find(
            (req) =>
              req?.receiver_id === userItems?.user_id &&
              req?.status === "pending"
          );
          const isReceiver = userAuth?.id === matchedRequest?.receiver_id;
          console.log(matchedRequest);
          console.log(isReceiver, "isReceiver");
          return (
            <div
              className="h-[80%] bg-white rounded-lg border-2 border-gray-300 shadow-md p-4"
              key={index}
            >
              <p className="text-xl font-semibold text-gray-800">
                {userItems?.name}
              </p>
              <span className="text-sm text-gray-600">
                Joined in:{" "}
                {new Date(String(userItems?.created_at)).toLocaleDateString(
                  "fr-CA",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
              </span>
              {matchedRequest ? (
                <div className=" flex flex-row">
                  <button
                    className="w-[50%] mt-4  py-2 bg-gray-500 text-white font-semibold rounded-md cursor-not-allowed"
                    disabled
                  >
                    Pending
                  </button>
                  <button
                    className="w-[50%] mt-4  py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                    onClick={(e) => onCancelRequest(e, matchedRequest.id)}
                  >
                    Cancel Request
                  </button>
                </div>
              ) : (
                <button
                  className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={(e) => sendRequest(e, userItems?.user_id)}
                >
                  Add Friend
                </button>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default UserList;
