// src/features/internal/order-review/api/order-review.api.ts

import type {
  ApproveOrderPayload,
  InputBillingCodePayload,
  InternalOrderItem,
  InternalOrderListQueryParams,
  InternalOrderListResponse,
  ProvisionOrderPayload,
  ProvisionOrderResponse,
  RejectOrderPayload,
} from "@/features/internal/order-review/types/order-review.type";
import type { CartOrderItem } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { DUMMY_INTERNAL_ORDERS } from "@/shared/constants/dummy-data/dummy-internal-order-review";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCartOrderItem = (raw: any): CartOrderItem => {
  if (!raw || typeof raw !== "object") return raw;
  return {
    id: raw.id ?? raw._id ?? "",
    sourceLayerId:
      raw.sourceLayerId ??
      raw.source_layer_id ??
      raw.layerId ??
      raw.layer_id ??
      "",
    sourceLayerTitle:
      raw.sourceLayerTitle ??
      raw.source_layer_title ??
      raw.layerTitle ??
      raw.title ??
      raw.sourceLayerId ??
      "",
    spatialBasis: raw.spatialBasis ?? raw.spatial_basis ?? "bidang",
    igtBasis: raw.igtBasis ?? raw.spatialBasis ?? raw.spatial_basis ?? "bidang",
    featuresCount: Number(
      raw.featuresCount ?? raw.features_count ?? raw.count ?? 0,
    ),
    areaHa:
      raw.areaHa != null
        ? Number(raw.areaHa)
        : raw.area_ha != null
          ? Number(raw.area_ha)
          : undefined,
    unitPrice: Number(raw.unitPrice ?? raw.unit_price ?? 0),
    subtotalPrice: Number(
      raw.subtotalPrice ??
        raw.subtotal_price ??
        raw.price ??
        raw.total_price ??
        0,
    ),
    wfsUrl: raw.wfsUrl ?? raw.wfs_url,
    wmsUrl: raw.wmsUrl ?? raw.wms_url,
    previewWmsUrl:
      raw.previewWmsUrl ??
      raw.preview_wms_url ??
      raw.wmsUrl ??
      raw.wms_url ??
      undefined,
    previewWfsUrl:
      raw.previewWfsUrl ??
      raw.preview_wfs_url ??
      raw.wfsUrl ??
      raw.wfs_url ??
      undefined,
    externalWfsUrl: raw.externalWfsUrl ?? raw.external_wfs_url ?? null,
    externalWmsUrl: raw.externalWmsUrl ?? raw.external_wms_url ?? null,
    approvedWmsUrl: raw.approvedWmsUrl ?? raw.approved_wms_url ?? null,
    approvedWfsUrl: raw.approvedWfsUrl ?? raw.approved_wfs_url ?? null,
    selectionType: raw.selectionType ?? raw.selection_type ?? undefined,
    cqlFilter: raw.cqlFilter ?? raw.cql_filter ?? null,
    provisionStatus: raw.provisionStatus ?? raw.provision_status ?? undefined,
    bbox:
      Array.isArray(raw.bbox) && raw.bbox.length === 4
        ? (raw.bbox as [number, number, number, number])
        : undefined,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeInternalOrderItem = (raw: any): InternalOrderItem => {
  if (!raw || typeof raw !== "object") return raw;
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: CartOrderItem[] = rawItems.map(normalizeCartOrderItem);
  const calculatedTotalPrice = items.reduce(
    (acc: number, it: CartOrderItem) => acc + (it.subtotalPrice || 0),
    0,
  );
  const idVal = raw.orderId ?? raw.order_id ?? raw.id ?? "";
  const aoiPolygon = raw.aoiPolygon ?? raw.aoi_polygon ?? null;

  return {
    orderId: idVal,
    orderNumber: raw.orderNumber ?? raw.order_number ?? undefined,
    transactionNumber:
      raw.transactionNumber ?? raw.transaction_number ?? undefined,
    mitraId: String(raw.mitraId ?? raw.mitra_id ?? ""),
    mitraName:
      raw.mitraName ?? raw.mitra_name ?? raw.userName ?? raw.name ?? "Mitra",
    agencyOrCompany: raw.agencyOrCompany ?? raw.agency_or_company ?? undefined,
    email: raw.email ?? undefined,
    status: raw.status ?? raw.orderStatus ?? raw.order_status ?? "pending_review",
    selectionType: raw.selectionType ?? raw.selection_type ?? "catalog",
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    readyAt: raw.readyAt ?? raw.ready_at ?? undefined,
    expiredAt: raw.expiredAt ?? raw.expired_at ?? raw.expiresAt ?? raw.expires_at ?? undefined,
    expiresAt: raw.expiresAt ?? raw.expires_at ?? raw.expiredAt ?? raw.expired_at ?? undefined,
    paidAt: raw.paidAt ?? raw.paid_at ?? undefined,
    totalPrice: Number(
      raw.totalPrice ?? raw.total_price ?? raw.totalAmount ?? raw.total_amount ?? calculatedTotalPrice,
    ),
    totalAmount: Number(
      raw.totalAmount ?? raw.total_amount ?? raw.totalPrice ?? raw.total_price ?? calculatedTotalPrice,
    ),
    transactionStatus: raw.transactionStatus ?? raw.transaction_status ?? undefined,
    coverageHa:
      raw.coverageHa != null
        ? Number(raw.coverageHa)
        : raw.coverage_ha != null
          ? Number(raw.coverage_ha)
          : undefined,
    kawasanCoverageHa:
      raw.kawasanCoverageHa != null
        ? Number(raw.kawasanCoverageHa)
        : raw.kawasan_coverage_ha != null
          ? Number(raw.kawasan_coverage_ha)
          : null,
    featuresCount:
      raw.featuresCount != null
        ? Number(raw.featuresCount)
        : raw.features_count != null
          ? Number(raw.features_count)
          : null,
    bidangCoverageCount:
      raw.bidangCoverageCount != null
        ? Number(raw.bidangCoverageCount)
        : raw.bidang_coverage_count != null
          ? Number(raw.bidang_coverage_count)
          : null,
    items,
    aoiPolygon,
    invoiceUrl: raw.invoiceUrl ?? raw.invoice_url ?? null,
    tteInvoiceUrl: raw.tteInvoiceUrl ?? raw.tte_invoice_url ?? null,
    tte: Boolean(raw.tte ?? (raw.tteInvoiceUrl || raw.tte_invoice_url)),
    internalWorkspaceUrl:
      raw.internalWorkspaceUrl ??
      raw.internal_workspace_url ??
      raw.workspaceUrl ??
      raw.workspace_url ??
      `https://geoserver.internal.volatil.atrbpn.go.id/geoserver/ws_${idVal}/ows`,
    workspaceInteropUrl:
      raw.workspaceInteropUrl ??
      raw.workspace_interop_url ??
      raw.interopUrl ??
      raw.interop_url ??
      null,
    workspaceName:
      raw.workspaceName ??
      raw.workspace_name ??
      `ws_${idVal}`,
    updatePeriods: Array.isArray(raw.updatePeriods ?? raw.update_periods)
      ? (raw.updatePeriods ?? raw.update_periods).map(
          (p: Record<string, unknown>) => ({
            unit: String(p.unit ?? "minutes"),
            jobId: (p.jobId as string | undefined) ?? (p.job_id as string | undefined) ?? null,
            offset: Number(p.offset ?? 0),
            targetAt: String(p.targetAt ?? p.target_at ?? ""),
            completed: Boolean(p.completed),
            milestone: Number(p.milestone ?? 1),
            executedAt: (p.executedAt as string | undefined) ?? (p.executed_at as string | undefined) ?? null,
          }),
        )
      : undefined,
    billingCode: raw.billingCode ?? raw.billing_code ?? null,
    billingExpiredAt: raw.billingExpiredAt ?? raw.billing_expired_at ?? null,
    billingIssuedAt: raw.billingIssuedAt ?? raw.billing_issued_at ?? null,
    paymentSubmittedAt: raw.paymentSubmittedAt ?? raw.payment_submitted_at ?? null,
    paymentNotes: raw.paymentNotes ?? raw.payment_notes ?? null,
    ntpn: raw.ntpn ?? null,
    paymentProofUrl: raw.paymentProofUrl ?? raw.payment_proof_url ?? null,
    paymentProofName: raw.paymentProofName ?? raw.payment_proof_name ?? null,
    isManualPayment: Boolean(
      raw.isManualPayment ??
      raw.is_manual_payment ??
      raw.ntpn ??
      raw.paymentProofUrl ??
      raw.payment_proof_url,
    ),
    paymentVerificationStatus:
      raw.paymentVerificationStatus ?? raw.payment_verification_status ?? undefined,
    rejectionReason: raw.rejectionReason ?? raw.rejection_reason ?? null,
  };
};

export const fetchInternalOrdersApi = async (
  params?: InternalOrderListQueryParams,
  signal?: AbortSignal,
): Promise<InternalOrderListResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get("/api/internal/interop/orders", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        status: params?.status === "all" ? undefined : params?.status,
      },
      signal,
    });

    let rawData = response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
    ) {
      rawData = response.data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawOrders: any[] = [];
    let totalItems = 0;

    if (Array.isArray(rawData)) {
      rawOrders = rawData;
      totalItems = rawData.length;
    } else if (rawData && typeof rawData === "object") {
      if (Array.isArray(rawData.orders)) {
        rawOrders = rawData.orders;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      } else if (Array.isArray(rawData.items)) {
        rawOrders = rawData.items;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      } else if (Array.isArray(rawData.data)) {
        rawOrders = rawData.data;
        totalItems = Number(
          rawData.total ?? rawData.totalItems ?? rawOrders.length,
        );
      }
    } else if (response && Array.isArray(response.orders)) {
      rawOrders = response.orders;
      totalItems = Number(response.total ?? rawOrders.length);
    } else if (response && Array.isArray(response.items)) {
      rawOrders = response.items;
      totalItems = Number(response.total ?? rawOrders.length);
    }

    if (
      rawOrders.length > 0 ||
      (rawData &&
        typeof rawData === "object" &&
        ("orders" in rawData || "items" in rawData))
    ) {
      const items = rawOrders.map(normalizeInternalOrderItem);
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;

      return {
        items,
        pagination: createPaginationMeta(
          page,
          pageSize,
          totalItems || items.length,
        ),
      };
    }

    if (isDummyDataEnabled()) {
      return getDummyOrderList(params);
    }

    return {
      items: [],
      pagination: createPaginationMeta(1, 10, 0),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getDummyOrderList(params);
    }
    throw error;
  }
};

export const fetchInternalOrderDetailApi = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<InternalOrderItem | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await apiClient.get(
      `/api/internal/interop/orders/${orderId}`,
      { signal },
    );

    const rawData =
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
        ? response.data
        : response;

    if (rawData && (rawData.orderId || rawData.order_id || rawData.id)) {
      return normalizeInternalOrderItem(rawData);
    }

    if (isDummyDataEnabled()) {
      return DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId) ?? null;
    }

    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId) ?? null;
    }
    throw error;
  }
};

export const provisionOrderApi = async (
  payload: ProvisionOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<ProvisionOrderResponse>> => {
  const { orderId } = payload;
  try {
    return await apiClient.post<ApiResponse<ProvisionOrderResponse>>(
      `/api/mitra/orders/${orderId}/provision`,
      {},
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const targetOrder = DUMMY_INTERNAL_ORDERS.find(
        (b) => b.orderId === orderId,
      );
      if (targetOrder) {
        targetOrder.status = "processing";
      }
      return {
        success: true,
        data: {
          orderId,
          transactionStatus: "processing",
          orderStatus: "processing",
        },
        message: "Proses pembuatan layanan WMS berhasil dimulai.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const createOrderProvisionEventSource = (
  orderId: string,
): EventSource => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const endpoint = `/api/mitra/orders/${orderId}/provision/stream`;

  // EventSource does not support custom headers — send auth token as query param
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  const fullUrl = `${baseUrl}${endpoint}${query}`;
  return new EventSource(fullUrl, { withCredentials: true });
};

export const createInternalOrdersEventSource = (): EventSource => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const endpoint = "/api/internal/orders/stream";

  // EventSource does not support custom headers — send auth token as query param
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  const fullUrl = `${baseUrl}${endpoint}${query}`;
  return new EventSource(fullUrl, { withCredentials: true });
};

export const approveOrderApi = async (
  payload: ApproveOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  const { orderId, workspaceInteropUrl } = payload;
  try {
    return await apiClient.put<ApiResponse<void>>(
      `/api/internal/interop/orders/${orderId}/approve`,
      { workspaceInteropUrl },
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const target = DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId);
      if (target) {
        target.status = "paid";
        target.workspaceInteropUrl = workspaceInteropUrl;
        target.paymentVerificationStatus = "approved";
      }
      return {
        success: true,
        data: undefined,
        message: "Pesanan berhasil disetujui.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const approveManualPaymentApi = async (
  orderId: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  try {
    return await apiClient.post<ApiResponse<void>>(
      `/api/internal/orders/${orderId}/approve-payment`,
      {},
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const target = DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId);
      if (target) {
        target.status = "paid";
        target.paymentVerificationStatus = "approved";
      }
      return {
        success: true,
        data: undefined,
        message: "Pembayaran manual berhasil disetujui.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const inputBillingCodeApi = async (
  payload: InputBillingCodePayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  const { orderId, billingCode, billingExpiredAt } = payload;
  try {
    return await apiClient.patch<ApiResponse<void>>(
      `/api/internal/orders/${orderId}/billing-code`,
      { billingCode, billingExpiredAt },
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const target = DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId);
      if (target) {
        target.billingCode = billingCode;
        target.status = "manual_pending_payment";
      }
      return {
        success: true,
        data: undefined,
        message: "Kode billing berhasil diinput.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const rejectOrderApi = async (
  payload: RejectOrderPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  const { orderId, reason } = payload;
  try {
    return await apiClient.put<ApiResponse<void>>(
      `/api/internal/interop/orders/${orderId}/reject`,
      { reason },
      { signal },
    );
  } catch (error) {
    if (isDummyDataEnabled()) {
      const target = DUMMY_INTERNAL_ORDERS.find((b) => b.orderId === orderId);
      if (target) {
        target.status = "rejected";
        target.rejectionReason = reason;
        target.paymentVerificationStatus = "rejected";
      }
      return {
        success: true,
        data: undefined,
        message: "Pesanan berhasil ditolak.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const uploadOrderTteInvoiceApi = async (
  orderId: string,
  file: File,
  signal?: AbortSignal,
): Promise<ApiResponse<{ tteInvoiceUrl: string; tte: boolean }>> => {
  const formData = new FormData();
  formData.append("tteInvoiceFile", file);

  try {
    return await apiClient.post<
      ApiResponse<{ tteInvoiceUrl: string; tte: boolean }>
    >(`/api/internal/interop/orders/${orderId}/tte`, formData, { signal });
  } catch (error) {
    if (isDummyDataEnabled()) {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://volatil-be.exium.web.id";
      const generatedTteUrl = `${baseUrl}/invoices/TTE-${orderId}.pdf`;
      const targetOrder = DUMMY_INTERNAL_ORDERS.find(
        (b) => b.orderId === orderId,
      );
      if (targetOrder) {
        targetOrder.tte = true;
        targetOrder.tteInvoiceUrl = generatedTteUrl;
      }
      return {
        success: true,
        data: {
          tteInvoiceUrl: generatedTteUrl,
          tte: true,
        },
        message: "Tanda Tangan Elektronik (TTE) berhasil dipasang.",
        timestamp: new Date().toISOString(),
      };
    }
    throw error;
  }
};

const getDummyOrderList = (
  params?: InternalOrderListQueryParams,
): InternalOrderListResponse => {
  let filtered = [...DUMMY_INTERNAL_ORDERS];
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((b) => b.status === params.status);
  } else {
    // Default: review permintaan menampilkan status paid, processing, pending_review, dan manual flow
    filtered = filtered.filter(
      (b) =>
        b.status === "paid" ||
        b.status === "processing" ||
        b.status === "pending_review" ||
        b.status === "pending_billing_code" ||
        b.status === "manual_pending_payment" ||
        b.status === "pending_manual_payment_verification",
    );
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.orderId.toLowerCase().includes(q) ||
        (b.orderNumber && b.orderNumber.toLowerCase().includes(q)) ||
        (b.transactionNumber && b.transactionNumber.toLowerCase().includes(q)) ||
        b.mitraName.toLowerCase().includes(q) ||
        b.items.some((it) => it.sourceLayerTitle.toLowerCase().includes(q)),
    );
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const paginatedItems = filtered.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    pagination: createPaginationMeta(page, pageSize, filtered.length),
  };
};
