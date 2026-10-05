// src/features/user-guide/schemas/user-guide.schema.ts

import { z } from "zod";

export const userGuideFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(3, "Judul panduan minimal 3 karakter")
    .max(150, "Judul panduan maksimal 150 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi dokumen minimal 10 karakter")
    .max(500, "Deskripsi dokumen maksimal 500 karakter"),
  category: z.enum(["mitra", "internal", "general", "api"]),
  targetRole: z.enum(["mitra", "internal", "all"]),
  version: z
    .string()
    .min(1, "Versi dokumen wajib diisi")
    .max(20, "Versi maksimal 20 karakter"),
  fileName: z
    .string()
    .min(3, "Nama file wajib diisi")
    .max(100, "Nama file maksimal 100 karakter"),
  fileUrl: z.string().min(1, "URL atau path file wajib diisi"),
  fileSize: z.number().min(1, "Ukuran file harus lebih dari 0"),
  fileType: z.string(),
  isPublished: z.boolean(),
  orderIndex: z.number().min(1, "Urutan minimal 1"),
});
