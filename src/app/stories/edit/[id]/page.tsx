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
import { env } from "@/lib/env";
import {
  BookOpen,
  FileText,
  AlignLeft,
  MapPin,
  Image,
  Save,
  Loader2,
} from "lucide-react";

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
    reset,
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
      setCoverPreview(`${env.apiUrl}${s.cover}`);
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl shadow-lg border border-emerald-100">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-gray-700 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/stories")}
          className="flex items-center gap-2 mb-6 px-4 py-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors duration-200 group"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Stories
        </button>

        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl border border-emerald-100 p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Story</h1>
          </div>
          <p className="text-gray-600 ml-16">Perbarui informasi story Anda</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-emerald-100 p-8 space-y-6">
          {/* Judul */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              Judul Story
            </label>
            <input
              id="title"
              type="text"
              placeholder="Masukkan judul yang menarik..."
              {...register("title")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200"
            />
            {errors.title && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.title.message}</p>
              </div>
            )}
          </div>

          {/* Sinopsis */}
          <div className="space-y-2">
            <label
              htmlFor="sinopsis"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <AlignLeft className="w-4 h-4 text-emerald-600" />
              Sinopsis
            </label>
            <textarea
              id="sinopsis"
              rows={3}
              placeholder="Tulis ringkasan singkat tentang story Anda..."
              {...register("sinopsis")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 resize-none"
            />
            {errors.sinopsis && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {errors.sinopsis.message}
                </p>
              </div>
            )}
          </div>

          {/* Konten */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Konten Story
            </label>
            <textarea
              id="content"
              rows={8}
              placeholder="Tulis cerita lengkap Anda di sini..."
              {...register("content")}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 resize-none"
            />
            {errors.content && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.content.message}</p>
              </div>
            )}
          </div>

          {/* Province */}
          <div className="space-y-2">
            <label
              htmlFor="province"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              Provinsi
            </label>
            <div className="relative">
              <select
                id="province"
                {...register("province_id")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.province_id && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {errors.province_id.message}
                </p>
              </div>
            )}
          </div>

          {/* Cover Upload */}
          <div className="space-y-2">
            <label
              htmlFor="cover"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              <Image className="w-4 h-4 text-emerald-600" />
              Cover Image
            </label>
            <div className="relative">
              <input
                id="cover"
                type="file"
                accept="image/*"
                {...register("cover")}
                onChange={handleCoverChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer cursor-pointer"
              />
            </div>
            {coverPreview && (
              <div className="mt-3 relative rounded-lg overflow-hidden border-2 border-emerald-100">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                  Preview
                </div>
              </div>
            )}
            {errors.cover && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  {errors.cover.message ?? ""}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/stories")}
              className="px-6 py-3 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              onClick={handleSubmit((data) => mutation.mutate(data))}
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Perbarui Story
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
