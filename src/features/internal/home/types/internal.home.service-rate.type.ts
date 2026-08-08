// src/features/internal/home/types/internal.home.service-rate.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ComponentType } from "react";

export type InternalHomeServiceRateProps = StackProps;

export type InternalHomeServiceRateItem = {
  id: string;
  title: string;
  icon: ComponentType;
  price: number;
  unit: string;
  minPurchase: number;
  minUnit: string;
  color?: string;
  colorPalette?: string;
};

export type InternalHomeServiceRateCardProps = StackProps & {
  rate: InternalHomeServiceRateItem;
};

// Aliases for compatibility
export type ServiceRateItem = InternalHomeServiceRateItem;
