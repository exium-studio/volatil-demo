// src/features/mitra/data-request/hooks/use-pricing-policy.ts

import { getMitraDataRequestPolicies } from "@/features/mitra/data-request/api/mitra.data-request-policies.api";
import type { MitraPricingPolicy } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const usePricingPolicy = (): MitraPricingPolicy => {
  // Queries — fetch active pricing policies for Mitra data request
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.mitra.dataRequest.policies(),
    queryFn: ({ signal }) => getMitraDataRequestPolicies(signal),
    staleTime: 10 * 60 * 1000,
  });

  // Derived Values — extract limits & rates from policy response with fallback to CART_CONFIG
  return useMemo(() => {
    const policies = data?.policies ?? [];
    const config = data?.config;

    const bidangPolicy = policies.find((it) => it.spatialBasis === "bidang");
    const kawasanPolicy = policies.find((it) => it.spatialBasis === "kawasan");

    const minBidangCount =
      bidangPolicy?.minPurchase && bidangPolicy.minPurchase > 0
        ? bidangPolicy.minPurchase
        : config?.minimumBidangCount ?? CART_CONFIG.minimumBidangCount;

    const minKawasanHa =
      kawasanPolicy?.minPurchase && kawasanPolicy.minPurchase > 0
        ? kawasanPolicy.minPurchase
        : config?.minimumKawasanHa ?? CART_CONFIG.minimumKawasanHa;

    const pricePerBidang =
      bidangPolicy?.unitPrice && bidangPolicy.unitPrice > 0
        ? bidangPolicy.unitPrice
        : config?.pricePerBidang ?? CART_CONFIG.pricePerBidang;

    const pricePerKawasanHa =
      kawasanPolicy?.unitPrice && kawasanPolicy.unitPrice > 0
        ? kawasanPolicy.unitPrice
        : config?.pricePerKawasanHa ?? CART_CONFIG.pricePerKawasanHa;

    return {
      minBidangCount,
      minKawasanHa,
      pricePerBidang,
      pricePerKawasanHa,
      isLoading,
    };
  }, [data, isLoading]);
};
