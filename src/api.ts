import axios from "axios";

const api = axios.create({
  baseURL: "https://api-motivacional-network.vercel.app",
});

export default api;
