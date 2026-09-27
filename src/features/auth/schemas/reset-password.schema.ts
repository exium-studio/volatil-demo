// src/features/auth/schemas/reset-password.schema.ts

// src\features\auth\schemas\reset-password.schema.ts

// src\features\auth\schemas\reset-password.schema.ts

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const createResetPasswordMethodSchema = () =>
  z.object({
    method: z.enum(["email", "totp"]),
  });

export const createResetPasswordRequestSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .pipe(z.email("Format email tidak valid")),
  });

export const createResetPasswordOtpSchema = () =>
  z.object({
    resetToken: z
      .string()
      .min(6, "Kode OTP minimal 6 digit")
      .max(6, "Kode OTP maksimal 6 digit"),
  });

export const createResetPasswordNewPasswordSchema = () =>
  z
    .object({
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


