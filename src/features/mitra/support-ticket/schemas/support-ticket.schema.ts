// src/features/mitra/support-ticket/schemas/support-ticket.schema.ts

import type { FieldErrors } from "react-hook-form";
import { z } from "zod";

export const createSupportTicketSchema = () =>
  z.object({
    title: z.string().trim().min(1, "Judul laporan wajib diisi"),
    description: z.string().trim().min(1, "Deskripsi kendala wajib diisi"),
    files: z.array(z.custom<File>()).default([]),
  });

export type CreateSupportTicketFormValues = z.infer<
  ReturnType<typeof createSupportTicketSchema>
>;

export const zodResolver = <T extends z.ZodTypeAny>(getSchema: () => T) => {
  return async (values: Record<string, unknown>) => {
    const schema = getSchema();
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: FieldErrors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = {
          type: issue.code,
          message: issue.message,
        };
      }
    });

    return { values: {}, errors };
  };
};
