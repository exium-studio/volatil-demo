import type { OrderStatus } from "@/features/mitra/cart/types/mitra.cart.api.type";

export type MitraTransactionItem = {
  id: string;
  orderNumber: string;
  billingCode?: string;
  status: OrderStatus;
  totalPrice: number;
  orderedAt: string;
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
  }>;
};

export type MitraTransactionListResponse = {
  items: MitraTransactionItem[];
  total: number;
};
