// src/features/mitra/cart/services/mitra.cart.service.ts

import {
  fetchAllFeatureIdsFromWfsApi,
  fetchCartWfsPageApi,
  postAddSelectedToCartApi,
  postCheckoutApi,
  postClearCartApi,
  postRemoveFromCartApi,
} from "@/features/mitra/cart/api/mitra.cart.api";
import type { FetchWfsCatalogResult } from "@/features/mitra/cart/api/mitra.cart.api";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import type {
  CartStoredIds,
  CartSummary,
  CartSummaryResponse,
  CheckoutResponse,
} from "@/features/mitra/cart/types/cart.type";
import { getStorage, setStorage } from "@/shared/utils/client/client.storage";

const LOCAL_STORAGE_KEY = "mitra_cart_ids";

// -------------------------------------------------------------------------------------
// Storage Helpers

export const getLocalCartIds = (): CartStoredIds => {
  if (typeof window === "undefined") return [];
  const stored = getStorage(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveLocalCartIds = (ids: CartStoredIds): void => {
  if (typeof window === "undefined") return;
  setStorage(LOCAL_STORAGE_KEY, JSON.stringify(ids));
};

export const addIdsToCart = (newIds: string[]): void => {
  const current = getLocalCartIds();
  const deduped = [...new Set([...current, ...newIds])];
  saveLocalCartIds(deduped);
};

export const removeIdsFromCart = (idsToRemove: string[]): void => {
  const current = getLocalCartIds();
  saveLocalCartIds(current.filter((id) => !idsToRemove.includes(id)));
};

export const clearCartIds = (): void => {
  saveLocalCartIds([]);
};

// -------------------------------------------------------------------------------------
// Summary — calculated purely from stored ID count

export const calculateCartSummary = (
  ids: CartStoredIds,
): CartSummaryResponse => {
  const totalBidang = ids.length;
  const totalBidangPrice = totalBidang * CART_CONFIG.pricePerBidang;

  // Kawasan not yet supported in dummy phase
  const totalKawasan = 0;
  const totalKawasanHa = 0;
  const totalKawasanPrice = 0;

  const grandTotal = totalBidangPrice + totalKawasanPrice;

  const summary: CartSummary = {
    totalBidang,
    totalBidangPrice,
    totalKawasan,
    totalKawasanHa,
    totalKawasanPrice,
    grandTotal,
  };

  return {
    summary,
    config: CART_CONFIG,
    totalIds: ids.length,
  };
};

export const getCartSummaryLocal = (): CartSummaryResponse => {
  return calculateCartSummary(getLocalCartIds());
};

// -------------------------------------------------------------------------------------
// Pagination helpers for paginating the stored IDs array

export const getPaginatedIds = (
  ids: CartStoredIds,
  page: number,
  pageSize: number,
): { pageIds: string[]; total: number; totalPages: number } => {
  const startIndex = (page - 1) * pageSize;
  return {
    pageIds: ids.slice(startIndex, startIndex + pageSize),
    total: ids.length,
    totalPages: Math.ceil(ids.length / pageSize),
  };
};

// -------------------------------------------------------------------------------------
// High Level Business Workflow / Service Orchestration

export async function getCartWfsPage(params: {
  page: number;
  pageSize: number;
  typeName: string;
  wfsUrl: string;
  search?: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<
  FetchWfsCatalogResult & {
    pageIds: string[];
    total: number;
    totalPages: number;
  }
> {
  const ids = getLocalCartIds();
  return fetchCartWfsPageApi({
    ids,
    page: params.page,
    pageSize: params.pageSize,
    typeName: params.typeName,
    wfsUrl: params.wfsUrl,
    search: params.search,
    cqlFilter: params.cqlFilter,
    signal: params.signal,
  });
}

export async function addSelectedToCart(
  featureIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  addIdsToCart(featureIds);
  try {
    await postAddSelectedToCartApi(featureIds, signal);
  } catch {
    // Fallback: localStorage already updated above
  }
}

export async function addAllToCartFromWfs(params: {
  typeName?: string;
  wfsUrl?: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<number> {
  const ids = await fetchAllFeatureIdsFromWfsApi(params);
  addIdsToCart(ids);
  return ids.length;
}

export async function removeFromCart(
  itemIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  removeIdsFromCart(itemIds);
  try {
    await postRemoveFromCartApi(itemIds, signal);
  } catch {
    // Fallback: localStorage already updated
  }
}

export async function clearCart(signal?: AbortSignal): Promise<void> {
  clearCartIds();
  try {
    await postClearCartApi(signal);
  } catch {
    // Fallback: localStorage already updated
  }
}

export async function checkout(
  signal?: AbortSignal,
): Promise<CheckoutResponse> {
  try {
    const response = await postCheckoutApi(signal);
    return (
      response.data ?? {
        billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
      }
    );
  } catch {
    return {
      billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }
}
