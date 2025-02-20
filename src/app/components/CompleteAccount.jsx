import React, { useState, useEffect, useTransition } from "react";
import { inputChange } from "../../lib/onChange";
import { addProfile } from "../../lib/account";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
const CompleteAccount = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userInfo?.firstName == "" || userInfo?.lastName == "") {
      Swal.fire({
        title: "Please fill up all the inputs",
        text: "All Inputs are Required",
        icon: "error",
      });
      return;
    }
    try {
      startTransition(async () => {
        const response = await addProfile(userInfo);
        if (response.status == 200) {
          Swal.fire({
            title: "Successfully Registered",
            text: response?.message,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: "Somthing went wrong",
            text: response?.message,
            icon: "error",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Somthing went wrong",
        text: response?.message,
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <div className="w-[100%] h-[85vh] ">
      <form
        onSubmit={(e) => onSubmit(e)}
        className="h-[80vh]   flex justify-center  p-6"
      >
        <div className="h-[550px] w-[500px] flex flex-col justify-center gap-5 p-10 border-2 border-white rounded-xl">
          <h2 className=" text-3xl text-slate-400">Enter your details</h2>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            className="text-black text-4xl rounded-lg border-transparent focus:outline-none focus:border-[#f1fd46] focus:ring-2 focus:ring-[#f1fd46] p-2 "
            value={userInfo?.firstName}
            onChange={(e) => inputChange(e, setUserInfo)}
          />
          <label htmlFor="">Last Name:</label>
          <input
            type="text"
            name="lastName"
            className="text-black text-4xl rounded-lg border-transparent focus:outline-none focus:border-[#f1fd46] focus:ring-2 focus:ring-[#f1fd46] p-2 "
            value={userInfo?.lastName}
            onChange={(e) => inputChange(e, setUserInfo)}
          />
          <button
            type="submit"
            className="bg-[#00FFFF] p-5 rounded-lg text-black text-2xl border-l"
            disabled={isPending}
          >
            {isPending ? "Processing" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompleteAccount;
