// src/features/mitra/cart/services/cart.api.ts

import { getPaginatedCartItems } from "@/features/mitra/cart/services/cart.service";
import type {
  AddToCartPayload,
  CartItemsResponse,
  CartSummaryResponse,
  CheckoutResponse,
  AddSelectedToCartPayload,
  AddAllToCartByAoiPayload,
  AddAllToCartByFilterPayload,
} from "@/features/mitra/cart/types/cart.type";
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
    console.warn(
      "getCartSummary API error, falling back to dummy data:",
      error,
    );
    return dummyCartSummaryResponse;
  }
}

export async function checkout(
  signal?: AbortSignal,
): Promise<CheckoutResponse> {
  try {
    const response = await apiClient.post<ApiResponse<CheckoutResponse>>(
      "/mitra/cart/checkout",
      {},
      { signal },
    );
    return response.data ?? { billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}` };
  } catch (error) {
    console.warn("checkout API error, falling back to dummy billing code:", error);
    return { billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}` };
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

export async function addSelectedToCart(
  payload: AddSelectedToCartPayload,
  signal?: AbortSignal,
): Promise<void> {
  console.log("addSelectedToCart payload:", payload);
  try {
    await apiClient.post("/mitra/cart/add-selected", payload, { signal });
  } catch (error) {
    console.warn("addSelectedToCart API error, fallback silent:", error);
  }
}

export async function addAllToCartByAoi(
  payload: AddAllToCartByAoiPayload,
  signal?: AbortSignal,
): Promise<void> {
  const { geometry, basis = ["bidang", "kawasan"] } = payload;
  console.log("addAllToCartByAoi payload:", { geometry, basis });
  try {
    await apiClient.post("/mitra/cart/add-all-aoi", { geometry, basis }, { signal });
  } catch (error) {
    console.warn("addAllToCartByAoi API error, fallback silent:", error);
  }
}

export async function addAllToCartByFilter(
  payload: AddAllToCartByFilterPayload,
  signal?: AbortSignal,
): Promise<void> {
  const { filter, basis = ["bidang", "kawasan"] } = payload;
  console.log("addAllToCartByFilter payload:", { filter, basis });
  try {
    await apiClient.post("/mitra/cart/add-all-filter", { filter, basis }, { signal });
  } catch (error) {
    console.warn("addAllToCartByFilter API error, fallback silent:", error);
  }
}
