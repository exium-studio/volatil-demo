// src/features/cart/hooks/use-mitra-cart.ts

import {
  checkout,
  clearCart,
  getCartItems,
  getCartSummary,
  removeFromCart,
} from "@/features/mitra/cart/services/cart.api";
import type {
  CartItemsResponse,
  CartSummaryResponse,
} from "@/features/mitra/cart/types/cart.type";
import {
  dummyCartSummaryResponse,
  dummyMitraCartData,
} from "@/shared/constants/dummy-data/dummy-cart-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type CartItemsQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useCartItemsQuery = (params: CartItemsQueryParams) => {
  const query = useQuery<CartItemsResponse>({
    queryKey: queryKeys.mitra.cart.items(params),
    queryFn: ({ signal }) => getCartItems(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    cartItemsData: query.data ?? {
      items: [],
      meta: {
        ...dummyMitraCartData.meta,
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  };
};

export const useCartSummaryQuery = () => {
  const query = useQuery<CartSummaryResponse>({
    queryKey: queryKeys.mitra.cart.summary(),
    queryFn: ({ signal }) => getCartSummary(signal),
  });

  return {
    ...query,
    cartSummaryData: query.data ?? dummyCartSummaryResponse,
  };
};

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => checkout(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
  });
};

export const useClearCart = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      onSuccessCallback?.();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
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
