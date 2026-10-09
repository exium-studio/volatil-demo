// src/features/internal/home/types/internal.home.policies.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type InternalHomePoliciesProps = StackProps;

export type InternalHomePolicyItem = {
  key: string;
  value: number | string | boolean;
  valueType: "number" | "string" | "boolean" | "json";
  label: string;
  description: string;
  unit?: string;
};

export type PolicyFormValues = {
  value: number;
};

export type InternalHomePolicyModalTriggerProps = {
  modalKey?: string;
  policy: InternalHomePolicyItem;
  children: ReactNode;
};

export type InternalHomePolicyModalContentProps = {
  modalKey?: string;
  policy: InternalHomePolicyItem;
  close: () => void;
};
