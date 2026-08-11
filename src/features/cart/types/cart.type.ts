// src/features/cart/types/cart.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type {
  IgtThemeItem,
  PaginatedResponse,
} from "@/shared/types/common-response.type";
import type { ReactNode } from "react";

export type CartItemBasis = "bidang" | "kawasan";

export type CartItem = {
  id: string;
  name: string;
  basis: CartItemBasis;
  areaInHa?: number;
  themes: IgtThemeItem[];
  description?: string | null;
};

export type CartSummary = {
  totalBidang: number;
  totalBidangPrice: number;
  totalKawasan: number;
  totalKawasanHa: number;
  totalKawasanPrice: number;
  subtotal: number;
  serviceFee: number;
  tax: number;
  grandTotal: number;
};

export type CartConfig = {
  minimumBidangCount: number;
  minimumKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
  serviceFeeRate?: number;
  taxRate?: number;
};

export type CartItemsResponse = PaginatedResponse<CartItem>;

export type CartSummaryResponse = {
  summary: CartSummary;
  config: CartConfig;
};

export type CheckoutResponse = {
  billingCode: string;
};

// Kept for backward-compat with dummy data
export type CartResponse = CartItemsResponse & CartSummaryResponse;

export type AddToCartPayload = {
  id: string;
  basis: CartItemBasis;
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
