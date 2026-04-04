´!import React from "react";
import authBg from "../assets/authBg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const {serverUrl,userData,
    setUserData}=useContext(userDataContext)
  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [err,setErr]=useState("")
  const [loading,setLoading]=useState(false)
  const handleSignUp=async(e)=>{
    e.preventDefault()
    setErr("")
    setLoading(true)
 try {
  let result= await axios.post(`${serverUrl}/api/auth/signup`,{
    name,email,password
  },{withCredentials:true})
  setUserData(result.data)
  setLoading(false)
  alert("Signup successful!")
  navigate("/customize")
 } catch (error) {
  setLoading(false)
  setUserData(null)
  console.log(error)
  // Display the actual error message from the server
  // const errorMessage = error.response?.data?.message || "Signup failed. Please try again."
  // alert(errorMessage)
  setErr(error.response.data.message)
 }
  }
  return (
    <div
      className="w-full h-screen flex items-center justify-center "
      style={{
        backgroundImage: `url(${authBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl px-8 py-10 border border-white/10">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center text-white mb-8">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Enter your Name"
            className="w-full bg-transparent border border-white/40 rounded-full px-5 py-3 text-white placeholder-white/70 focus:outline-none focus:border-blue-400"
            required onChange={(e)=>setName(e.target.value)}
            value={name}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border border-white/40 rounded-full px-5 py-3 text-white placeholder-white/70 focus:outline-none focus:border-blue-400"
             required onChange={(e)=>setEmail(e.target.value)}
            value={email}
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-6 py-3 rounded-full bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white"
               required onChange={(e)=>setPassword(e.target.value)}
            value={password} 
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 cursor-pointer select-none"
            >
              {showPassword ? "ğŸ™ˆ" : "ğŸ‘"}
            </span>
          </div>
          {err.length>0 && <p className="text-red-500 text-center">   
            *{err} 
          </p> }
          {/* Button */}
          <button
            type="submit"
            className="w-full bg-white text-gray-900 py-3 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition duration-300"
              disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6" onClick={()=>navigate("/signin")}>
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
í *cascade08íî*cascade08îû *cascade08û––Ğ *cascade08
Ğã ãï
ïó ó
¡ ¡Ú *cascade08
Úê ê€€‚ *cascade08‚‹‹’ *cascade08’——œ *cascade08œ­­±±Û *cascade08ÛİİŞ *cascade08Şááâ *cascade08âääş *cascade08
ş £
£¤ ¤¨¨õ *cascade08õøøÔ	 *cascade08Ô	×	×	ê	 *cascade08
ê	‘
 ‘
ş *cascade08
şœ 
œÀ 
ÀÄ 
ÄÒ ÒÙ
Ùå 
åë ëÑ *cascade08
ÑÓ ÓÕ
Õó ó‚ *cascade08‚  § *cascade08§©©´! *cascade082?file:///d:/project/virtualAssistant/client/src/pages/SignUp.jsx