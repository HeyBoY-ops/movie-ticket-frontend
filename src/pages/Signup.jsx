// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const Signup = () => {
//   const { signup } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const success = await signup(form.name, form.email, form.password);
//       if (success) navigate("/");
//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ff004c22,transparent_70%)] animate-pulse" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#ff8a0022,transparent_70%)] animate-pulse delay-500" />
//       </div>

//       <div className="relative z-10 w-[90%] sm:w-96 bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 p-8 shadow-[0_0_25px_rgba(255,0,76,0.3)] hover:shadow-[0_0_40px_rgba(255,0,76,0.6)] transition-all">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff004c] to-[#ff8a00] drop-shadow-[0_0_10px_#ff004c]">
//             Escape Room
//           </h1>
//           <p className="text-gray-400 mt-2 text-sm italic">
//             Join the world of cinema 🎬
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="relative">
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               placeholder="Full Name"
//               className="peer w-full p-3 pl-4 rounded-lg bg-zinc-800/70 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ff004c] transition"
//               required
//             />
//             <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#ff004c]">
//               Full Name
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="peer w-full p-3 pl-4 rounded-lg bg-zinc-800/70 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ff004c] transition"
//               required
//             />
//             <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#ff004c]">
//               Email
//             </label>
//           </div>

//           <div className="relative">
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"
//               className="peer w-full p-3 pl-4 rounded-lg bg-zinc-800/70 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#ff004c] transition"
//               required
//             />
//             <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#ff004c]">
//               Password
//             </label>
//           </div>

//           {error && <p className="text-red-400 text-center text-sm">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`mt-4 py-3 rounded-lg font-semibold text-lg text-white bg-gradient-to-r from-[#ff004c] to-[#ff8a00] hover:scale-[1.03] transition-transform shadow-[0_0_25px_rgba(255,0,76,0.4)] ${
//               loading ? "opacity-60 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Signing Up..." : "🎟️ Sign Up"}
//           </button>
//         </form>

//         <p className="text-gray-400 text-sm text-center mt-6">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-[#ff004c] hover:text-[#ff8a00] transition-colors font-medium"
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // Submit form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const success = await signup(form.name, form.email, form.password);
  //     if (success) navigate("/");
  //   } catch (err) {
  //     setError(err.message || "Signup failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await signup(form.name, form.email, form.password);

      if (!success) return;

      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (savedUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-20 flex items-center justify-center px-4 bg-[#0a0a1a] text-white"
      data-testid="signup-page"
    >
      <div className="max-w-md w-full">
        <div className="glass p-8 rounded-3xl shadow-xl border border-yellow-500/10">
          {/* Heading */}
          <h1
            className="text-4xl font-bold text-center mb-2 text-yellow-500"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Join MovieDay
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Create your account to start booking
          </p>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="pl-12 w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>

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
                  className="pl-12 w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 focus:ring-2 focus:ring-yellow-500 outline-none"
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="pl-12 w-full p-3 rounded-xl bg-zinc-900/70 border border-zinc-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
              data-testid="signup-submit-btn"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-500 hover:text-yellow-400 font-medium"
              data-testid="signup-login-link"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
