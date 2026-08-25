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
  typeName: string;
  wfsUrl: string;
  cqlFilter?: string;
  signal?: AbortSignal;
}): Promise<number> {
  if (!params.typeName || !params.wfsUrl) return 0;
  const ids = await fetchAllFeatureIdsFromWfsApi({
    typeName: params.typeName,
    wfsUrl: params.wfsUrl,
    cqlFilter: params.cqlFilter,
    signal: params.signal,
  });
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

// -------------------------------------------------------------------------------------
// Batch Interop Workflow Services
// -------------------------------------------------------------------------------------

import {
  deleteCartBatchApi,
  fetchActiveCartBatchApi,
  postCheckoutBatchApi,
  postCreateCartBatchApi,
} from "@/features/mitra/cart/api/mitra.cart.api";
import type {
  ActiveCartBatch,
  AddToCartBatchRequest,
  AddToCartBatchResponse,
  CheckoutBatchRequest,
  CheckoutBatchResponse,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { DUMMY_ACTIVE_CART_BATCH } from "@/shared/constants/dummy-data/dummy-cart-batch";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export async function createCartBatch(
  payload: AddToCartBatchRequest,
  signal?: AbortSignal,
): Promise<AddToCartBatchResponse> {
  try {
    const response = await postCreateCartBatchApi(payload, signal);
    if (response.data) return response.data;
    return {
      batchId: `btc-${Date.now()}`,
      status: "preparing",
      estimatedTotalPrice: 1850000,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        batchId: `btc-${Date.now()}`,
        status: "preparing",
        estimatedTotalPrice: 1850000,
        createdAt: new Date().toISOString(),
      };
    }
    throw error;
  }
}

export async function getActiveCartBatch(
  signal?: AbortSignal,
): Promise<ActiveCartBatch | null> {
  try {
    const response = await fetchActiveCartBatchApi(signal);
    if (response.data !== undefined) return response.data;
    return isDummyDataEnabled() ? DUMMY_ACTIVE_CART_BATCH : null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return DUMMY_ACTIVE_CART_BATCH;
    }
    throw error;
  }
}

export async function cancelActiveCartBatch(
  batchId: string,
  signal?: AbortSignal,
): Promise<void> {
  try {
    await deleteCartBatchApi(batchId, signal);
  } catch (error) {
    if (!isDummyDataEnabled()) throw error;
  }
}

export async function checkoutCartBatch(
  batchId: string,
  payload: CheckoutBatchRequest,
  signal?: AbortSignal,
): Promise<CheckoutBatchResponse> {
  try {
    const response = await postCheckoutBatchApi(batchId, payload, signal);
    if (response.data) return response.data;
    return {
      orderId: `ord-${Date.now()}`,
      transactionNumber: `TRX-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      billingCode: `820260825${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: payload.paymentMethod,
      totalAmount: 1850000,
      status: "pending",
      createdAt: new Date().toISOString(),
      billingExpiredAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        orderId: `ord-${Date.now()}`,
        transactionNumber: `TRX-${Date.now()}`,
        orderNumber: `ORD-${Date.now()}`,
        billingCode: `820260825${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: payload.paymentMethod,
        totalAmount: 1850000,
        status: "pending",
        createdAt: new Date().toISOString(),
        billingExpiredAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      };
    }
    throw error;
  }
}
