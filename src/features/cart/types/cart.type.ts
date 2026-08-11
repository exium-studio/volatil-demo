// src/features/cart/types/cart.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
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

export type CartResponse = PaginatedResponse<CartItem> & {
  summary: CartSummary;
  config: CartConfig;
};

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

export type MitraCartTableProps = StackProps & {
  cartItems: CartItem[];
  selectedItems?: FormattedListItem<CartItem>[];
  onSelectedItemChange?: (payload: {
    selectedItems: FormattedListItem[];
  }) => void;
  onClearCart?: () => void;
  onRemoveItems?: (itemIds: string[]) => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
};

export type MitraCartFlexContainerProps = {
  isSmContainer: boolean;
  children: ReactNode;
};
