import { createContext, useState, useEffect } from "react";
import { API } from "../api";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(false);

  /* -----------------------------
        HELPER: decode JWT
  ------------------------------ */
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload; // { id, email, role }
    } catch (err) {
      console.error("JWT decode failed:", err);
      return null;
    }
  };

  /* -----------------------------
            LOGIN
  ------------------------------ */
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await axios.post("/auth/login", { email, password });

      const decoded = decodeToken(data.token);

      const fullUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: data.user?.name || "",
      };

      setUser(fullUser);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", data.token);

      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
            SIGNUP
  ------------------------------ */
  const signup = async (name, email, password) => {
    setLoading(true);

    try {
      const { data } = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      const decoded = decodeToken(data.token);

      const fullUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name,
      };

      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", data.token);

      setUser(fullUser);
      setToken(data.token);

      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
            LOGOUT
  ------------------------------ */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
