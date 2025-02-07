import React from 'react'
import { login} from '../../lib/auth-actions'

const Login = () => {

return (
<div className="w-[50%] h-full m-3 border-2 border-blue-500 bg-blue-900 text-white rounded-lg shadow-lg">
  <form className="flex flex-col p-[25px] gap-5 w-full">
    <label htmlFor="email" className="text-lg font-semibold">Email:</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      className="p-2 rounded-md text-black"
    />
    <label htmlFor="password" className="text-lg font-semibold">Password:</label>
    <input
      id="password"
      name="password"
      type="password"
      required
      className="p-2 rounded-md text-black"
    />
    <button
      formAction={login}
      className="p-2 mt-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
    >
      Log in
    </button>
  </form>
</div>

  )
}

export default Login