// src/features/mitra/cart/services/cart.service.ts

import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import type {
  CartStoredIds,
  CartSummary,
  CartSummaryResponse,
} from "@/features/mitra/cart/types/cart.type";
import { getStorage, setStorage } from "@/shared/utils/client/client.storage";

const LOCAL_STORAGE_KEY = "mitra_cart_ids";

// -------------------------------------------------------------------------------------
// Dummy DB — localStorage stores only an array of feature ID strings

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
// All items treated as "bidang" by default in dummy phase.
// Kawasan support will be added when real API provides basis info.

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
