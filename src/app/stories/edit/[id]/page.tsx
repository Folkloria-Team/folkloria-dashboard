/* eslint-disable @next/next/no-img-element */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { StoryUpdateForm, storyUpdateSchema } from "@/schema/stories-schema";
import { getStoryById, updateStory } from "@/services/stories";
import { getAllProvinces } from "@/services/province";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function CreateEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // ✅ untuk isi ulang form ketika story data sudah ada
  } = useForm<StoryUpdateForm>({
    resolver: zodResolver(storyUpdateSchema),
  });

  // ✅ Ambil data provinsi
  const { data: provinces } = useQuery({
    queryFn: () => getAllProvinces(),
    queryKey: ["provinces"],
  });

  // ✅ Ambil data story jika edit
  const { data: storyData } = useQuery({
    queryFn: () => getStoryById(id),
    queryKey: ["story", id],
    enabled: !!id,
  });

  // ✅ Pre-fill form ketika storyData sudah ada
  useEffect(() => {
    if (storyData?.data?.data) {
      const s = storyData.data.data;
      reset({
        title: s.title,
        sinopsis: s.sinopsis,
        content: s.content,
        province_id: s.province_id,
      });
      setCoverPreview(`${process.env.NEXT_PUBLIC_API_URL}${s.cover}`);
    }
  }, [storyData, reset]);

  // ✅ Mutation update
  const mutation = useMutation({
    mutationFn: (formData: StoryUpdateForm) => updateStory(formData, id),
    onSuccess: () => {
      alert("Story berhasil diperbarui!");
      router.push("/stories");
    },
    onError: (err) => {
      alert(err.message || "Terjadi kesalahan");
    },
  });

  // ✅ handle cover change (preview)
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  if (!storyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {id ? "Edit Story" : "Buat Story Baru"}
      </h1>

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
            {provinces?.data.data.map(
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
          <input
            type="file"
            accept="image/*"
            {...register("cover")}
            onChange={handleCoverChange}
          />
          {coverPreview && (
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="mt-2 w-full h-48 object-cover rounded"
            />
          )}
          {errors.cover && (
            <p className="text-red-500 text-sm">{errors.cover.message ?? ""}</p>
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
