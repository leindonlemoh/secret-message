"use client";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { updateMessage } from "../../lib/server-actions";
import Loading from "./Loading";
import Swal from "sweetalert2";
const Post = ({ content, isLoading, user, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const canRenderPost =
    user?.user_id === content?.user_id ||
    user?.friends?.some((friend) => friend === content?.user_id);

  if (!canRenderPost) return null;

  const handleChange = (e) => {
    const updatedContent = e.target.value;
    mutate(
      "fetch_message",
      (messagesContent) => {
        return messagesContent.map((message) =>
          message.id === content.id
            ? { ...message, content: updatedContent }
            : message
        );
      },
      false
    );
  };
  const onUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await updateMessage(formData);
    if (response?.status === 200) {
      Swal.fire({
        title: "Message Updated!",
        text: "Your message was successfully Updated.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        mutate("fetch_messages");
        setIsEditing(false);
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
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-black text-white p-6 rounded-lg border-2 border-blue-800 max-w-xl mx-auto my-4 shadow-lg relative">
          {user?.user_id === content?.user_id && (
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

              <button
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={(e) => onDelete(e, content?.id)}
              >
                Delete
              </button>
            </div>
          )}

          <div className="flex flex-col">
            <div>
              <h5>Posted by: {content?.posted_by}</h5>
            </div>
            <div className="border-2 border-blue-600 rounded-lg p-5 mt-2">
              {isEditing ? (
                <form onSubmit={onUpdate}>
                  <input type="hidden" name="id" value={content.id} id="id" />
                  <textarea
                    className="w-full p-3 bg-blue-900 text-white border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
                    name="content"
                    id="content"
                    value={content?.content}
                    onChange={handleChange} // This triggers handleContentChange from parent
                    rows="5"
                  />
                  <div className="flex flex-wor gap-x-1">
                    <button
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      cancel
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-base leading-relaxed">{content?.content}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
