import axios from "axios";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

console.log("SERVER_URL:", SERVER_URL);

const api = axios.create({
  baseURL: `${SERVER_URL}/api`,
  withCredentials: false,
});

export default api;
