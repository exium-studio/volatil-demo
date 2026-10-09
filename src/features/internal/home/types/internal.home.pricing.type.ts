// src/features/internal/home/types/internal.home.pricing.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { serviceRateFormSchema } from "@/features/internal/home/schemas/service-rate.schema";
import type { ComponentType, ReactNode } from "react";
import type { z } from "zod";

export type InternalHomePricingProps = StackProps;

export type InternalHomePricingItem = {
  id: string;
  price: number;
  pnbpCode: string;
  minimumPurchase: number;
  igtBasis: "bidang" | "kawasan";
  unit: "bidang" | "kawasan";
  title?: string;
  icon?: ComponentType;
  colorPalette?: string;
};

export type PricingFormValues = z.infer<typeof serviceRateFormSchema>;

export type InternalHomePricingModalTriggerProps = {
  modalKey?: string;
  pricing: InternalHomePricingItem;
  children: ReactNode;
};

export type InternalHomePricingModalContentProps = {
  modalKey?: string;
  pricing: InternalHomePricingItem;
  close: () => void;
};
