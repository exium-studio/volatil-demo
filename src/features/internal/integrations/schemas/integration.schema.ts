// src/features/internal/integrasi/schemas/integration.schema.ts

import { z } from "zod";

export const ssoFormSchema = z.object({
  internal: z.object({
    isEnabled: z.boolean(),
    issuerUrl: z
      .string()
      .min(1, "URL Issuer/Realm wajib diisi")
      .url("Format URL tidak valid"),
    clientId: z.string().min(1, "Client ID wajib diisi"),
    clientSecret: z.string().optional(),
    redirectUri: z
      .string()
      .min(1, "Redirect URI wajib diisi")
      .url("Format URL tidak valid"),
    allowedDomains: z.array(z.string()),
  }),
});

export const smtpFormSchema = z.object({
  host: z.string().min(1, "Host SMTP wajib diisi"),
  port: z
    .number()
    .int("Port harus berupa angka bulat")
    .min(1, "Port minimal 1")
    .max(65535, "Port maksimal 65535"),
  security: z.enum(["SSL", "STARTTLS", "NONE"]),
  user: z.string().min(1, "Username / API user wajib diisi"),
  password: z.string().optional(),
  fromEmail: z.string().min(1, "Email pengirim wajib diisi").email("Format email tidak valid"),
  fromName: z.string().min(1, "Nama pengirim wajib diisi"),
  rejectUnauthorized: z.boolean(),
});

export const smtpTestSchema = z.object({
  targetEmail: z
    .string()
    .min(1, "Email penerima uji coba wajib diisi")
    .email("Format email tidak valid"),
});

export const simponiFormSchema = z.object({
  baseUrl: z
    .string()
    .min(1, "Endpoint Base URL SIMPONI wajib diisi")
    .url("Format URL tidak valid"),
  kodeKl: z
    .string()
    .min(1, "Kode K/L wajib diisi")
    .length(3, "Kode K/L harus tepat 3 digit"),
  kodeSatker: z
    .string()
    .min(1, "Kode Satker wajib diisi")
    .length(6, "Kode Satker harus tepat 6 digit"),
  kodeAkun: z
    .string()
    .min(1, "Kode Akun/Mata Anggaran wajib diisi")
    .length(6, "Kode Akun harus tepat 6 digit"),
  apiKey: z.string().optional(),
  billingExpiryHours: z
    .number()
    .int("Masa berlaku harus berupa angka bulat")
    .min(1, "Masa berlaku minimal 1 jam")
    .max(720, "Masa berlaku maksimal 720 jam (30 hari)"),
  isSimulator: z.boolean(),
  isEnabled: z.boolean(),
});
