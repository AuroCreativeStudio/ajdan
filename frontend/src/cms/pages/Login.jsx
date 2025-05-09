// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import twoImage from "../../assets/image/two.jpg";
import logo from "../../assets/image/ajdan-light-logo.png";

function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();
    if (data.jwt) {
      setToken(data.jwt);
      setUser(data.user);
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900">
 
    <div className="absolute inset-0 z-0">
      <img
        src={twoImage} 
        alt="Background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-40">      
        <img
        src={logo}
        alt="Logo"
        className="mx-auto mt-10 border-gray-100 shadow"
      />
      </div>
    </div>
 
    <div className="relative z-10 max-w-md w-full mx-4 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-2xl flex flex-col items-center p-8">

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="username"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-100 text-gray-700"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-100 text-gray-700"
          required
        />
        <button
          type="submit"
          className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  </div>
  );
}

export default Login;


{/* <div className="min-h-screen flex flex-col md:flex-row">

      <div className="relative w-full md:w-1/2 h-60 md:h-auto flex items-center justify-center overflow-hidden">
        <img
          src={twoImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
          <img
            src={logo}
            alt="Logo"
            className="h-28 w-28 rounded-full bg-white/60 border-2 border-blue-200 shadow-xl object-contain p-3"
          />
        </div>
      </div>


      <div className="w-full md:w-1/2 flex items-center justify-center bg-white min-h-[60vh]">
        <div className="w-full max-w-md mx-4 bg-white bg-opacity-95 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center p-8 space-y-2">
          <h2 className="text-2xl font-extrabold mb-5 text-gray-800 text-center tracking-tight">Login into CMS</h2>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="username"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-100 text-gray-700"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-gray-100 text-gray-700"
              required
            />
            <button
              type="submit"
              className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-lg text-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div> */}

    