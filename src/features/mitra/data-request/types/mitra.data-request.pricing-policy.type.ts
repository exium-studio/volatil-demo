// src/features/mitra/data-request/types/mitra.data-request.pricing-policy.type.ts

export type MitraPolicyItem = {
  id: string;
  layerId?: string | null;
  layerTitle?: string | null;
  kodePnbp?: string | null;
  spatialBasis: "bidang" | "kawasan";
  unitPrice: number;
  unitLabel: string;
  minPurchase: number;
  minUnit: string;
  description?: string;
};

export type PolicyPricingCategory = {
  globalLimits: {
    minimumBidangCount: number;
    minimumKawasanHa: number;
    pricePerBidang: number;
    pricePerKawasanHa: number;
  };
  pnbpCode: string;
  paymentTimeoutFallbackHours: number;
  items: MitraPolicyItem[];
};

export type PolicyOrderCategory = {
  accessDurationDays: number;
  maxExtensionCount: number;
  extensionWindowDays: number;
};

export type SystemPolicies = {
  payment_timeout_fallback_hours: number;
  order_access_duration_days: number;
  order_max_extension_count: number;
  order_extension_window_days: number;
};

export type SystemPolicyItem = {
  key: string;
  value: string;
  valueType: "number" | "string" | "boolean";
  label: string;
  description: string;
  unit?: string;
};

export type MitraPricingPolicyResponse = {
  pricing: PolicyPricingCategory;
  order: PolicyOrderCategory;
};

export type MitraPricingPolicy = {
  pricing?: PolicyPricingCategory;
  order?: PolicyOrderCategory;
  policies?: MitraPolicyItem[];
  config?: {
    minimumBidangCount: number;
    minimumKawasanHa: number;
    pricePerBidang: number;
    pricePerKawasanHa: number;
  };
  minBidangCount: number;
  minKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
  pnbpCode: string;
  paymentTimeoutFallbackHours: number;
  systemPolicies?: SystemPolicies;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

