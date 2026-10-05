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
  category: z.enum(["manual_book", "sop", "technical_spec", "regulation"]),
  targetRole: z.enum(["all", "mitra", "internal"]),
  version: z
    .string()
    .min(1, "Versi dokumen wajib diisi")
    .max(20, "Versi maksimal 20 karakter"),
  files: z.array(z.custom<File>()),
  isPublished: z.boolean(),
});


