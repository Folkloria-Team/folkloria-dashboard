import { z } from "zod";

// ✅ Skema validasi pakai Zod
export const storySchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  sinopsis: z.string().min(10, "Sinopsis minimal 10 karakter"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  cover: z
    .any()
    .refine((file) => file?.length === 1, "Harus upload 1 file cover"),
  province_id: z.string().uuid("Province ID harus UUID valid"),
});

export const storyUpdateSchema = storySchema.extend({
  cover: z.any().optional(),
  // .refine(
  //   (file) =>
  //     !file ||
  //     (Array.isArray(file) && file.length === 1) || // array of 1 file
  //     file instanceof File, // single file
  //   "Jika diupload, harus upload 1 file cover"
  // ),
});

export type StoryForm = z.infer<typeof storySchema>;
export type StoryUpdateForm = z.infer<typeof storyUpdateSchema>;
