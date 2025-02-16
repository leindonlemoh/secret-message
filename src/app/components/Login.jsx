import React, { useState } from "react";
import { login } from "../../lib/auth-actions";
import { inputChange } from "../../lib/onChange";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
const Login = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const onLogin = async (e) => {
    e.preventDefault();
    const response = await login(userDetails);
    console.log(response);
    if (response?.status == 200) {
      Swal.fire({
        icon: "success",
        title: response?.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push("/home?tab=profile");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: response?.message,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="w-[50%] h-full m-3 border-2 border-blue-500 bg-blue-900 text-white rounded-lg shadow-lg">
      <form className="flex flex-col p-[25px] gap-5 w-full" onSubmit={onLogin}>
        <label htmlFor="email" className="text-lg font-semibold">
          Email:
        </label>
        <input
          name="email"
          type="email"
          onChange={(e) => inputChange(e, setUserDetails)}
          required
          className="p-2 rounded-md text-black"
        />
        <label htmlFor="password" className="text-lg font-semibold">
          Password:
        </label>
        <input
          name="password"
          type="password"
          onChange={(e) => inputChange(e, setUserDetails)}
          required
          className="p-2 rounded-md text-black"
        />
        <button
          type="submit"
          className="p-2 mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
