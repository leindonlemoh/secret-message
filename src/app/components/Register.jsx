import React from 'react'
import { signup } from '../../lib/auth-actions'
const Register = () => {
  return (
<div className="w-[40%] h-full m-3 border-2 border-blue-500 bg-blue-900 text-white rounded-lg shadow-lg">
  <form className="flex flex-col p-4 gap-3 w-full">
    <label htmlFor="firstName" className="text-sm font-semibold">First Name:</label>
    <input
      id="firstName"
      name="firstName"
      type="text"
      required
      className="p-2 rounded-md text-black text-sm"
    />
    <label htmlFor="lastName" className="text-sm font-semibold">Last Name:</label>
    <input
      id="lastName"
      name="lastName"
      type="text"
      required
      className="p-2 rounded-md text-black text-sm"
    />
    <label htmlFor="email" className="text-sm font-semibold">Email:</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      className="p-2 rounded-md text-black text-sm"
    />
    <label htmlFor="password" className="text-sm font-semibold">Password:</label>
    <input
      className="p-2 rounded-md text-black text-sm"
      id="password"
      name="password"
      type="password"
      required
    />
    <button
      formAction={signup}
      className="p-2 mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-all"
    >
      Sign up
    </button>
  </form>
</div>


  )
}

export default Register