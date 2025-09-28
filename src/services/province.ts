import api from "@/lib/api";

export function getAllProvinces() {
  return api.get("/province");
}
