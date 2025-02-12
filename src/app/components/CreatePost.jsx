"use client";
import React, { useState, useEffect } from "react";
import { addMessage } from "../../lib/server-actions";
import Swal from "sweetalert2";

const CreatePost = ({ setIsLoading, fetchPost }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const response = await addMessage(formData);

    setIsSubmitting(false);

    if (response?.status === 200) {
      Swal.fire({
        title: "Message Sent!",
        text: "Your message was successfully added.",
        icon: "success",
        confirmButtonText: "OK",
      })
        .then(() => {
          setIsLoading(true);
          fetchPost();
        })
        .then(() => {
          setContent("");
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

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto bg-blue-700 p-4 rounded-lg shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start space-y-4"
        >
          <textarea
            id="content"
            name="content"
            rows="2"
            value={content}
            onChange={handleChange}
            className="w-full p-3 bg-blue-900 text-white border border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="Type your secret message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
