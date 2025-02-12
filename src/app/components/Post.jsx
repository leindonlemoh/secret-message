"use client";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { deleteMessage, updateMessage } from "../../lib/server-actions";
import Swal from "sweetalert2";

const Post = ({ content, setIsLoading, fetchPost }) => {
  // console.log(content)
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [postContent, setPostContent] = useState(content.content);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      // console.log(data.user)

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data && data.user) {
        // console.log(data.user.id);
        setUser(data.user);
      } else {
        console.log("No user logged in");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient(); // Create the Supabase client

      // Fetch all data from 'auth.users' table
      const {
        data: { users },
        error,
      } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Fetched users:", data);
      }
    };

    fetchUsers();
  }, []);
  const onDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    const formData = new FormData(e.target);
    const response = await deleteMessage(formData);

    setIsDeleting(false);
    if (response?.status === 200) {
      Swal.fire({
        title: "Message Deleted",
        text: "Your Message was Deleted",
        icon: "success",
        confirmButtonText: "OK",
      })
        .then(() => {
          setIsLoading(true);
        })
        .then(() => {
          fetchPost();
          setIsLoading(false);
        });
    }
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const formData = new FormData(e.target);
    const response = await updateMessage(formData);
    if (response?.status === 200) {
      Swal.fire({
        title: "Message Updated!",
        text: "Your message was successfully Updated.",
        icon: "success",
        confirmButtonText: "OK",
      })
        .then(() => {
          setIsEditing(false);
          setIsLoading(true);
        })
        .then(() => {
          fetchPost();
          setIsLoading(false);
        });
    } else {
      Swal.fire({
        title: "Error!",
        text: response?.message || "Something went wrong.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg border-2 border-blue-800 max-w-xl mx-auto my-4 shadow-lg relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <div>
          {isEditing ? (
            <></>
          ) : (
            <button
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={onDelete}>
          <input type="hidden" name="id" value={content?.id} />
          <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300">
            Delete
          </button>
        </form>
      </div>
      <div className=" flex flex-col">
        <div>
          <h5>{content?.posted_by}</h5>
        </div>
        <div className="border-2 border-blue-600 rounded-lg p-5 mt-2">
          {isEditing ? (
            <form onSubmit={onUpdate}>
              <input type="hidden" name="id" value={content.id} id="id" />
              <textarea
                className="w-full p-3 bg-blue-900 text-white border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
                name="content"
                id="content"
                value={postContent}
                onChange={handleContentChange}
                rows="5"
              />
              <button
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="submit"
              >
                Update
              </button>
            </form>
          ) : (
            <p className="text-base leading-relaxed">{content?.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
