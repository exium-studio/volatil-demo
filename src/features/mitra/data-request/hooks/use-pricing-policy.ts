// src/features/mitra/data-request/hooks/use-pricing-policy.ts

import { getMitraDataRequestPolicies } from "@/features/mitra/data-request/api/mitra.data-request-policies.api";
import type { MitraPricingPolicy } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { CART_CONFIG } from "@/features/mitra/home/constants/cart.config";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const usePricingPolicy = (
  category?: "pricing" | "order",
): MitraPricingPolicy => {
  // Queries — fetch active pricing policies for Mitra data request
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys.mitra.dataRequest.policies(), category ?? "all"],
    queryFn: ({ signal }) => getMitraDataRequestPolicies(category, signal),
    staleTime: 10 * 60 * 1000,
  });

  // Derived Values — extract limits & rates from 2-category policy response with fallbacks
  return useMemo(() => {
    const pricing = data?.pricing;
    const order = data?.order;

    const policies = pricing?.items ?? [];
    const globalLimits = pricing?.globalLimits;

    const bidangPolicy = policies.find((it) => it.spatialBasis === "bidang");
    const kawasanPolicy = policies.find((it) => it.spatialBasis === "kawasan");

    const minBidangCount =
      bidangPolicy?.minPurchase && bidangPolicy.minPurchase > 0
        ? bidangPolicy.minPurchase
        : globalLimits?.minimumBidangCount ?? CART_CONFIG.minimumBidangCount;

    const minKawasanHa =
      kawasanPolicy?.minPurchase && kawasanPolicy.minPurchase > 0
        ? kawasanPolicy.minPurchase
        : globalLimits?.minimumKawasanHa ?? CART_CONFIG.minimumKawasanHa;

    const pricePerBidang =
      bidangPolicy?.unitPrice && bidangPolicy.unitPrice > 0
        ? bidangPolicy.unitPrice
        : globalLimits?.pricePerBidang ?? CART_CONFIG.pricePerBidang;

    const pricePerKawasanHa =
      kawasanPolicy?.unitPrice && kawasanPolicy.unitPrice > 0
        ? kawasanPolicy.unitPrice
        : globalLimits?.pricePerKawasanHa ?? CART_CONFIG.pricePerKawasanHa;

    const pnbpCode = pricing?.pnbpCode ?? "425121";
    const paymentTimeoutFallbackHours =
      pricing?.paymentTimeoutFallbackHours ?? 24;

    const systemPolicies = order
      ? {
          payment_timeout_fallback_hours: paymentTimeoutFallbackHours,
          order_access_duration_days: order.accessDurationDays ?? 365,
          order_max_extension_count: order.maxExtensionCount ?? 1,
          order_extension_window_days: order.extensionWindowDays ?? 7,
        }
      : undefined;

    return {
      pricing,
      order,
      policies,
      config: globalLimits,
      minBidangCount,
      minKawasanHa,
      pricePerBidang,
      pricePerKawasanHa,
      pnbpCode,
      paymentTimeoutFallbackHours,
      systemPolicies,
      isLoading,
      isError,
      error: error instanceof Error ? error : error ? new Error(String(error)) : null,
      refetch: () => {
        void refetch();
      },
    };
  }, [data, isLoading, isError, error, refetch]);
};

