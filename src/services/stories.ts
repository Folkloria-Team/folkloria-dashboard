import api from "@/lib/api";
import { StoryForm, StoryUpdateForm } from "@/schema/stories-schema";

// ✅ API request pakai FormData
export async function createStory(data: StoryForm) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("sinopsis", data.sinopsis);
  formData.append("content", data.content);
  formData.append("province_id", data.province_id);
  formData.append("island", data.island);

  if (data.cover && data.cover.length > 0) {
    formData.append("cover", data.cover[0]);
  }

  return api.post("/story", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updateStory(data: StoryUpdateForm, id: string) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("sinopsis", data.sinopsis);
  formData.append("content", data.content);
  formData.append("province_id", data.province_id);
  formData.append("island", data.island);

  if (data.cover && data.cover.length > 0) {
    formData.append("cover", data.cover[0]);
  }

  return api.put(`/story/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ✅ API Get All Stories
export async function getAllStories() {
  return api.get("/story");
}

export async function deleteStory(id: string) {
  return api.delete(`/story/${id}`);
}

export async function getStoryById(id: string) {
  return api.get(`/story/${id}`);
}
