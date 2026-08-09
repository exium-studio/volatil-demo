// src/features/cart/hooks/use-mitra-cart.ts

import {
  checkout,
  clearCart,
  getCartData,
  removeFromCart,
} from "@/features/cart/services/cart.api";
import type { CartResponse } from "@/features/cart/types/cart.type";
import { dummyMitraCartData } from "@/shared/constants/dummy-data/dummy-cart-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCartQuery = (searchValue?: string) => {
  const query = useQuery<CartResponse>({
    queryKey: queryKeys.mitra.cart.data(searchValue),
    queryFn: ({ signal }) => getCartData({ search: searchValue }, signal),
  });

  return {
    ...query,
    cartData: query.data ?? dummyMitraCartData,
  };
};

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => checkout(itemIds),
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
