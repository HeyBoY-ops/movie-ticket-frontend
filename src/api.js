// // src/api.js
// import axios from "axios";

// // Base URL for API
// export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // Axios instance
// const api = axios.create({
//   baseURL: API,
//   withCredentials: true,
// });

// export default api;


// // src/api.js
// import axios from "axios";

// export const API = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

// // Axios instance
// const api = axios.create({
//   baseURL: API,
//   withCredentials: true,
// });

// export default api;


import axios from "axios";

// String base URL — keep name "API"
export const API = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

// Set axios global base URL
axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

// Export axios normally so all your old axios.get() still work
export default axios;
