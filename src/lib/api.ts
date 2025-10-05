import axios from "axios";
import { env } from "./env";

const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // atau pakai cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
