import { createCartOrdersEventSource } from "@/features/mitra/cart/api/mitra.cart.api";
import {
  addAllToCartFromWfs,
  addSelectedToCart,
  cancelActiveCartOrder,
  checkOrderPaymentStatus,
  checkout,
  checkoutCartOrder,
  clearAllCartOrders,
  clearCart,
  createCartOrder,
  getActiveCartOrder,
  getCartOrderDetail,
  getCartOrders,
  getCartSummaryLocal,
  getCartWfsPage,
  getExpiredCartOrders,
  removeFromCart,
  reorderCartOrder,
  simulateCalculationComplete,
} from "@/features/mitra/cart/services/mitra.cart.service";
import type { CartSummaryResponse } from "@/features/mitra/cart/types/cart.type";
import type { CartItemsQueryParams } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const EMPTY_CART_SUMMARY: CartSummaryResponse = {
  summary: {
    totalBidang: 0,
    totalBidangPrice: 0,
    totalKawasan: 0,
    totalKawasanHa: 0,
    totalKawasanPrice: 0,
    grandTotal: 0,
  },
  config: CART_CONFIG,
  totalIds: 0,
};

export const useCartItemsQuery = (params: CartItemsQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.mitra.cart.items(params),
    queryFn: ({ signal }) => getCartWfsPage({ ...params, signal }),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    features: query.data?.features ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    pageIds: query.data?.pageIds ?? [],
  };
};

export const useCartSummaryQuery = () => {
  const query = useQuery<CartSummaryResponse>({
    queryKey: queryKeys.mitra.cart.summary(),
    // Summary is purely local — no network call needed
    queryFn: () => Promise.resolve(getCartSummaryLocal()),
  });

  return {
    ...query,
    cartSummaryData: query.data ?? EMPTY_CART_SUMMARY,
  };
};

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("checkout-cart", {
    group: "Keranjang",
    loadingMessage: {
      title: "Memproses pesanan...",
    },
    successMessage: {
      title: "Pesanan berhasil dibuat!",
      description: "Silakan selesaikan pembayaran sesuai kode billing Anda.",
    },
    errorMessage: {
      title: "Gagal memproses pesanan",
    },
  });

  return useMutation({
    mutationFn: () => checkout(),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export const useClearCart = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("clear-cart", {
    group: "Keranjang",
    loadingMessage: {
      title: "Mengosongkan keranjang...",
    },
    successMessage: {
      title: "Keranjang berhasil dikosongkan",
    },
    errorMessage: {
      title: "Gagal mengosongkan keranjang",
    },
  });

  return useMutation({
    mutationFn: () => clearCart(),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      onSuccessCallback?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useRemoveFromCart = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => removeFromCart(itemIds),
    onSuccess: () => {
      onSuccessCallback?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
  });
};

export const useAddSelectedToCart = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (featureIds: string[]) => addSelectedToCart(featureIds),
    onSuccess: () => {
      onSuccessCallback?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
  });
};

export const useAddAllToCartFromWfs = (
  onSuccessCallback?: (count: number) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      typeName: string;
      wfsUrl: string;
      cqlFilter?: string;
    }) => addAllToCartFromWfs(params),
    onSuccess: (count) => {
      onSuccessCallback?.(count);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
  });
};

// -------------------------------------------------------------------------------------
// Order Query & Mutation Hooks
// -------------------------------------------------------------------------------------

import type {
  ActiveCartOrder,
  AddToCartOrderRequest,
  CartOrder,
  CartOrderListResponse,
  CheckoutOrderRequest,
} from "@/features/mitra/cart/types/mitra.cart.order.type";

export const useCartOrdersQuery = () => {
  const query = useQuery<CartOrderListResponse>({
    queryKey: ["mitra", "cart", "orders"],
    queryFn: ({ signal }) => getCartOrders(signal),
  });

  return {
    ...query,
    orders: query.data?.orders ?? [],
    batches: query.data?.orders ?? [],
    total: query.data?.total ?? 0,
  };
};

export const useCartOrderDetailQuery = (orderId?: string) => {
  const query = useQuery<CartOrder | null>({
    queryKey: ["mitra", "cart", "order-detail", orderId],
    queryFn: ({ signal }) =>
      orderId ? getCartOrderDetail(orderId, signal) : Promise.resolve(null),
    enabled: Boolean(orderId),
  });

  return {
    ...query,
    orderDetail: query.data ?? null,
    batchDetail: query.data ?? null,
  };
};

export const useActiveCartOrderQuery = () => {
  const query = useQuery<ActiveCartOrder | null>({
    queryKey: ["mitra", "cart", "active-order"],
    queryFn: ({ signal }) => getActiveCartOrder(signal),
  });

  return {
    ...query,
    activeOrder: query.data ?? null,
    activeBatch: query.data ?? null,
  };
};

export const useCreateCartOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("create-cart-order", {
    group: "Keranjang",
    loadingMessage: {
      title: "Membuat pesanan keranjang...",
    },
    successMessage: {
      title: "Data dimasukkan ke keranjang!",
      description:
        "Sistem sedang memproses penyiapan layer spasial Anda.",
    },
    errorMessage: {
      title: "Gagal membuat pesanan keranjang",
    },
  });

  return useMutation({
    mutationFn: (payload: AddToCartOrderRequest) => createCartOrder(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useCancelActiveCartOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("cancel-cart-order", {
    group: "Keranjang",
    loadingMessage: {
      title: "Menghapus pesanan...",
    },
    successMessage: {
      title: "Pesanan berhasil dihapus",
    },
    errorMessage: {
      title: "Gagal menghapus pesanan",
    },
  });

  return useMutation({
    mutationFn: (orderId: string) => cancelActiveCartOrder(orderId),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useClearAllCartOrders = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("clear-all-cart-orders", {
    group: "Keranjang",
    loadingMessage: {
      title: "Mengosongkan keranjang...",
    },
    successMessage: {
      title: "Keranjang berhasil dikosongkan",
    },
    errorMessage: {
      title: "Gagal mengosongkan keranjang",
    },
  });

  return useMutation({
    mutationFn: (orderIds: string[]) => clearAllCartOrders(orderIds),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useCheckoutCartOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("checkout-cart-order", {
    group: "Pembayaran",
    loadingMessage: {
      title: "Membuat kode billing...",
    },
    successMessage: {
      title: "Kode billing berhasil diterbitkan!",
      description: "Mengarahkan ke halaman instruksi pembayaran billing...",
    },
    errorMessage: {
      title: "Gagal memproses pembayaran",
    },
  });

  return useMutation({
    mutationFn: (params: { orderId: string; payload?: CheckoutOrderRequest }) =>
      checkoutCartOrder(params.orderId, params.payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "billing"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "transaction-history"],
      });
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export const useExpiredCartOrdersQuery = (options?: { enabled?: boolean }) => {
  const query = useQuery<CartOrderListResponse>({
    queryKey: ["mitra", "cart", "expired-orders"],
    queryFn: ({ signal }) => getExpiredCartOrders(signal),
    enabled: options?.enabled ?? false,
  });

  return {
    ...query,
    expiredOrders: query.data?.orders ?? [],
    expiredBatches: query.data?.orders ?? [],
    total: query.data?.total ?? 0,
  };
};

export const useReorderCartOrder = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("reorder-cart-order", {
    group: "Keranjang",
    loadingMessage: {
      title: "Membuat permintaan ulang...",
    },
    successMessage: {
      title: "Permintaan ulang berhasil dibuat!",
      description: "Pesanan baru telah masuk ke keranjang dan sedang disiapkan.",
    },
    errorMessage: {
      title: "Gagal membuat permintaan ulang",
    },
  });

  return useMutation({
    mutationFn: (orderId: string) => reorderCartOrder(orderId),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      onSuccessCallback?.();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "expired-orders"],
      });
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export const useCheckOrderPaymentStatus = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("check-order-payment-status", {
    group: "Pembayaran",
    loadingMessage: {
      title: "Memeriksa status pembayaran...",
    },
    successMessage: {
      title: "Status pembayaran berhasil dikonfirmasi (settled)",
      description:
        "Pemotongan AOI dan pembuatan service layer sedang diproses.",
    },
    errorMessage: {
      title: "Gagal memeriksa status pembayaran",
    },
  });

  return useMutation({
    mutationFn: (orderId: string) => checkOrderPaymentStatus(orderId),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "transaction-history"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "my-data"],
      });
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export const useCheckBillingPaymentStatus = useCheckOrderPaymentStatus;

/**
 * SSE Real-time stream subscriber hook for Cart Orders.
 * Connects to GET /api/mitra/cart/orders/stream and updates TanStack Query cache on events.
 * Also includes dummy mode automatic spatial calculation simulator for 'requesting' status.
 */
export const useCartOrdersStream = () => {
  const queryClient = useQueryClient();
  const dummyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;

    const handleOrderUpdate = () => {
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-order"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "order-detail"],
      });
    };

    try {
      eventSource = createCartOrdersEventSource();

      // Listen to specific SSE event types from backend
      eventSource.addEventListener("order_created", handleOrderUpdate);
      eventSource.addEventListener("order_calculating", handleOrderUpdate);
      eventSource.addEventListener("order_updated", handleOrderUpdate);
      eventSource.addEventListener("order_ready", handleOrderUpdate);
      eventSource.addEventListener("order_cancelled", handleOrderUpdate);
      eventSource.addEventListener("message", handleOrderUpdate);

      eventSource.onerror = () => {
        // EventSource will automatically retry connecting
      };
    } catch {
      // In case EventSource fails or in mock env
    }

    // Dummy mode simulation: if any order is currently 'requesting', simulate BE completing calculation
    if (isDummyDataEnabled()) {
      dummyTimerRef.current = setTimeout(() => {
        const wasUpdated = simulateCalculationComplete();
        if (wasUpdated) {
          handleOrderUpdate();
        }
      }, 3500);
    }

    return () => {
      eventSource?.close();
      if (dummyTimerRef.current) {
        clearTimeout(dummyTimerRef.current);
      }
    };
  }, [queryClient]);
};
