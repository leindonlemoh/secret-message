import React, { useState, useEffect } from "react";
import { signup } from "../../lib/auth-actions";
import Swal from "sweetalert2";
import { inputChange } from "../../lib/onChange";
const Register = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const onRegister = async (e) => {
    e.preventDefault();

    const response = await signup(userDetails);

    console.log(response);
    if (response?.status === 200) {
      Swal.fire({
        title: "Successfully Registered",
        text: response?.message,
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        setUserDetails({
          email: "",
          password: "",
        });
        window.location.reload();
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
    <div className="w-[40%] h-full m-3 border-2 border-blue-500 bg-blue-900 text-white rounded-lg shadow-lg">
      <h3 className="text-3xl text-center mt-1">Register</h3>
      <form className="flex flex-col p-4 gap-5 w-full" onSubmit={onRegister}>
        <label htmlFor="email" className="text-sm font-semibold">
          Email:
        </label>
        <input
          name="email"
          type="email"
          onChange={(e) => inputChange(e, setUserDetails)}
          required
          className="p-2 rounded-md text-black text-sm"
        />
        <label htmlFor="password" className="text-sm font-semibold">
          Password:
        </label>
        <input
          className="p-2 rounded-md text-black text-sm"
          name="password"
          type="password"
          onChange={(e) => inputChange(e, setUserDetails)}
          required
        />
        <button className="p-2 mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-all">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default Register;
