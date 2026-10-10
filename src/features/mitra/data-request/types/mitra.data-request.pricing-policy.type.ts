// src/features/mitra/data-request/types/mitra.data-request.pricing-policy.type.ts

export type MasterPricingItem = {
  id: string;
  price: number;
  pnbpCode: string;
  minimumPurchase: number;
  igtBasis: "bidang" | "kawasan";
  unit: "bidang" | "ha" | string;
};

export type SystemPolicyItem = {
  key: string;
  value: string;
  valueType: "number" | "string" | "boolean" | "json";
  label: string;
  description: string;
  unit?: string;
};

export type SystemPolicies = {
  payment_timeout_fallback_hours?: number;
  order_access_duration_days?: number;
  order_max_extension_count?: number;
  order_extension_window_days?: number;
  [key: string]: number | string | undefined;
};

export type MitraPricingPolicy = {
  pricingItems: MasterPricingItem[];
  policyItems: SystemPolicyItem[];
  minBidangCount: number;
  minKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
  pnbpCode: string;
  paymentTimeoutFallbackHours: number;
  systemPolicies: SystemPolicies;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};
