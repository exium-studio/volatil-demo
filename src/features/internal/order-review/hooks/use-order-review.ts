// src/features/internal/order-review/hooks/use-order-review.ts

// src\features\internal\order-review\hooks\use-order-review.ts

// src\features\internal\order-review\hooks\use-order-review.ts

import {
  approveOrderApi,
  createInternalOrdersEventSource,
  createOrderProvisionEventSource,
  fetchInternalOrderDetailApi,
  fetchInternalOrdersApi,
  provisionOrderApi,
  rejectOrderApi,
} from "@/features/internal/order-review/api/order-review.api";
import type {
  ApproveOrderPayload,
  InternalOrderListQueryParams,
  ProvisionOrderPayload,
  ProvisionStreamHookResult,
  ProvisionStreamItem,
  ProvisionStreamState,
  RejectOrderPayload,
} from "@/features/internal/order-review/types/order-review.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

export const useInternalOrdersQuery = (params?: InternalOrderListQueryParams) => {
  const query = useQuery({
    queryKey: ["internal", "orders", params],
    queryFn: ({ signal }) => fetchInternalOrdersApi(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useInternalOrderDetailQuery = (orderId?: string) => {
  return useQuery({
    queryKey: ["internal", "order", orderId],
    queryFn: ({ signal }) =>
      orderId ? fetchInternalOrderDetailApi(orderId, signal) : null,
    enabled: Boolean(orderId),
  });
};

export const useProvisionOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("provision-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Memulai proses WMS...",
      description: "Mengirim permintaan pembuatan layanan WMS ke background...",
    },
    successMessage: {
      title: "Pembuatan WMS sedang diproses",
      description:
        "Layanan WMS sedang disiapkan di background. Status akan terupdate otomatis.",
    },
    errorMessage: {
      title: "Gagal memulai pembuatan WMS",
    },
  });

  return useMutation({
    mutationFn: (payload: ProvisionOrderPayload) => provisionOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["internal", "order"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useApproveOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("approve-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Menyetujui pesanan...",
    },
    successMessage: {
      title: "Pesanan berhasil disetujui",
    },
    errorMessage: {
      title: "Gagal menyetujui pesanan",
    },
  });

  return useMutation({
    mutationFn: (payload: ApproveOrderPayload) => approveOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("reject-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Menolak pesanan...",
    },
    successMessage: {
      title: "Pesanan telah ditolak",
    },
    errorMessage: {
      title: "Gagal menolak pesanan",
    },
  });

  return useMutation({
    mutationFn: (payload: RejectOrderPayload) => rejectOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

/**
 * Hook to manage real-time SSE progress for layer provisioning to GeoServer internal.
 */
export const useOrderProvisionStream = (
  orderId: string,
  options?: {
    onCompleted?: () => void;
    onError?: (error: string) => void;
  },
): ProvisionStreamHookResult => {
  const queryClient = useQueryClient();
  const { onCompleted, onError } = options ?? {};

  const [state, setState] = useState<ProvisionStreamState>({
    isConnected: false,
    isStarted: false,
    isCompleted: false,
    isFatal: false,
    orderStatus: "paid",
    totalItems: 0,
    processedItems: 0,
    failedCount: 0,
    items: {},
    errorMessage: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);

  const stopListening = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isConnected: false,
    }));
  }, []);

  const resetState = useCallback(() => {
    stopListening();
    setState({
      isConnected: false,
      isStarted: false,
      isCompleted: false,
      isFatal: false,
      orderStatus: "paid",
      totalItems: 0,
      processedItems: 0,
      failedCount: 0,
      items: {},
      errorMessage: null,
    });
  }, [stopListening]);

  const startListening = useCallback(() => {
    if (!orderId || typeof window === "undefined") return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const es = createOrderProvisionEventSource(orderId);
      eventSourceRef.current = es;

      es.addEventListener("connected", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setState((prev) => ({
            ...prev,
            isConnected: true,
            orderStatus: data.orderStatus ?? prev.orderStatus,
            totalItems: Number(data.totalItems ?? prev.totalItems),
          }));
        } catch {
          // ignore parsing error
        }
      });

      es.addEventListener("provision_started", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setState((prev) => ({
            ...prev,
            isStarted: true,
            totalItems: Number(data.totalItems ?? prev.totalItems),
            orderStatus: data.orderStatus ?? "processing",
          }));
        } catch {
          // ignore parsing error
        }
      });

      es.addEventListener("item_start", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const key = data.sourceLayerId || data.itemId;
          setState((prev) => {
            const existing = prev.items[key];
            const updatedItem: ProvisionStreamItem = {
              itemId: String(data.itemId ?? existing?.itemId ?? ""),
              itemIndex: Number(data.itemIndex ?? existing?.itemIndex ?? 1),
              totalItems: Number(data.totalItems ?? prev.totalItems),
              sourceLayerId: String(data.sourceLayerId ?? key),
              sourceLayerTitle: String(
                data.sourceLayerTitle ?? existing?.sourceLayerTitle ?? key,
              ),
              spatialBasis: data.spatialBasis ?? existing?.spatialBasis,
              status: "processing",
            };

            return {
              ...prev,
              totalItems: Number(data.totalItems ?? prev.totalItems),
              items: {
                ...prev.items,
                [key]: updatedItem,
              },
            };
          });
        } catch {
          // ignore parsing error
        }
      });

      es.addEventListener("item_done", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const key = data.sourceLayerId || data.itemId;
          setState((prev) => {
            const existing = prev.items[key];
            const updatedItem: ProvisionStreamItem = {
              itemId: String(data.itemId ?? existing?.itemId ?? ""),
              itemIndex: Number(data.itemIndex ?? existing?.itemIndex ?? 1),
              totalItems: Number(data.totalItems ?? prev.totalItems),
              sourceLayerId: String(data.sourceLayerId ?? key),
              sourceLayerTitle: String(
                data.sourceLayerTitle ?? existing?.sourceLayerTitle ?? key,
              ),
              status: "done",
              proxyWmsUrl: data.proxyWmsUrl,
              proxyWfsUrl: data.proxyWfsUrl,
            };

            return {
              ...prev,
              processedItems: prev.processedItems + 1,
              items: {
                ...prev.items,
                [key]: updatedItem,
              },
            };
          });
        } catch {
          // ignore parsing error
        }
      });

      es.addEventListener("item_failed", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const key = data.sourceLayerId || data.itemId;
          setState((prev) => {
            const existing = prev.items[key];
            const updatedItem: ProvisionStreamItem = {
              itemId: String(data.itemId ?? existing?.itemId ?? ""),
              itemIndex: Number(data.itemIndex ?? existing?.itemIndex ?? 1),
              totalItems: Number(data.totalItems ?? prev.totalItems),
              sourceLayerId: String(data.sourceLayerId ?? key),
              sourceLayerTitle: String(
                data.sourceLayerTitle ?? existing?.sourceLayerTitle ?? key,
              ),
              status: "failed",
              error: data.error,
            };

            return {
              ...prev,
              processedItems: prev.processedItems + 1,
              failedCount: prev.failedCount + 1,
              items: {
                ...prev.items,
                [key]: updatedItem,
              },
            };
          });
        } catch {
          // ignore parsing error
        }
      });

      es.addEventListener("provision_completed", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setState((prev) => ({
            ...prev,
            isCompleted: true,
            orderStatus: data.orderStatus ?? "pending_review",
            processedItems: Number(data.processedItems ?? prev.totalItems),
            failedCount: Number(data.failedCount ?? prev.failedCount),
          }));

          void queryClient.invalidateQueries({
            queryKey: ["internal", "orders"],
          });
          void queryClient.invalidateQueries({
            queryKey: ["internal", "order", orderId],
          });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.home.all,
          });

          onCompleted?.();
        } catch {
          // ignore parsing error
        }
        es.close();
      });

      es.addEventListener("provision_fatal", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const errMsg = data.error || "Terjadi kesalahan fatal saat provisioning.";
          setState((prev) => ({
            ...prev,
            isFatal: true,
            errorMessage: errMsg,
          }));
          onError?.(errMsg);
        } catch {
          // ignore parsing error
        }
        es.close();
      });

      es.onerror = () => {
        // SSE will attempt reconnecting unless manually closed
      };
    } catch (err) {
      console.error("Failed to establish SSE connection:", err);
    }
  }, [orderId, queryClient, onCompleted, onError]);

  const triggerProvision = useCallback(async () => {
    return provisionOrderApi({ orderId });
  }, [orderId]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    triggerProvision,
    startListening,
    stopListening,
    resetState,
  };
};

/**
 * Hook to automatically listen for SSE provisioning events across all processing orders in the background.
 */
export const useOrdersProvisionStream = (processingOrderIds: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !processingOrderIds ||
      processingOrderIds.length === 0
    ) {
      return;
    }

    const eventSources: EventSource[] = [];

    processingOrderIds.forEach((orderId) => {
      try {
        const es = createOrderProvisionEventSource(orderId);
        eventSources.push(es);

        es.addEventListener("provision_completed", () => {
          void queryClient.invalidateQueries({
            queryKey: ["internal", "orders"],
          });
          void queryClient.invalidateQueries({
            queryKey: ["internal", "order", orderId],
          });
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.home.all,
          });
          es.close();
        });

        es.addEventListener("provision_fatal", () => {
          void queryClient.invalidateQueries({
            queryKey: ["internal", "orders"],
          });
          void queryClient.invalidateQueries({
            queryKey: ["internal", "order", orderId],
          });
          es.close();
        });

        es.onerror = () => {
          // SSE will reconnect or fail gracefully
        };
      } catch (err) {
        console.error(`Failed to connect SSE for order ${orderId}:`, err);
      }
    });

    return () => {
      eventSources.forEach((es) => es.close());
    };
  }, [processingOrderIds, queryClient]);
};

/**
 * Hook to listen to global internal review order stream (e.g. when Mitra creates/pays a new data request).
 * Invalidate internal orders queries on incoming events.
 */
export const useInternalOrdersStream = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = createInternalOrdersEventSource();

      const handleOrderUpdate = () => {
        void queryClient.invalidateQueries({
          queryKey: ["internal", "orders"],
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.internal.home.all,
        });
      };

      // Listen to specific SSE event types from backend
      eventSource.addEventListener("order_created", handleOrderUpdate);
      eventSource.addEventListener("order_paid", handleOrderUpdate);
      eventSource.addEventListener("order_updated", handleOrderUpdate);
      eventSource.addEventListener("message", handleOrderUpdate);

      eventSource.onerror = () => {
        // EventSource will automatically retry connecting
      };
    } catch (err) {
      console.error("Failed to connect to internal orders SSE stream:", err);
    }

    return () => {
      eventSource?.close();
    };
  }, [queryClient]);
};


