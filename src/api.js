import axios from "axios";

export const API = import.meta.env.VITE_API_URL || "http://localhost:5050";

axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

export default axios;
