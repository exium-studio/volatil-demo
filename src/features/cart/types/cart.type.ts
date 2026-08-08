// src/features/cart/types/cart.type.ts

import type {
  IgtThemeItem,
  PaginatedResponse,
} from "@/shared/types/common-response.type";

export type CartItemBasis = "bidang" | "kawasan";

export type CartItem = {
  id: string;
  name: string;
  basis: CartItemBasis;
  quota: number;
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

export type CartResponse = PaginatedResponse<CartItem> & {
  summary: CartSummary;
};

export type AddToCartPayload = {
  id: string;
  basis: CartItemBasis;
};
