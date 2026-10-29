// src/features/internal/integration/schemas/integration.schema.ts

import { z } from "zod";

const ssoEntitySchema = z.object({
  issuerUrl: z
    .string()
    .min(1, "URL Issuer/Realm wajib diisi")
    .url("Issuer URL harus berupa URL yang valid"),
  clientId: z.string().min(1, "Client ID wajib diisi"),
  clientSecret: z.string().optional(),
  redirectUri: z
    .string()
    .min(1, "Redirect URI wajib diisi")
    .url("Redirect URI harus berupa URL yang valid"),
});

export const ssoFormSchema = z.object({
  mitra: ssoEntitySchema,
  internal: ssoEntitySchema.extend({
    isEnabled: z.boolean(),
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
  fromEmail: z
    .string()
    .min(1, "Email pengirim wajib diisi")
    .email("Format email tidak valid"),
  fromName: z.string().min(1, "Nama pengirim wajib diisi"),
  rejectUnauthorized: z.boolean(),
});

export const smtpTestSchema = z.object({
  targetEmail: z
    .string()
    .min(1, "Email penerima uji coba wajib diisi")
    .email("Format email tidak valid"),
});

export const simponiFormSchema = z
  .object({
    baseUrl: z.string(),
    kodeKl: z.string(),
    kodeSatker: z.string(),
    kodeAkun: z.string(),
    apiKey: z.string().optional(),
    billingExpiryHours: z
      .number()
      .int("Masa berlaku harus berupa angka bulat")
      .min(1, "Masa berlaku minimal 1 jam")
      .max(720, "Masa berlaku maksimal 720 jam (30 hari)"),
    isSimulator: z.boolean(),
    isEnabled: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isEnabled) {
      if (!data.baseUrl || !data.baseUrl.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["baseUrl"],
          message: "Endpoint Base URL SIMPONI wajib diisi",
        });
      } else {
        try {
          new URL(data.baseUrl);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["baseUrl"],
            message: "Format URL tidak valid",
          });
        }
      }

      if (!data.kodeKl || data.kodeKl.length !== 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kodeKl"],
          message: "Kode K/L harus tepat 3 digit",
        });
      }

      if (!data.kodeSatker || data.kodeSatker.length !== 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kodeSatker"],
          message: "Kode Satker harus tepat 6 digit",
        });
      }

      if (!data.kodeAkun || data.kodeAkun.length !== 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["kodeAkun"],
          message: "Kode Akun harus tepat 6 digit",
        });
      }
    }
  });
