// src/features/mitra/cart/hooks/use-mitra-cart.ts

import {
  addAllToCartFromWfs,
  addSelectedToCart,
  checkout,
  clearCart,
  getCartSummaryLocal,
  getCartWfsPage,
  removeFromCart,
} from "@/features/mitra/cart/services/mitra.cart.service";
import type { CartSummaryResponse } from "@/features/mitra/cart/types/cart.type";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type CartItemsQueryParams = {
  page: number;
  pageSize: number;
  typeName: string;
  wfsUrl: string;
  search?: string;
  cqlFilter?: string;
};

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
    group: "Permohonan Data",
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
    group: "Permohonan Data",
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

export const useAddAllToCartFromWfs = (onSuccessCallback?: (count: number) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { typeName: string; wfsUrl: string; cqlFilter?: string }) =>
      addAllToCartFromWfs(params),
    onSuccess: (count) => {
      onSuccessCallback?.(count);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
  });
};
