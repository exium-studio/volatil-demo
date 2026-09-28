// src/features/mitra/data-request/types/mitra.data-request.pricing-policy.type.ts

export type MitraPolicyItem = {
  id: string;
  spatialBasis: "bidang" | "kawasan";
  unitPrice: number;
  unitLabel: string;
  minPurchase: number;
  minUnit: string;
  description?: string;
};

export type MitraPricingPolicyResponse = {
  policies: MitraPolicyItem[];
  config: {
    minimumBidangCount: number;
    minimumKawasanHa: number;
    pricePerBidang: number;
    pricePerKawasanHa: number;
  };
};

export type MitraPricingPolicy = {
  minBidangCount: number;
  minKawasanHa: number;
  pricePerBidang: number;
  pricePerKawasanHa: number;
  isLoading: boolean;
};
