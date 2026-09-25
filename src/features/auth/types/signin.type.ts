// src\features\auth\types\signin.type.ts

// src\features\auth\types\signin.type.ts

import { createSigninSchema } from "@/features/auth/schemas/signin.schema";
import type { TotpSetupData } from "@/features/auth/types/auth.service.type";
import type { z } from "zod";

export type SigninFormValues = z.infer<ReturnType<typeof createSigninSchema>>;

export type AdminSigninSearch = {
  error?: string;
  reason?: string;
};

export type InternalAuthScreen =
  | "login"
  | "totp-verify"
  | "totp-setup-qr"
  | "totp-setup-confirm";

export type InternalAuthState = {
  screen: InternalAuthScreen;
  mfaToken: string | null;
  mfaTokenExpiresIn?: number;
  setupData: TotpSetupData | null;
  email: string;
};

