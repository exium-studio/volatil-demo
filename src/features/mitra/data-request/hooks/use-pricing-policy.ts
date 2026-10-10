// src/features/mitra/data-request/hooks/use-pricing-policy.ts

import {
  fetchMasterPricingApi,
  fetchSystemPoliciesApi,
} from "@/features/mitra/data-request/api/mitra.data-request-policies.api";
import type {
  MitraPricingPolicy,
  SystemPolicies,
} from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const usePricingPolicy = (): MitraPricingPolicy => {
  // Queries
  const pricingQuery = useQuery({
    queryKey: [...queryKeys.mitra.dataRequest.all, "master-pricing"],
    queryFn: ({ signal }) => fetchMasterPricingApi(signal),
    staleTime: 5 * 60 * 1000,
  });

  const policiesQuery = useQuery({
    queryKey: queryKeys.mitra.dataRequest.policies(),
    queryFn: ({ signal }) => fetchSystemPoliciesApi(signal),
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    const pricingItems = pricingQuery.data ?? [];
    const policyItems = policiesQuery.data ?? [];

    const bidangPricing = pricingItems.find((it) => it.igtBasis === "bidang");
    const kawasanPricing = pricingItems.find((it) => it.igtBasis === "kawasan");

    const minBidangCount = Number(bidangPricing?.minimumPurchase ?? 0);
    const minKawasanHa = Number(kawasanPricing?.minimumPurchase ?? 0);

    const pricePerBidang = Number(bidangPricing?.price ?? 0);
    const pricePerKawasanHa = Number(kawasanPricing?.price ?? 0);

    const pnbpCode = bidangPricing?.pnbpCode || kawasanPricing?.pnbpCode || "";

    const paymentTimeoutPolicy = policyItems.find(
      (it) => it.key === "MIN_PURCHASE_BIDANG" || it.key === "payment_timeout_fallback_hours",
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

    const paymentTimeoutFallbackHours = Number(paymentTimeoutPolicy?.value ?? 24);

    const systemPolicies: SystemPolicies = {
      payment_timeout_fallback_hours: paymentTimeoutFallbackHours,
      order_access_duration_days: Number(accessDurationPolicy?.value ?? 365),
      order_max_extension_count: Number(maxExtensionPolicy?.value ?? 1),
      order_extension_window_days: Number(extensionWindowPolicy?.value ?? 7),
    };

    const isLoading = pricingQuery.isLoading || policiesQuery.isLoading;
    const isError = pricingQuery.isError || policiesQuery.isError;
    const error =
      pricingQuery.error instanceof Error
        ? pricingQuery.error
        : policiesQuery.error instanceof Error
          ? policiesQuery.error
          : null;

    return {
      pricingItems,
      policyItems,
      minBidangCount,
      minKawasanHa,
      pricePerBidang,
      pricePerKawasanHa,
      pnbpCode,
      paymentTimeoutFallbackHours,
      systemPolicies,
      isLoading,
      isError,
      error,
      refetch: () => {
        void pricingQuery.refetch();
        void policiesQuery.refetch();
      },
    };
  }, [pricingQuery, policiesQuery]);
};
