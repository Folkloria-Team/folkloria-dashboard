import api from "@/lib/api";
import { LoginForm } from "@/schema/auth-schema";

export const login = async (payload: LoginForm) => {
  const { data } = await api.post("/auth/login", payload);

  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};
