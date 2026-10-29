// src/features/mitra/billing/types/manual-payment.type.ts

import { z } from "zod";

export const manualPaymentProofSchema = z.object({
  ntpn: z
    .string()
    .min(1, "NTPN wajib diisi")
    .length(16, "NTPN harus tepat 16 karakter alfanumerik")
    .regex(/^[A-Z0-9]{16}$/, "NTPN harus berupa 16 karakter alfanumerik huruf kapital dan angka"),
  paidAt: z.string().min(1, "Tanggal bayar wajib diisi"),
  paymentProof: z
    .custom<File>((val) => val instanceof File, "Bukti pembayaran wajib diunggah")
    .refine(
      (file) => file && ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Format file bukti bayar harus berupa .pdf, .jpg, atau .png",
    )
    .refine(
      (file) => file && file.size <= 5 * 1024 * 1024,
      "Ukuran file bukti bayar maksimal 5MB",
    ),
});

export type ManualPaymentProofFormValues = z.infer<typeof manualPaymentProofSchema>;

export type SubmitManualPaymentProofPayload = {
  orderId: string;
  ntpn: string;
  paidAt: string;
  paymentProofFile: File;
};

export type SubmitManualPaymentProofResponse = {
  orderId: string;
  status: "pending_review";
  ntpn: string;
  paidAt: string;
  paymentProofUrl: string;
  paymentProofName: string;
};

export type ManualPaymentProofTriggerProps = {
  modalKey?: string;
  orderId: string;
  billingCode: string;
  children?: import("react").ReactNode;
  onSuccess?: () => void;
};

export type ManualPaymentProofModalContentProps = {
  orderId: string;
  billingCode: string;
  close: () => void;
  onSuccess?: () => void;
};

