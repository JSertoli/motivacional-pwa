import axios from "axios";

const api = axios.create({
  baseURL: "https://api-motivacional-network-gpo7r1a3e-jsertolis-projects.vercel.app",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;