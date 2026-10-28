// src/features/mitra/data-request/stores/pricing-policy.store.ts

import type { PricingPolicyState } from "@/features/mitra/data-request/types/pricing-policy.store.type";
import type { SystemPolicies } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { create } from "zustand";

const INITIAL_SYSTEM_POLICIES: SystemPolicies = {
  payment_timeout_fallback_hours: 24,
  order_access_duration_days: 365,
  order_max_extension_count: 0,
  order_extension_window_days: 7,
};

export const usePricingPolicyStore = create<PricingPolicyState>((set, get) => ({
  pricingItems: [],
  policyItems: [],
  minBidangCount: 0,
  minKawasanHa: 0,
  pricePerBidang: 750000,
  pricePerKawasanHa: 1500000,
  pnbpCode: "",
  paymentTimeoutFallbackHours: 24,
  accessDurationDays: 365,
  maxExtensionCount: 0,
  extensionWindowDays: 7,
  systemPolicies: INITIAL_SYSTEM_POLICIES,
  isInitialized: false,

  calculateRenewalPrice: (workspace) => {
    const { pricePerBidang, pricePerKawasanHa } = get();

    // 1. Calculate from exact units coverage if available
    const bidangCount = Number(workspace.bidangCoverageCount ?? 0);
    const kawasanHa = Number(workspace.kawasanCoverageHa ?? 0);

    let total = 0;
    if (bidangCount > 0 && pricePerBidang > 0) {
      total += bidangCount * pricePerBidang;
    }
    if (kawasanHa > 0 && pricePerKawasanHa > 0) {
      total += kawasanHa * pricePerKawasanHa;
    }

    if (total > 0) {
      return total;
    }

    // 2. Fallback: calculate from workspace layers with pricing policy rates
    if (workspace.layers && workspace.layers.length > 0) {
      return workspace.layers.reduce((acc, layer) => {
        const basis = layer.spatialBasis ?? layer.igtBasis;
        const rate =
          basis === "kawasan"
            ? (pricePerKawasanHa || 1500000)
            : (pricePerBidang || 750000);
        return acc + rate;
      }, 0);
    }

    return 1500000;
  },

  setPolicies: ({ pricingItems, policyItems }) => {
    const bidangPricing = pricingItems.find((it) => it.igtBasis === "bidang");
    const kawasanPricing = pricingItems.find((it) => it.igtBasis === "kawasan");

    const minBidangCount = Number(bidangPricing?.minimumPurchase ?? 0);
    const minKawasanHa = Number(kawasanPricing?.minimumPurchase ?? 0);

    const pricePerBidang = Number(bidangPricing?.price ?? 0);
    const pricePerKawasanHa = Number(kawasanPricing?.price ?? 0);

    const pnbpCode = bidangPricing?.pnbpCode || kawasanPricing?.pnbpCode || "";

    const paymentTimeoutPolicy = policyItems.find(
      (it) =>
        it.key === "MIN_PURCHASE_BIDANG" ||
        it.key === "payment_timeout_fallback_hours",
    );
    const accessDurationPolicy = policyItems.find(
      (it) => it.key === "order_access_duration_days",
    );
    const maxExtensionPolicy = policyItems.find(
      (it) => it.key === "order_max_extension_count",
    );
    const extensionWindowPolicy = policyItems.find(
      (it) => it.key === "order_extension_window_days",
    );

    const paymentTimeoutFallbackHours = Number(
      paymentTimeoutPolicy?.value ?? 24,
    );
    const accessDurationDays = Number(accessDurationPolicy?.value ?? 365);
    const maxExtensionCount = Number(maxExtensionPolicy?.value ?? 1);
    const extensionWindowDays = Number(extensionWindowPolicy?.value ?? 7);

    const systemPolicies: SystemPolicies = {
      payment_timeout_fallback_hours: paymentTimeoutFallbackHours,
      order_access_duration_days: accessDurationDays,
      order_max_extension_count: maxExtensionCount,
      order_extension_window_days: extensionWindowDays,
    };

    set({
      pricingItems,
      policyItems,
      minBidangCount,
      minKawasanHa,
      pricePerBidang,
      pricePerKawasanHa,
      pnbpCode,
      paymentTimeoutFallbackHours,
      accessDurationDays,
      maxExtensionCount,
      extensionWindowDays,
      systemPolicies,
      isInitialized: true,
    });
  },

  resetPolicies: () =>
    set({
      pricingItems: [],
      policyItems: [],
      minBidangCount: 0,
      minKawasanHa: 0,
      pricePerBidang: 0,
      pricePerKawasanHa: 0,
      pnbpCode: "",
      paymentTimeoutFallbackHours: 24,
      accessDurationDays: 365,
      maxExtensionCount: 1,
      extensionWindowDays: 7,
      systemPolicies: INITIAL_SYSTEM_POLICIES,
      isInitialized: false,
    }),
}));
