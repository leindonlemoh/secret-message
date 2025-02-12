import React, { useState, useEffect } from "react";
import { signup } from "../../lib/auth-actions";
import Swal from "sweetalert2";
import { inputChange } from "../../lib/onChange";
const Register = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
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
        confirmButtonText: "OK",
      }).then(() => {
        setUserDetails({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        });
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
      <form className="flex flex-col p-4 gap-3 w-full" onSubmit={onRegister}>
        <label htmlFor="firstName" className="text-sm font-semibold">
          First Name:
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          onChange={(e) => inputChange({ e, setState: setUserDetails })}
          required
          className="p-2 rounded-md text-black text-sm"
        />
        <label htmlFor="lastName" className="text-sm font-semibold">
          Last Name:
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          onChange={(e) => inputChange({ e, setState: setUserDetails })}
          required
          className="p-2 rounded-md text-black text-sm"
        />
        <label htmlFor="email" className="text-sm font-semibold">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={(e) => inputChange({ e, setState: setUserDetails })}
          required
          className="p-2 rounded-md text-black text-sm"
        />
        <label htmlFor="password" className="text-sm font-semibold">
          Password:
        </label>
        <input
          className="p-2 rounded-md text-black text-sm"
          id="password"
          name="password"
          type="password"
          onChange={(e) => inputChange({ e, setState: setUserDetails })}
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
