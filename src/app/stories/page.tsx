/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteStory, getAllStories } from "@/services/stories";

type Story = {
  id: string;
  province_id: string;
  title: string;
  sinopsis: string;
  content: string;
  cover: string;
};

export default function Stories() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const { mutate: deleteDataStory } = useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      alert("Story berhasil dihapus");
    },
  });

  const { data } = useQuery({
    queryFn: () => getAllStories(),
    queryKey: ["stories"],
  });

  const stories: Story[] = data?.data.data || [];

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.sinopsis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Indonesian Folk Stories
              </h1>
              <p className="text-gray-600 text-lg">
                Koleksi cerita rakyat nusantara yang penuh makna dan wisdom
              </p>
            </div>

            <button
              onClick={() => router.push("stories/create")}
              className="group relative hover:cursor-pointer overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <Plus size={20} />
                Tambah Story
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-md">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari cerita..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStories.map((story, index) => (
            <div
              key={story.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200 hover:border-green-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Cover Image */}
              <div className="relative overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${story.cover}`}
                  alt={story.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  width={400}
                  height={250}
                  onError={(e) => {
                    if (
                      e.currentTarget.src !==
                      "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?w=400&h=250&fit=crop"
                    ) {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1584824486539-53bb4646bdbc?w=400&h=250&fit=crop";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {story.sinopsis}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors duration-200">
                    Baca Selengkapnya
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`stories/edit/${story.id}`)}
                      className="p-2 hover:cursor-pointer bg-green-50 hover:bg-green-100 text-green-600 rounded-xl hover:scale-110 transform transition-all duration-200"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Yakin ingin menghapus story ini?")) {
                          deleteDataStory(story.id);
                        }
                      }}
                      className="p-2 hover:cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 rounded-xl hover:scale-110 transform transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada cerita ditemukan
            </h3>
            <p className="text-gray-500">
              Coba kata kunci pencarian yang berbeda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
