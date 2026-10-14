import {
  fetchMasterPricingApi,
  fetchSystemPoliciesApi,
} from "@/features/mitra/data-request/api/mitra.data-request-policies.api";
import { usePricingPolicyStore } from "@/features/mitra/data-request/stores/pricing-policy.store";
import type {
  MitraPricingPolicy,
  SystemPolicies,
} from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export const usePricingPolicy = (): MitraPricingPolicy => {
  // Stores
  const {
    pricingItems: storedPricingItems,
    policyItems: storedPolicyItems,
    minBidangCount: storedMinBidang,
    minKawasanHa: storedMinKawasan,
    pricePerBidang: storedPriceBidang,
    pricePerKawasanHa: storedPriceKawasan,
    pnbpCode: storedPnbpCode,
    paymentTimeoutFallbackHours: storedTimeoutHours,
    systemPolicies: storedSystemPolicies,
    isInitialized,
    setPolicies,
  } = usePricingPolicyStore();

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

  // Effects — Sync fetched policies with Zustand store
  useEffect(() => {
    if (pricingQuery.data && policiesQuery.data) {
      setPolicies({
        pricingItems: pricingQuery.data,
        policyItems: policiesQuery.data,
      });
    }
  }, [pricingQuery.data, policiesQuery.data, setPolicies]);

  return useMemo(() => {
    const pricingItems = pricingQuery.data ?? (isInitialized ? storedPricingItems : []);
    const policyItems = policiesQuery.data ?? (isInitialized ? storedPolicyItems : []);

    const bidangPricing = pricingItems.find((it) => it.igtBasis === "bidang");
    const kawasanPricing = pricingItems.find((it) => it.igtBasis === "kawasan");

    const minBidangCount =
      bidangPricing !== undefined
        ? Number(bidangPricing.minimumPurchase ?? 0)
        : storedMinBidang;
    const minKawasanHa =
      kawasanPricing !== undefined
        ? Number(kawasanPricing.minimumPurchase ?? 0)
        : storedMinKawasan;

    const pricePerBidang =
      bidangPricing !== undefined
        ? Number(bidangPricing.price ?? 0)
        : storedPriceBidang;
    const pricePerKawasanHa =
      kawasanPricing !== undefined
        ? Number(kawasanPricing.price ?? 0)
        : storedPriceKawasan;

    const pnbpCode =
      bidangPricing?.pnbpCode ||
      kawasanPricing?.pnbpCode ||
      storedPnbpCode;

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

    const paymentTimeoutFallbackHours =
      paymentTimeoutPolicy !== undefined
        ? Number(paymentTimeoutPolicy.value ?? 24)
        : storedTimeoutHours;

    const systemPolicies: SystemPolicies = {
      payment_timeout_fallback_hours: paymentTimeoutFallbackHours,
      order_access_duration_days: Number(
        accessDurationPolicy?.value ?? storedSystemPolicies.order_access_duration_days ?? 365,
      ),
      order_max_extension_count: Number(
        maxExtensionPolicy?.value ?? storedSystemPolicies.order_max_extension_count ?? 1,
      ),
      order_extension_window_days: Number(
        extensionWindowPolicy?.value ?? storedSystemPolicies.order_extension_window_days ?? 7,
      ),
    };

    const isLoading =
      (!isInitialized && (pricingQuery.isLoading || policiesQuery.isLoading));
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
  }, [
    pricingQuery,
    policiesQuery,
    isInitialized,
    storedPricingItems,
    storedPolicyItems,
    storedMinBidang,
    storedMinKawasan,
    storedPriceBidang,
    storedPriceKawasan,
    storedPnbpCode,
    storedTimeoutHours,
    storedSystemPolicies,
  ]);
};

