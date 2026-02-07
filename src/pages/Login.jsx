import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, Film, ArrowRight } from "lucide-react";

// Demo Credentials Component
const DemoCredentials = ({ onSelect }) => {
  const demos = [
    { role: "Admin Demo", email: "admin@movieday.com", label: "Admin" },
    { role: "Partner Demo", email: "inox@partner.com", label: "Partner" },
    { role: "User Demo", email: "rohit@user.com", label: "User" },
  ];

  return (
    <div className="mb-8 p-1 bg-white/5 rounded-xl flex gap-1 border border-white/5">
        {demos.map((d) => (
          <button
            key={d.role}
            type="button"
            onClick={() => onSelect(d.email, "password123")}
            className="flex-1 text-gray-400 hover:text-white text-xs py-2 rounded-lg transition hover:bg-white/10 font-medium"
          >
            {d.label}
          </button>
        ))}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { user } = await login(email, password);
      // Wait a tick for animation
      setTimeout(() => {
        toast.success(`Welcome back, ${user.name || "User"}!`);
        if (user.role === "ORGANIZATION") {
            navigate("/dashboard/business-analytics");
        } else if (user.role === "admin" || user.role === "SUPER_ADMIN") {
            navigate("/dashboard/admin-overview");
        } else {
            navigate("/");
        }
      }, 500);
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
            <img 
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=2525" 
                alt="Cinema Background" 
                className="w-full h-full object-cover opacity-50"
            />
        </div>

      <div className="relative z-20 w-full max-w-md animate-fade-in-up">
        <div className="glass-panel p-8 md:p-10 rounded-3xl">
            
            {/* Header */}
            <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                        <Film className="w-5 h-5 text-white fill-white" />
                    </div>
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
                <p className="text-gray-400">Enter your details to access your account</p>
            </div>

            <DemoCredentials onSelect={handleDemoLogin} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="email"
                            required
                            className="input-premium with-icon"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="password"
                            required
                            className="input-premium with-icon"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition">
                        <input type="checkbox" className="rounded border-gray-700 bg-white/5 text-red-600 focus:ring-red-600/50" />
                        <span>Remember me</span>
                    </label>
                    <a href="#" className="text-red-500 hover:text-red-400 font-medium transition">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary-action w-full flex items-center justify-center gap-2 group mt-4"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white hover:text-red-500 font-semibold transition">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
        
        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-gray-600">
            &copy; 2026 MovieDay. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
