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
            VERIFY USER SESSION
  ------------------------------ */
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          // Add Authorization header manually since axios interceptor might not be set yet
          const { data } = await axios.get("/auth/me", {
             headers: { Authorization: `Bearer ${storedToken}` } 
          });
          
          if (data.user) {
             const updatedUser = { ...data.user, token: storedToken }; 
             // We don't store token inside user object generally, but let's keep consistent with login
             
             setUser(data.user); // Update state with fresh data from DB (including new verificationStatus)
             localStorage.setItem("user", JSON.stringify(data.user)); // Sync local storage
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          // Optional: Logout if token is invalid? 
          // logout(); 
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

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
        ...data.user // Merge server data to get latest status
      };

      setUser(fullUser);
      setToken(data.token);

      localStorage.setItem("user", JSON.stringify(fullUser));
      localStorage.setItem("token", data.token);

      return { user: fullUser, token: data.token };
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
        ...data.user
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

  /* -----------------------------
            REGISTER ORGANIZATION
  ------------------------------ */
  const registerOrg = async (dataPayload) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register-org", dataPayload);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        registerOrg,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
