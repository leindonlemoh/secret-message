import React from "react";
import UserList from "../../components/UserList";
import FriendRequests from "../../components/FriendRequests";

const Friends = () => {
  return (
    <section>
      <UserList />
      <FriendRequests />
    </section>
  );
};

export default Friends;
