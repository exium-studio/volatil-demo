// src/features/auth/schemas/signin.schema.ts

import { t } from "@/shared/libs/i18n";
import type { FieldErrors } from "react-hook-form";
import { z } from "zod";

export const createSigninSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, t["validation.required"]())
      .pipe(z.email(t["validation.email_invalid"]())),
    password: z
      .string()
      .min(1, t["validation.required"]())
      .min(6, t["validation.password_too_short"]({ min: 6 })),
  });

export type SigninFormValues = z.infer<ReturnType<typeof createSigninSchema>>;

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
