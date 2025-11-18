// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     try {
//       const saved = localStorage.getItem("user");
//       return saved ? JSON.parse(saved) : null;
//     } catch {
//       return null;
//     }
//   });

//   const [token, setToken] = useState(
//     () => localStorage.getItem("token") || null
//   );
//   const [loading, setLoading] = useState(false);

//   // const login = async (email, password) => {
//   //   const res = await fetch("http://localhost:5050/api/auth/login", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ email, password }),
//   //   });

//   //   const data = await res.json();
//   //   if (!res.ok) throw new Error(data.message || "Invalid credentials");

//   //   setUser(data.user);
//   //   setToken(data.token);
//   //   localStorage.setItem("user", JSON.stringify(data.user));
//   //   localStorage.setItem("token", data.token);
//   //   return true;
//   // };

//   const login = async (email, password) => {
//     const res = await fetch("http://localhost:5050/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Invalid credentials");

//     const decoded = JSON.parse(atob(data.token.split(".")[1])); // decode JWT payload

//     const fullUser = {
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role, // <-- IMPORTANT
//       name: data.user?.name,
//     };

//     setUser(fullUser);
//     setToken(data.token);

//     localStorage.setItem("user", JSON.stringify(fullUser));
//     localStorage.setItem("token", data.token);

//     return true;
//   };

//   // const signup = async (name, email, password) => {
//   //   const res = await fetch("http://localhost:5050/api/auth/signup", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ username: name, email, password }),
//   //   });

//   //   const data = await res.json();
//   //   if (!res.ok) throw new Error(data.message || "Signup failed");

//   //   setUser(data.user);
//   //   setToken(data.token);
//   //   localStorage.setItem("user", JSON.stringify(data.user));
//   //   localStorage.setItem("token", data.token);
//   //   return true;
//   // };

//   const signup = async (name, email, password) => {
//     const res = await fetch("http://localhost:5050/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username: name, email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Signup failed");

//     const decoded = JSON.parse(atob(data.token.split(".")[1]));

//     const fullUser = {
//       id: decoded.id,
//       email: decoded.email,
//       role: decoded.role,
//       name,
//     };

//     setUser(fullUser);
//     setToken(data.token);

//     localStorage.setItem("user", JSON.stringify(fullUser));
//     localStorage.setItem("token", data.token);

//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   const value = {
//     user,
//     token,
//     login,
//     signup,
//     logout,
//     isAuthenticated: !!user && !!token,
//     loading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useState, useEffect } from "react";

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
    const res = await fetch("http://localhost:5050/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) throw new Error(data.message || "Invalid credentials");

    const decoded = decodeToken(data.token);
    if (!decoded) throw new Error("Failed to decode token");

    const fullUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, // 👈 IMPORTANT
      name: data.user?.name || "",
    };

    setUser(fullUser);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", data.token);

    return true;
  };

  /* -----------------------------
            SIGNUP
  ------------------------------ */
  const signup = async (name, email, password) => {
    setLoading(true);
    const res = await fetch("http://localhost:5050/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) throw new Error(data.message || "Signup failed");

    const decoded = decodeToken(data.token);
    if (!decoded) throw new Error("Failed to decode token");

    const fullUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role, // 👈 IMPORTANT
      name,
    };

    setUser(fullUser);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(fullUser));
    localStorage.setItem("token", data.token);

    return true;
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
