// src/features/cart/services/cart.api.ts

import { getPaginatedCartItems } from "@/features/cart/services/cart.service";
import type {
  AddToCartPayload,
  CartItemsResponse,
  CartSummaryResponse,
} from "@/features/cart/types/cart.type";
import {
  dummyCartSummaryResponse,
  dummyMitraCartItems,
} from "@/shared/constants/dummy-data/dummy-cart-data";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type {
  ApiResponse,
  PaginatedParams,
} from "@/shared/types/common-response.type";

// TODO: replace fallback with real API data when the endpoint is available
export async function getCartItems(
  params?: PaginatedParams,
  signal?: AbortSignal,
): Promise<CartItemsResponse> {
  try {
    const response = await apiClient.get<ApiResponse<CartItemsResponse>>(
      "/mitra/cart/items",
      {
        params,
        signal,
      },
    );
    return response.data ?? getPaginatedCartItems(dummyMitraCartItems, params);
  } catch (error) {
    console.warn("getCartItems API error, falling back to dummy data:", error);
    return getPaginatedCartItems(dummyMitraCartItems, params);
  }
}

// TODO: replace fallback with real API data when the endpoint is available
export async function getCartSummary(
  signal?: AbortSignal,
): Promise<CartSummaryResponse> {
  try {
    const response = await apiClient.get<ApiResponse<CartSummaryResponse>>(
      "/mitra/cart/summary",
      { signal },
    );
    return response.data ?? dummyCartSummaryResponse;
  } catch (error) {
    console.warn("getCartSummary API error, falling back to dummy data:", error);
    return dummyCartSummaryResponse;
  }
}

// TODO: replace with real API call
export async function checkout(signal?: AbortSignal): Promise<void> {
  try {
    await apiClient.post("/mitra/cart/checkout", {}, { signal });
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
