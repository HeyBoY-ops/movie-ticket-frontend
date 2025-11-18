import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, MapPin, User, Film, LogOut, Menu, X } from "lucide-react";

export default function Navbar({
  darkMode,
  toggleTheme,
  search,
  setSearch,
  location,
  setLocation,
}) {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const { user, logout } = useContext(AuthContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const sidebarRef = useRef(null);

  // Close profile sidebar on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => routerLocation.pathname === path;

  return (
    <nav
      className={`glass fixed top-0 left-0 right-0 z-50 ${
        darkMode ? "bg-black/40 text-white" : "bg-white/40 text-gray-900"
      } backdrop-blur-xl shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* NAVBAR INNER */}
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer space-x-2"
          >
            <Film className="w-8 h-8 text-yellow-400" />
            <span
              className="text-3xl font-bold text-yellow-400"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              MovieDay
            </span>
          </div>

          {/* SEARCH BAR (Your Feature) */}
          <div className="hidden md:block w-80">
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`px-4 py-2 rounded-xl w-full outline-none border ${
                darkMode
                  ? "bg-zinc-800 border-zinc-700 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              Home
            </Link>

            <Link
              to="/movies"
              className={`transition ${
                isActive("/movies")
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              Movies
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`transition ${
                    isActive("/profile")
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  My Bookings
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`transition ${
                      isActive("/admin")
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    Admin
                  </Link>
                )}

                {/* LOCATION INPUTS */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={18} />
                  <input
                    type="text"
                    placeholder="State"
                    value={location.state}
                    onChange={(e) =>
                      setLocation((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className={`border rounded px-2 py-1 w-24 text-sm ${
                      darkMode
                        ? "bg-zinc-800 border-zinc-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={location.city}
                    onChange={(e) =>
                      setLocation((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className={`border rounded px-2 py-1 w-24 text-sm ${
                      darkMode
                        ? "bg-zinc-800 border-zinc-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>

                {/* THEME TOGGLE */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-zinc-800 transition"
                >
                  {darkMode ? (
                    <Sun size={22} className="text-yellow-400" />
                  ) : (
                    <Moon size={22} className="text-gray-700" />
                  )}
                </button>

                {/* PROFILE BUTTON */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-600 transition"
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <button className="btn-secondary">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="btn-primary">Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-gray-300"
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </Link>

            <Link
              to="/movies"
              className="block text-gray-300 hover:text-yellow-400"
              onClick={() => setMobileMenu(false)}
            >
              Movies
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-300 hover:text-yellow-400"
                  onClick={() => setMobileMenu(false)}
                >
                  My Bookings
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block text-gray-300 hover:text-yellow-400"
                    onClick={() => setMobileMenu(false)}
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenu(false);
                  }}
                  className="block text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn-secondary w-full">Login</button>
                </Link>
                <Link to="/signup">
                  <button className="btn-primary w-full">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* PROFILE SIDEBAR */}
      {showSidebar && user && (
        <div
          ref={sidebarRef}
          className={`absolute top-20 right-4 w-72 p-4 rounded-xl shadow-xl ${
            darkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-lg font-bold mb-4">Profile</h2>

          <p className="mb-2">
            <span className="font-semibold">Name:</span> {user.name}
          </p>

          <p className="mb-2">
            <span className="font-semibold">Email:</span> {user.email}
          </p>

          <button
            onClick={logout}
            className="mt-4 w-full bg-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
