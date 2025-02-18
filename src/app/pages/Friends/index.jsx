import React, { useState, useEffect } from "react";
import UserList from "../../components/UserList";
import { getUser } from "../../../utils/supabase/getUser";
import { fetchData } from "../../../utils/fetchData";
import { addFriend } from "../../../lib/updateFriendList";
import { createRequest, updateRequest } from "../../../lib/requestCU";
import { deleteData } from "../../../utils/deleteData";
import useSWR, { mutate } from "swr";
import Swal from "sweetalert2";
const Friends = () => {
  const [userAuth, setUserAuth] = useState({
    id: "",
    name: "",
  });

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

  useEffect(() => {
    fetchOwn();
  }, []);

  const onAccept = async (id, user2_Id, user2_name) => {
    const responseUpdate = await updateRequest(id, "accepted");

    if (responseUpdate.status == 200) {
      const response = await addFriend(userAuth?.id, user2_Id);
      if (response?.status == 200) {
        Swal.fire({
          icon: "success",
          title: response?.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          mutate("fetch_users");
          mutate("fetch_request");
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error: ${responseUpdate?.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const onReject = async (e, id) => {
    const response = await updateRequest(id, "reject");
    console.log(response?.status);
    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Response has been sent",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        mutate("fetch_users");
        mutate("fetch_request");
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Error: ${response?.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
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

  return (
    <section>
      <UserList
        onAccept={onAccept}
        onCancelRequest={onCancelRequest}
        sendRequest={sendRequest}
        userAuth={userAuth}
        onReject={onReject}
      />
    </section>
  );
};

export default Friends;
