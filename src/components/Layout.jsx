import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("userLocation");
    return saved ? JSON.parse(saved) : { state: "Maharashtra", city: "Mumbai" };
  });

  useEffect(() => {
    localStorage.setItem("userLocation", JSON.stringify(location));
  }, [location]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      <Navbar
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
      />
      
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-black via-[#050505] to-black">
        <Outlet context={{ search, setSearch, location }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
