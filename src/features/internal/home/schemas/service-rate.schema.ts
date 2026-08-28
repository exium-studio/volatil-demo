import type { FieldErrors } from "react-hook-form";
import { z } from "zod";

export const serviceRateFormSchema = z.object({
  price: z.number().min(0, "Tarif tidak boleh kurang dari 0"),
  minPurchase: z.number().min(1, "Minimal pembelian minimal 1"),
  kodePnbp: z.string().min(1, "Kode akun PNBP wajib diisi"),
});

export type ServiceRateFormValues = z.infer<typeof serviceRateFormSchema>;

export const zodResolver = <T extends z.ZodTypeAny>(schema: T) => {
  return async (values: Record<string, unknown>) => {
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
