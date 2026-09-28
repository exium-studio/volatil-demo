// src/features/auth/schemas/mitra-registration.schema.ts

import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const fileSchema = (fieldName: string) =>
  z
    .array(z.custom<File>((val) => val instanceof File, "File tidak valid"))
    .min(1, `${fieldName} wajib diunggah`)
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      `Ukuran file maksimal 10MB`,
    )
    .refine(
      (files) =>
        files.every(
          (file) =>
            ALLOWED_MIME_TYPES.includes(file.type) ||
            file.name.endsWith(".pdf") ||
            file.name.endsWith(".doc") ||
            file.name.endsWith(".docx") ||
            file.name.endsWith(".jpg") ||
            file.name.endsWith(".jpeg") ||
            file.name.endsWith(".png"),
        ),
      `Format file harus PDF, Word, atau Gambar`,
    );

export const createMitraRegistrationSchema = () =>
  z.object({
    namaInstansi: z
      .string()
      .min(1, "Nama instansi/perusahaan wajib diisi")
      .max(255, "Nama instansi maksimal 255 karakter"),
    alamatKantor: z
      .string()
      .min(1, "Alamat kantor operasional wajib diisi")
      .max(500, "Alamat maksimal 500 karakter"),
    nib: z
      .string()
      .min(1, "Nomor Induk Berusaha (NIB) wajib diisi")
      .max(50, "NIB maksimal 50 karakter"),
    npwp: z
      .string()
      .min(1, "Nomor Pokok Wajib Pajak (NPWP) wajib diisi")
      .max(50, "NPWP maksimal 50 karakter"),
    website: z
      .string()
      .optional()
      .refine(
        (val) => !val || val === "" || /^https?:\/\/.+/i.test(val) || /^www\..+/i.test(val) || !val.includes(" "),
        "Format website tidak valid",
      ),
    namaPenanggungJawab: z
      .string()
      .min(1, "Nama penanggung jawab wajib diisi")
      .max(150, "Nama penanggung jawab maksimal 150 karakter"),
    jabatan: z
      .string()
      .min(1, "Jabatan penanggung jawab wajib diisi")
      .max(100, "Jabatan maksimal 100 karakter"),
    email: z
      .string()
      .min(1, "Email resmi instansi wajib diisi")
      .email("Format email tidak valid"),
    nomorHp: z
      .string()
      .min(1, "Nomor HP / WhatsApp wajib diisi")
      .regex(/^(\+62|62|08)[0-9]{8,13}$/, "Format nomor HP harus +62 atau 08 (10-15 digit)"),
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 6,
        "Kata sandi minimal 6 karakter jika diisi",
      ),

    // 6 Berkas Dokumen Wajib
    suratPermohonan: fileSchema("Surat Permohonan Kerjasama"),
    dokumenDik: fileSchema("Dokumen DIK"),
    suratPernyataanHukum: fileSchema("Surat Pernyataan Hukum"),
    suratKomitmenEvaluasi: fileSchema("Surat Komitmen Evaluasi (Lampiran III)"),
    suratKomitmenPerbaikan: fileSchema("Surat Komitmen Perbaikan (Lampiran IV)"),
    proposalTeknis: fileSchema("Proposal Teknis Pemanfaatan IGT"),
  });
