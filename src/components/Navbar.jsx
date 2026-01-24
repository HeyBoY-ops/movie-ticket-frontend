import React, { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  MapPin,
  User,
  Film,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

export default function Navbar({ search, setSearch, location, setLocation }) {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const { user, logout } = useContext(AuthContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);

  const sidebarRef = useRef(null);
  const locationRef = useRef(null);

  const cities = [
    "Mumbai",
    "Delhi-NCR",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chandigarh",
    "Chennai",
    "Pune",
    "Kolkata",
    "Kochi",
  ];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => routerLocation.pathname === path;

  const handleCitySelect = (city) => {
    setLocation({ ...location, city });
    setShowLocationMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/90 text-white backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-6">
          {/* LEFT SECTION: LOGO & SEARCH */}
          <div className="flex items-center gap-8 flex-1">
            {/* LOGO */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center cursor-pointer gap-2"
            >
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                Movie<span className="text-red-600">Day</span>
              </span>
            </div>

            {/* SEARCH BAR */}
            <div className="hidden md:block flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-sm outline-none border focus:ring-1 focus:ring-red-500 transition bg-zinc-900 border-zinc-800 text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* RIGHT SECTION: LOCATION, LINKS, AUTH */}
          <div className="hidden md:flex items-center gap-6">
            {/* LOCATION DROPDOWN */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition"
              >
                {location.city || "Select City"} <ChevronDown size={14} />
              </button>

              {showLocationMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl border overflow-hidden py-2 bg-zinc-900 border-zinc-800">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 hover:text-red-500 transition ${
                        location.city === city ? "text-red-500 font-bold" : ""
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/movies"
              className={`text-sm font-medium transition ${
                isActive("/movies") ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              Movies
            </Link>

            <Link
              to="/events"
              className={`text-sm font-medium transition ${
                isActive("/events") ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition ${
                    isActive("/profile") ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  My Bookings
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition ${
                      isActive("/admin") ? "text-red-500" : "hover:text-red-500"
                    }`}
                  >
                    Admin
                  </Link>
                )}

                {/* PROFILE AVATAR */}
                <div className="relative" ref={sidebarRef}>
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-105 transition"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </button>

                  {showSidebar && (
                    <div className="absolute top-full right-0 mt-3 w-64 p-4 rounded-xl shadow-2xl border bg-zinc-900 border-zinc-800 text-white">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700/20">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-xs opacity-70 truncate w-32">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition text-sm font-medium"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <button className="px-5 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition shadow-lg shadow-red-500/30">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2"
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden py-4 space-y-4 border-t border-zinc-800">
            <div className="px-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-sm outline-none border bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <Link
              to="/"
              className="block px-2 py-1 hover:text-red-500"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block px-2 py-1 hover:text-red-500"
              onClick={() => setMobileMenu(false)}
            >
              Movies
            </Link>
            <Link
              to="/events"
              className="block px-2 py-1 hover:text-red-500"
              onClick={() => setMobileMenu(false)}
            >
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-2 py-1 hover:text-red-500"
                  onClick={() => setMobileMenu(false)}
                >
                  My Bookings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-2 py-1 hover:text-red-500"
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
                  className="block w-full text-left px-2 py-1 text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="px-2 pt-2 flex flex-col gap-2">
                <Link to="/login">
                  <button className="w-full py-2 rounded bg-red-500 text-white font-medium">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
