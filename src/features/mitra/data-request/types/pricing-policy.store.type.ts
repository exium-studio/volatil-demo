// src/features/mitra/data-request/types/pricing-policy.store.type.ts

import type {
  MasterPricingItem,
  SystemPolicies,
  SystemPolicyItem,
} from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";

export type PricingPolicyState = {
  pricingItems: MasterPricingItem[];
  policyItems: SystemPolicyItem[];
  minBidangCount: number;
  minKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
  pnbpCode: string;
  paymentTimeoutFallbackHours: number;
  accessDurationDays: number;
  maxExtensionCount: number;
  extensionWindowDays: number;
  systemPolicies: SystemPolicies;
  isInitialized: boolean;
  calculateRenewalPrice: (workspace: {
    bidangCoverageCount?: number | null;
    kawasanCoverageHa?: number | null;
    layers?: Array<{
      spatialBasis?: "bidang" | "kawasan";
      igtBasis?: "bidang" | "kawasan";
    }>;
  }) => number;
  setPolicies: (data: {
    pricingItems: MasterPricingItem[];
    policyItems: SystemPolicyItem[];
  }) => void;
  resetPolicies: () => void;
};
