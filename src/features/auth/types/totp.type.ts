// src/features/auth/types/totp.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { TotpSetupData } from "@/features/auth/types/auth.service.type";

export type TotpVerifyStepProps = StackProps & {
  email: string;
  mfaToken: string;
  onSuccess: () => void;
  onBackToLogin: () => void;
};

export type TotpSetupStepProps = StackProps & {
  email: string;
  mfaToken: string;
  setupData: TotpSetupData | null;
  onSuccess: () => void;
  onBackToLogin: () => void;
};
