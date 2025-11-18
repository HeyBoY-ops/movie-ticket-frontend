import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(form.email, form.password);

      if (!success) return;

      // redirect based on role
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-20 flex items-center justify-center px-4 bg-[#0a0a1a] text-white"
      data-testid="login-page"
    >
      <div className="max-w-md w-full">
        <div className="glass p-8 rounded-3xl shadow-xl border border-yellow-500/10">
          {/* Heading */}
          <h1
            className="text-4xl font-bold text-center mb-2 text-yellow-500"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Login to book your favorite movies
          </p>

          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
              data-testid="login-error"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  data-testid="login-email-input"
                  className="pl-12 w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                  className="pl-12 w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-500 hover:text-yellow-400 font-medium"
              data-testid="login-signup-link"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
