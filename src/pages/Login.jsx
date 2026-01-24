import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, Film } from "lucide-react";

// Demo Credentials Component
const DemoCredentials = ({ onSelect }) => {
  const demos = [
    { role: "Admin Demo", email: "admin@movieday.com", color: "bg-red-600 hover:bg-red-700" },
    { role: "Partner Demo", email: "inox@partner.com", color: "bg-blue-600 hover:bg-blue-700" },
    { role: "User Demo", email: "rohit@user.com", color: "bg-zinc-600 hover:bg-zinc-700" },
  ];

  return (
    <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold text-center">
        One-Click Demo Login
      </p>
      <div className="grid grid-cols-3 gap-2">
        {demos.map((d) => (
          <button
            key={d.role}
            type="button"
            onClick={() => onSelect(d.email, "password123")}
            className={`${d.color} text-white text-xs py-2 px-1 rounded-lg font-medium transition active:scale-95`}
          >
            {d.role}
          </button>
        ))}
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Film className="w-12 h-12 text-red-600" />
          </div>
          <h2
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Welcome Back
          </h2>
          <p className="text-gray-400">Login to book your favorite movies</p>
        </div>

        <DemoCredentials onSelect={handleDemoLogin} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
