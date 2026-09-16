import { createSigninSchema } from "@/features/auth/schemas/signin.schema";
import type { z } from "zod";

export type SigninFormValues = z.infer<ReturnType<typeof createSigninSchema>>;

export type AdminSigninSearch = {
  error?: string;
  reason?: string;
};

