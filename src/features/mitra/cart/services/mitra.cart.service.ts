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
    if (response.data) return response.data;
    if (isDummyDataEnabled()) {
      return {
        billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
    throw new Error("Checkout response is empty");
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        billingCode: `BILL-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
    throw error;
  }
}

// -------------------------------------------------------------------------------------
// Order Workflow Services
// -------------------------------------------------------------------------------------

import {
  deleteCartOrderApi,
  fetchActiveCartOrderApi,
  fetchCartOrderDetailApi,
  fetchCartOrdersApi,
  fetchExpiredCartOrdersApi,
  fetchOrderPaymentStatusApi,
  postCheckoutOrderApi,
  postCreateCartOrderApi,
  postReorderCartOrderApi,
} from "@/features/mitra/cart/api/mitra.cart.api";
import type {
  ActiveCartOrder,
  AddToCartOrderRequest,
  AddToCartOrderResponse,
  CartOrder,
  CartOrderListResponse,
  CheckoutOrderRequest,
  CheckoutOrderResponse,
  OrderPaymentStatusResponse,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import {
  DUMMY_ACTIVE_CART_ORDER,
  DUMMY_CART_ORDERS,
} from "@/shared/constants/dummy-data/dummy-cart-order";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

let localDummyOrders = [...DUMMY_CART_ORDERS];

export async function createCartOrder(
  payload: AddToCartOrderRequest,
  signal?: AbortSignal,
): Promise<AddToCartOrderResponse> {
  try {
    const response = await postCreateCartOrderApi(payload, signal);
    if (response.data) return response.data;
    const newOrderId = `ord-${Date.now()}`;
    const calculatedTotal = 1200000 * payload.items.length;
    const newOrder: CartOrder = {
      orderId: newOrderId,
      status: "pending_payment",
      selectionType: payload.selectionType ?? "catalog",
      administrativeFilter: payload.administrativeFilter,
      aoiPolygon: payload.aoiPolygon,
      cqlFilter: payload.cqlFilter,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      totalPrice: calculatedTotal,
      items: payload.items.map((it, idx) => ({
        id: `coi-${Date.now()}-${idx}`,
        sourceLayerId: it.sourceLayerId ?? "geonode:layer",
        sourceLayerTitle: `Layer IGT (${it.sourceLayerId})`,
        spatialBasis: "bidang",
        featuresCount: 15,
        unitPrice: 50000,
        subtotalPrice: 1200000,
      })),
    };
    localDummyOrders = [newOrder, ...localDummyOrders];
    return {
      orderId: newOrderId,
      status: "pending_payment",
      estimatedTotalPrice: calculatedTotal,
      createdAt: newOrder.createdAt,
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      const newOrderId = `ord-${Date.now()}`;
      const calculatedTotal = 1200000 * payload.items.length;
      const newOrder: CartOrder = {
        orderId: newOrderId,
        status: "pending_payment",
        selectionType: payload.selectionType ?? "catalog",
        administrativeFilter: payload.administrativeFilter,
        aoiPolygon: payload.aoiPolygon,
        cqlFilter: payload.cqlFilter,
        createdAt: new Date().toISOString(),
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        totalPrice: calculatedTotal,
        items: payload.items.map((it, idx) => ({
          id: `coi-${Date.now()}-${idx}`,
          sourceLayerId: it.sourceLayerId ?? "geonode:layer",
          sourceLayerTitle: `Layer IGT (${it.sourceLayerId})`,
          spatialBasis: "bidang",
          featuresCount: 15,
          unitPrice: 50000,
          subtotalPrice: 1200000,
        })),
      };
      localDummyOrders = [newOrder, ...localDummyOrders];
      return {
        orderId: newOrderId,
        status: "pending_payment",
        estimatedTotalPrice: calculatedTotal,
        createdAt: newOrder.createdAt,
      };
    }
    throw error;
  }
}

export async function getCartOrders(
  signal?: AbortSignal,
): Promise<CartOrderListResponse> {
  try {
    const response = await fetchCartOrdersApi(undefined, signal);
    if (response.data) return response.data;
    return isDummyDataEnabled()
      ? { orders: localDummyOrders, total: localDummyOrders.length }
      : { orders: [], total: 0 };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return { orders: localDummyOrders, total: localDummyOrders.length };
    }
    throw error;
  }
}

export async function getCartOrderDetail(
  orderId: string,
  signal?: AbortSignal,
): Promise<CartOrder | null> {
  try {
    const response = await fetchCartOrderDetailApi(orderId, signal);
    if (response.data !== undefined) return response.data;
    if (isDummyDataEnabled()) {
      return localDummyOrders.find((b) => b.orderId === orderId) ?? null;
    }
    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return localDummyOrders.find((b) => b.orderId === orderId) ?? null;
    }
    throw error;
  }
}

export async function getActiveCartOrder(
  signal?: AbortSignal,
): Promise<ActiveCartOrder | null> {
  try {
    const response = await fetchActiveCartOrderApi(signal);
    if (response.data !== undefined) return response.data;
    return isDummyDataEnabled()
      ? (localDummyOrders[0] ?? DUMMY_ACTIVE_CART_ORDER)
      : null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return localDummyOrders[0] ?? DUMMY_ACTIVE_CART_ORDER;
    }
    throw error;
  }
}

export async function cancelActiveCartOrder(
  orderId: string,
  signal?: AbortSignal,
): Promise<void> {
  try {
    await deleteCartOrderApi(orderId, signal);
    if (isDummyDataEnabled()) {
      localDummyOrders = localDummyOrders.filter(
        (b) => b.orderId !== orderId,
      );
    }
  } catch (error) {
    if (isDummyDataEnabled()) {
      localDummyOrders = localDummyOrders.filter(
        (b) => b.orderId !== orderId,
      );
      return;
    }
    throw error;
  }
}

export async function clearAllCartOrders(
  orderIds: string[],
  signal?: AbortSignal,
): Promise<void> {
  try {
    await Promise.all(orderIds.map((id) => deleteCartOrderApi(id, signal)));
    if (isDummyDataEnabled()) {
      localDummyOrders = [];
    }
  } catch (error) {
    if (isDummyDataEnabled()) {
      localDummyOrders = [];
      return;
    }
    throw error;
  }
}

export async function checkoutCartOrder(
  orderId: string,
  payload?: CheckoutOrderRequest,
  signal?: AbortSignal,
): Promise<CheckoutOrderResponse> {
  try {
    const response = await postCheckoutOrderApi(orderId, payload, signal);
    if (response.data) return response.data;
    return {
      orderId: `ord-${Date.now()}`,
      transactionNumber: `TRX-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      billingCode: `820260825${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: payload?.paymentMethod ?? "MPN_GEN2",
      totalAmount: 1850000,
      status: "pending",
      createdAt: new Date().toISOString(),
      billingExpiredAt: new Date(
        Date.now() + 1000 * 60 * 60 * 48,
      ).toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        orderId: `ord-${Date.now()}`,
        transactionNumber: `TRX-${Date.now()}`,
        orderNumber: `ORD-${Date.now()}`,
        billingCode: `820260825${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: payload?.paymentMethod ?? "MPN_GEN2",
        totalAmount: 1850000,
        status: "pending",
        createdAt: new Date().toISOString(),
        billingExpiredAt: new Date(
          Date.now() + 1000 * 60 * 60 * 48,
        ).toISOString(),
      };
    }
    throw error;
  }
}

export async function getExpiredCartOrders(
  signal?: AbortSignal,
): Promise<CartOrderListResponse> {
  try {
    const response = await fetchExpiredCartOrdersApi(signal);
    if (response.data) return response.data;
    if (isDummyDataEnabled()) {
      const expired = localDummyOrders.filter((b) => b.status === "rejected");
      return { orders: expired, total: expired.length };
    }
    return { orders: [], total: 0 };
  } catch (error) {
    if (isDummyDataEnabled()) {
      const expired = localDummyOrders.filter((b) => b.status === "rejected");
      return { orders: expired, total: expired.length };
    }
    throw error;
  }
}

export async function reorderCartOrder(
  orderId: string,
  signal?: AbortSignal,
): Promise<AddToCartOrderResponse> {
  try {
    const response = await postReorderCartOrderApi(orderId, signal);
    if (response.data) return response.data;
    const newOrderId = `ord-${Date.now()}`;
    const oldOrder = localDummyOrders.find((b) => b.orderId === orderId);
    const newOrder: CartOrder = {
      orderId: newOrderId,
      status: "pending_payment",
      selectionType: oldOrder?.selectionType ?? "catalog",
      administrativeFilter: oldOrder?.administrativeFilter,
      aoiPolygon: oldOrder?.aoiPolygon,
      cqlFilter: oldOrder?.cqlFilter,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      totalPrice: oldOrder?.totalPrice ?? 1200000,
      items: oldOrder?.items ?? [],
    };
    localDummyOrders = [newOrder, ...localDummyOrders];
    return {
      orderId: newOrderId,
      status: "pending_payment",
      estimatedTotalPrice: newOrder.totalPrice,
      createdAt: newOrder.createdAt,
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      const newOrderId = `ord-${Date.now()}`;
      const oldOrder = localDummyOrders.find((b) => b.orderId === orderId);
      const newOrder: CartOrder = {
        orderId: newOrderId,
        status: "pending_payment",
        selectionType: oldOrder?.selectionType ?? "catalog",
        administrativeFilter: oldOrder?.administrativeFilter,
        aoiPolygon: oldOrder?.aoiPolygon,
        cqlFilter: oldOrder?.cqlFilter,
        createdAt: new Date().toISOString(),
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        totalPrice: oldOrder?.totalPrice ?? 1200000,
        items: oldOrder?.items ?? [],
      };
      localDummyOrders = [newOrder, ...localDummyOrders];
      return {
        orderId: newOrderId,
        status: "pending_payment",
        estimatedTotalPrice: newOrder.totalPrice,
        createdAt: newOrder.createdAt,
      };
    }
    throw error;
  }
}

export async function checkOrderPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<OrderPaymentStatusResponse> {
  try {
    const response = await fetchOrderPaymentStatusApi(orderId, signal);
    if (response.data) return response.data;
    return {
      orderId,
      transactionStatus: "paid",
      paidAt: new Date().toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        orderId,
        transactionStatus: "paid",
        paidAt: new Date().toISOString(),
      };
    }
    throw error;
  }
}

// Aliases
export const createCartBatch = createCartOrder;
export const getCartBatches = getCartOrders;
export const getCartBatchDetail = getCartOrderDetail;
export const getActiveCartBatch = getActiveCartOrder;
export const cancelActiveCartBatch = cancelActiveCartOrder;
export const clearAllCartBatches = clearAllCartOrders;
export const checkoutCartBatch = checkoutCartOrder;
export const getExpiredCartBatches = getExpiredCartOrders;
export const reorderCartBatch = reorderCartOrder;
