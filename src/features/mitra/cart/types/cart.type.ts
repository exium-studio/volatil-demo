// src/features/mitra/cart/types/cart.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { ReactNode } from "react";

export type CartStoredIds = string[];

export type CartSummary = {
  totalBidang: number;
  totalBidangPrice: number;
  totalKawasan: number;
  totalKawasanHa: number;
  totalKawasanPrice: number;
  grandTotal: number;
};

export type CartConfig = {
  minimumBidangCount: number;
  minimumKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
};

export type CartSummaryResponse = {
  summary: CartSummary;
  config: CartConfig;
  totalIds: number;
};

export type CheckoutResponse = {
  billingCode: string;
};

export type MitraCartOrderSummaryProps = StackProps & {
  summary: CartSummary;
  config: CartConfig;
  onCheckout?: () => void;
  isCheckoutPending?: boolean;
};

export type MitraCartTableProps = StackProps;

export type MitraCartFlexContainerProps = {
  isSmContainer: boolean;
  children: ReactNode;
};
