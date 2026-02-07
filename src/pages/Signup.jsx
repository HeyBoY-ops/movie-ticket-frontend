import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, User, Film, ArrowRight, Building2 } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(name, email, password);
      // Wait a tick for animation
      setTimeout(() => {
        toast.success("Account created successfully!");
        navigate("/");
      }, 500);
    } catch (err) {
      toast.error(err.message || "Signup failed. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
            <img 
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=2670" 
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
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
                <p className="text-gray-400">Join the ultimate movie experience</p>
            </div>

            {/* Account Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-8">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 text-white shadow-lg text-sm font-medium transition-all">
                    <User className="w-4 h-4" /> Personal
                </button>
                <button 
                    onClick={() => navigate("/register-org")}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                >
                    <Building2 className="w-4 h-4" /> Partner
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            required
                            className="input-premium with-icon"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary-action w-full flex items-center justify-center gap-2 group mt-6"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white hover:text-red-500 font-semibold transition">
                        Sign In
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

export default Signup;
