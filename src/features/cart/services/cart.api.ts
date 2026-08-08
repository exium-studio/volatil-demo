// src/features/cart/services/cart.api.ts

import type {
  AddToCartPayload,
  CartResponse,
} from "@/features/cart/types/cart.type";
import { DUMMY_CART_RESPONSE } from "@/shared/constants/dummy-data/dummy-cart-data";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type {
  ApiResponse,
  PaginatedParams,
} from "@/shared/types/common-response.type";

// TODO: replace with real API call
export async function getCartData(
  params?: PaginatedParams,
  signal?: AbortSignal,
): Promise<CartResponse> {
  console.log("getCartData params:", params);
  try {
    const response = await apiClient.get<ApiResponse<CartResponse>>(
      "/mitra/cart",
      {
        params,
        signal,
      },
    );
    return response.data ?? DUMMY_CART_RESPONSE;
  } catch (error) {
    console.warn("getCartData API error, falling back to dummy data:", error);
    return DUMMY_CART_RESPONSE;
  }
}

// TODO: replace with real API call
export async function checkout(
  itemIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  console.log("checkout itemIds:", itemIds);
  try {
    await apiClient.post("/mitra/cart/checkout", { itemIds }, { signal });
  } catch (error) {
    console.warn("checkout API error, fallback silent:", error);
  }
}

// TODO: replace with real API call
export async function removeFromCart(
  itemIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  console.log("removeFromCart itemIds:", itemIds);
  try {
    await apiClient.post("/mitra/cart/remove", { itemIds }, { signal });
  } catch (error) {
    console.warn("removeFromCart API error, fallback silent:", error);
  }
}

// TODO: replace with real API call
export async function clearCart(signal?: AbortSignal): Promise<void> {
  console.log("clearCart");
  try {
    await apiClient.post("/mitra/cart/clear", {}, { signal });
  } catch (error) {
    console.warn("clearCart API error, fallback silent:", error);
  }
}

// TODO: replace with real API call
export async function addToCart(
  items: AddToCartPayload[],
  signal?: AbortSignal,
): Promise<void> {
  console.log("addToCart items:", items);
  try {
    await apiClient.post("/mitra/cart/add", { items }, { signal });
  } catch (error) {
    console.warn("addToCart API error, fallback silent:", error);
  }
}
