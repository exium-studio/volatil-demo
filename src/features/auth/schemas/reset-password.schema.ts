// src/features/auth/schemas/reset-password.schema.ts

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const createResetPasswordRequestSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .pipe(z.email("Format email tidak valid")),
  });

export const createResetPasswordConfirmSchema = () =>
  z
    .object({
      email: z
        .string()
        .min(1, "Email wajib diisi")
        .pipe(z.email("Format email tidak valid")),
      resetToken: z
        .string()
        .min(4, "Kode / token verifikasi minimal 4 karakter"),

      newPassword: z
        .string()
        .min(1, "Kata sandi baru wajib diisi")
        .min(8, "Kata sandi baru minimal 8 karakter"),
      confirmPassword: z
        .string()
        .min(1, "Konfirmasi kata sandi wajib diisi"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru",
      path: ["confirmPassword"],
    });

export const createChangePasswordSchema = () =>
  z
    .object({
      currentPassword: z
        .string()
        .min(1, "Kata sandi saat ini wajib diisi"),
      newPassword: z
        .string()
        .min(1, "Kata sandi baru wajib diisi")
        .min(8, "Kata sandi baru minimal 8 karakter"),
      confirmPassword: z
        .string()
        .min(1, "Konfirmasi kata sandi wajib diisi"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Konfirmasi kata sandi tidak cocok dengan kata sandi baru",
      path: ["confirmPassword"],
    });

export { zodResolver };

