import axios from "axios";

export const API = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

// Attach JWT token from localStorage to Authorization header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
