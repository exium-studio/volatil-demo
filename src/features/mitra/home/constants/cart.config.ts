// src/features/mitra/home/constants/cart.config.ts

import type { CartConfig } from "@/features/mitra/cart/types/cart.type";

/**
 * Pricing and policy configuration for the IGT-PR cart.
 * - pricePerBidang: Rp 7.500 per bidang tanah
 * - pricePerKawasanHa: Rp 20.000 per hektar untuk basis kawasan
 */
export const CART_CONFIG: CartConfig = {
  minimumBidangCount: 5,
  minimumKawasanHa: 20000,
  pricePerBidang: 7500,
  pricePerKawasanHa: 20000,
};
