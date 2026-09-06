import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const LoginModal = () => {
  const { showUserLogin, setshowUserLogin, backendUrl, setToken, setUser } = useAppContext();
  const [currentState, setCurrentState] = useState("Login"); // "Login" or "Sign Up"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showUserLogin) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          setUser(response.data.user);
          toast.success("Account created successfully!");
          setshowUserLogin(false);
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token);
          setUser(response.data.user);
          toast.success("Logged in successfully!");
          setshowUserLogin(false);
          setEmail("");
          setPassword("");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Auth submit error:", error);
      toast.error(error.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 transition-all">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={() => setshowUserLogin(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentState === "Login" ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentState === "Login"
              ? "Sign in to access your orders and saved cart"
              : "Register to start shopping fresh groceries today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentState === "Sign Up" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dull text-white font-semibold rounded-lg text-sm transition duration-150 shadow disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Switch State */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {currentState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentState("Sign Up")}
                className="text-primary font-semibold hover:underline cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setCurrentState("Login")}
                className="text-primary font-semibold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
