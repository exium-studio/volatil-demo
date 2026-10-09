// src/features/internal/system-policies/types/internal.system-policies.type.ts

import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import type { ReactNode } from "react";

export type InternalSystemPolicyModalTriggerProps = {
  policy: SystemPolicyItem;
  children: ReactNode;
  modalKey?: string;
};

export type InternalSystemPolicyModalContentProps = {
  policy: SystemPolicyItem;
  close: () => void;
};

export type PolicyFormValues = {
  value: number;
};
