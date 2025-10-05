import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
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
