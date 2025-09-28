"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { StoryForm, storySchema } from "@/schema/stories-schema";
import { createStory } from "@/services/stories";
import { getAllProvinces } from "@/services/province";
import { useRouter } from "next/navigation";

export default function CreateStoryPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryForm>({
    resolver: zodResolver(storySchema),
  });

  const mutation = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      alert("Story berhasil dibuat!");
      router.push("/stories");
    },
    onError: (err) => {
      alert(err.message || "Terjadi kesalahan");
    },
  });

  const { data } = useQuery({
    queryFn: () => getAllProvinces(),
    queryKey: ["provinces"],
  });

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Buat Story Baru</h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        {/* Judul */}
        <div>
          <label className="block font-medium">Judul</label>
          <input
            type="text"
            {...register("title")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Sinopsis */}
        <div>
          <label className="block font-medium">Sinopsis</label>
          <textarea
            {...register("sinopsis")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.sinopsis && (
            <p className="text-red-500 text-sm">{errors.sinopsis.message}</p>
          )}
        </div>

        {/* Konten */}
        <div>
          <label className="block font-medium">Konten</label>
          <textarea
            rows={6}
            {...register("content")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Province */}
        <div>
          <label className="block font-medium">Provinsi</label>
          <select
            {...register("province_id")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Pilih Provinsi</option>
            {data?.data.data.map(
              (province: { id: string; name: string; code: string }) => (
                <option key={province.id} value={province.id}>
                  {province.name} ({province.code})
                </option>
              )
            )}
          </select>
          {errors.province_id && (
            <p className="text-red-500 text-sm">{errors.province_id.message}</p>
          )}
        </div>

        {/* Cover Upload */}
        <div>
          <label className="block font-medium">Cover</label>
          <input type="file" accept="image/*" {...register("cover")} />
          {errors.cover && (
            <p className="text-red-500 text-sm">{errors.cover.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
