import React, { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";

import { checkFriendRequest } from "../../utils/fetchData";

import Swal from "sweetalert2";
import useSWR, { mutate } from "swr";

const UserList = ({
  onAccept,
  onCancelRequest,
  sendRequest,
  userAuth,
  onReject,
}) => {
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

  // Fetch My Requests
  const fetchMyRequests = async () => {
    if (!userAuth?.id) return [];
    const response = await checkFriendRequest(userAuth?.id);

    return response || [];
  };

  const {
    data: userList = [],
    error,
    isLoading,
  } = useSWR("fetch_users", fetchUsers, {
    refreshInterval: 10000,
  });

  const {
    data: myRequests = [],
    error: reqError,
    isLoading: reqLoading,
  } = useSWR("fetch_request", fetchMyRequests, {
    refreshInterval: 10000,
  });

  if (isLoading || reqLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[82vh]  flex flex-row flex-wrap gap-4 ps-5 pt-5">
      {userList?.map((userItems) => {
        // Skip rendering if the user is the same as userAuth
        if (userItems?.user_id === userAuth?.id) return null;

        // Check if the user is already in a pending or existing request with current user
        const isRequestSentOrReceived = myRequests?.some(
          (requestItems) =>
            (requestItems?.sender_id === userAuth?.id &&
              requestItems?.receiver_id === userItems?.user_id) ||
            (requestItems?.receiver_id === userAuth?.id &&
              requestItems?.sender_id === userItems?.user_id)
        );

        return (
          <div
            className="h-[25vh] w-[25%] bg-white rounded-lg border-2 border-gray-300 shadow-md p-4"
            key={userItems?.user_id}
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

            <div className="flex flex-row  ">
              {/* Add button */}
              {!isRequestSentOrReceived && (
                <button
                  className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={(e) => sendRequest(e, userItems?.user_id)}
                >
                  Add Friend
                </button>
              )}

              {myRequests?.map((requestItems, i) => {
                // Pending Cancel
                if (
                  userAuth?.id == requestItems?.sender_id &&
                  userItems?.user_id == requestItems?.receiver_id &&
                  requestItems?.status == "pending"
                ) {
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center  w-full"
                    >
                      <div className="flex flex-col gap-3 p-3 w-full">
                        <button
                          className="w-[100%]  py-2 bg-gray-500 text-white font-semibold rounded-md cursor-not-allowed"
                          disabled
                        >
                          Pending
                        </button>
                        <button
                          className="w-[100%]  p-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                          onClick={(e) => onCancelRequest(e, requestItems.id)}
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  );
                }
                // Accept Reject Button
                if (
                  userAuth?.id === requestItems?.receiver_id &&
                  userItems?.user_id === requestItems?.sender_id &&
                  requestItems?.status == "pending"
                ) {
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center  w-full"
                    >
                      <div className="flex flex-col gap-3 p-3 w-full">
                        <button
                          className="w-[100%]  py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                          onClick={() =>
                            onAccept(
                              requestItems.id,
                              userItems?.user_id,
                              userItems?.name
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="w-[100%]  py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                          onClick={(e) => onReject(e, requestItems?.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                }
                // Accepted
                if (
                  (userItems?.user_id == requestItems?.sender_id ||
                    userItems?.user_id == requestItems?.receiver_id) &&
                  requestItems?.status === "accepted"
                ) {
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-center  w-full"
                    >
                      <button
                        className="w-[100%] mt-4 py-2 bg-gray-500 text-white font-semibold rounded-md cursor-not-allowed"
                        disabled
                      >
                        Accepted
                      </button>
                    </div>
                  );
                }
                // Rejected
                if (
                  (userItems?.user_id == requestItems?.sender_id ||
                    userItems?.user_id == requestItems?.receiver_id) &&
                  requestItems?.status === "reject"
                ) {
                  return (
                    <div key={i}>
                      <button
                        className="w-[100%] mt-4 py-2 bg-red-500 text-white font-semibold rounded-md cursor-not-allowed"
                        disabled
                      >
                        Rejected
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
