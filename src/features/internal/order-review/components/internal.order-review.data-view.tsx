// src/features/internal/order-review/components/internal.order-review.data-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import {
  useInternalOrdersQuery,
  useInternalOrdersStream,
  useOrdersProvisionStream,
  useProvisionOrder,
} from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderItem,
  InternalOrderListQueryParams,
} from "@/features/internal/order-review/types/order-review.type";
import type { CartOrderStatus } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import {
  formatCurrency,
  formatNumber,
} from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircleIcon,
  FileCheckIcon,
  LayersIcon,
  MapPlusIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "paid", label: "Terbayar" },
  { value: "processing", label: "Menyiapkan Layanan WMS" },
  { value: "pending_review", label: "Menunggu Review" },
];

export const InternalOrderReviewDataView = () => {
  // Hooks
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [params, setParams] = useState<InternalOrderListQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: "all",
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const isSearching = Boolean(params.search?.trim() || params.status !== "all");
  const searchQuery = useMemo(() => {
    const parts: string[] = [];
    if (params.search?.trim()) {
      parts.push(params.search.trim());
    }
    if (params.status && params.status !== "all") {
      const opt = ORDER_STATUS_OPTIONS.find((o) => o.value === params.status);
      parts.push(opt?.label ?? params.status);
    }
    return parts.length > 0 ? parts.join(", ") : "...";
  }, [params.search, params.status]);

  // Queries
  const {
    items: orders,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useInternalOrdersQuery(params);

  // Mutations
  const provisionOrderMutation = useProvisionOrder();

  // Derived Values — active processing order IDs for background SSE listening
  const processingOrderIds = useMemo(() => {
    return orders
      .filter((order) => order.status === "processing")
      .map((order) => order.orderId);
  }, [orders]);

  // Background SSE listener for orders currently in 'processing' status
  useOrdersProvisionStream(processingOrderIds);

  // Global SSE listener for incoming new paid/created orders from Mitra
  useInternalOrdersStream();

  // Derived Values - Headers & Items for DataList
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Pesanan", sortable: true, align: "start" },
      { th: "Nama Mitra Pemohon", sortable: true, align: "start" },
      { th: "Metode Pengajuan", sortable: false, align: "start" },
      { th: "Jumlah Layer", sortable: false, align: "start" },
      { th: "Cakupan Bidang", sortable: true },
      { th: "Cakupan Kawasan", sortable: true },
      { th: "Status Pesanan", sortable: true, align: "start" },
      { th: "TTE & Faktur", sortable: false, align: "start" },
      { th: "Total Biaya", sortable: true, align: "end" },
      { th: "Waktu Diajukan", sortable: true, align: "start" },
    ];

    const items = orders.map((order) => {
      const displayOrderNumber = order.orderNumber || order.orderId;

      return {
        id: order.orderId,
        data: order,
        columns: [
          {
            value: displayOrderNumber,
            td: <P fontSize={"sm"}>{displayOrderNumber}</P>,
            align: "start" as const,
          },
          {
            value: order.mitraName,
            td: (
              <VStack align={"start"} gap={0}>
                <P fontSize={"sm"}>{order.mitraName}</P>
                {(order.agencyOrCompany || order.email) && (
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {order.agencyOrCompany || order.email}
                  </P>
                )}
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: order.selectionType,
            td: <SelectionTypeBadge>{order.selectionType}</SelectionTypeBadge>,
            align: "start" as const,
          },
          {
            value: order.items.length,
            td: <P textAlign={"center"}>{`${order.items.length} Layer`}</P>,
          },
          {
            value: order.bidangCoverageCount,
            td: (
              <P>
                {order.bidangCoverageCount ? (
                  <>
                    <TNum>{formatNumber(order.bidangCoverageCount)}</TNum>{" "}
                    {"Bidang"}
                  </>
                ) : (
                  "-"
                )}
              </P>
            ),
          },
          {
            value: order.kawasanCoverageHa,
            td: (
              <P>
                {order.kawasanCoverageHa ? (
                  <>
                    <TNum>
                      {formatNumber(order.kawasanCoverageHa, {
                        maximumFractionDigits: 2,
                      })}
                    </TNum>{" "}
                    {"ha"}
                  </>
                ) : (
                  "-"
                )}
              </P>
            ),
          },
          {
            value: order.status,
            td: (
              <OrderStatusBadge showIcon={true}>
                {order.status}
              </OrderStatusBadge>
            ),
            align: "start" as const,
          },
          {
            value: order.tte ? "TTE" : "Belum TTE",
            td: (
              <TteBadge
                tte={order.tte}
                invoiceUrl={order.invoiceUrl}
                tteInvoiceUrl={order.tteInvoiceUrl}
              />
            ),
            align: "start" as const,
          },
          {
            value: order.totalPrice,
            td: <P fontSize={"sm"}>{formatCurrency(order.totalPrice)}</P>,
            align: "end" as const,
          },
          {
            value: order.createdAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"}>
                {formatUtcDateTime(order.createdAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    const itemActions: DataViewItemActionsGenerator<InternalOrderItem>[] = [
      {
        key: "provision-wms",
        label: "Create Service WMS",
        icon: MapPlusIcon,
        colorPalette: "blue",
        hidden: (order: InternalOrderItem) => order.status !== "paid",
        modal: {
          triggerComponent: (order: InternalOrderItem) => (
            <ConfirmationTrigger
              modalKey={`provision-wms-${order.orderId}`}
              icon={MapPlusIcon}
              colorPalette={"blue"}
              title={"Buat Layanan WMS"}
              description={`Apakah Anda yakin ingin memulai pembuatan layanan WMS untuk pesanan "${order.orderNumber || order.orderId}" (Mitra: ${order.mitraName})? Proses ini akan menyiapkan workspace dan service layer di latar belakang.`}
              confirmLabel={"Buat Layanan WMS"}
              onConfirm={() => {
                provisionOrderMutation.mutate({ orderId: order.orderId });
              }}
            />
          ),
        },
      },
      {
        key: "re-provision-wms",
        label: "Buat Ulang WMS",
        icon: RefreshCwIcon,
        colorPalette: "orange",
        hidden: (order: InternalOrderItem) =>
          order.status !== "processing" && order.status !== "wms_failed",
        modal: {
          triggerComponent: (order: InternalOrderItem) => (
            <ConfirmationTrigger
              modalKey={`re-provision-wms-${order.orderId}`}
              icon={RefreshCwIcon}
              colorPalette={"orange"}
              title={"Buat Ulang Layanan WMS"}
              description={`Apakah Anda yakin ingin membuat ulang layanan WMS untuk pesanan "${order.orderNumber || order.orderId}" (Mitra: ${order.mitraName})? Gunakan aksi ini jika proses pembuatan layanan WMS sebelumnya mengalami kendala atau terhenti.`}
              confirmLabel={"Buat Ulang Layanan WMS"}
              onConfirm={() => {
                provisionOrderMutation.mutate({ orderId: order.orderId });
              }}
            />
          ),
        },
      },
      {
        key: "open-detail-order",
        label: "Buka detail IGT",
        icon: LayersIcon,
        hidden: (order: InternalOrderItem) => order.status !== "pending_review",
        onClick: (order: InternalOrderItem) => {
          void navigate({
            to: "/internal/order-review/$orderId",
            params: { orderId: order.orderId },
          });
        },
      },
      {
        key: "view-invoice",
        label: "Lihat Faktur",
        icon: ReceiptTextIcon,
        href: (order: InternalOrderItem) => order.invoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (order: InternalOrderItem) => !order.invoiceUrl,
      },
      {
        key: "view-tte-invoice",
        label: "Lihat Faktur TTE",
        icon: FileCheckIcon,
        href: (order: InternalOrderItem) => order.tteInvoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (order: InternalOrderItem) => !order.tteInvoiceUrl,
      },
      {
        key: "approve-order",
        label: "Setujui Permintaan",
        icon: CheckCircleIcon,
        colorPalette: "green",
        hidden: (order: InternalOrderItem) => order.status !== "pending_review",
        modal: {
          triggerComponent: (order: InternalOrderItem) => (
            <InternalOrderReviewApproveTrigger
              modalKey={`approve-order-${order.orderId}`}
              order={order}
            />
          ),
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [orders, preferredTimezone, navigate, provisionOrderMutation]);

  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <Container.Body flex={1} minH={0} overflow={"clip"}>
        {/* Header Container */}
        <HeaderContainer>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Review Permintaan Data IGT"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Validasi dan verifikasi permintaan data spasial mitra yang telah lunas bayar sebelum menerbitkan wrapper link GeoServer."
              }
            </InfoTip>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Filter Controls */}
        <ActionHeaderScrollContainer>
          <SearchInput
            value={params.search}
            onValueChange={(val) => {
              setParams((prev) => ({ ...prev, search: val, page: 1 }));
            }}
            placeholder={"Cari ID Pesanan / Nama Mitra..."}
            maxW={"300px"}
          />

          <HStack gap={"sm"}>
            <StatusFilterSelect
              modalKey={"internal-order-review-status-filter"}
              placeholder={"Status Permintaan"}
              options={ORDER_STATUS_OPTIONS}
              value={params.status ?? "all"}
              onValueChange={(value) => {
                startTransition(() => {
                  setParams((prev) => ({
                    ...prev,
                    status: value as CartOrderStatus | "all",
                    page: 1,
                  }));
                });
              }}
              minW={"150px"}
            />
          </HStack>
        </ActionHeaderScrollContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Table / Content */}
        <VStack
          flex={1}
          minH={0}
          bg={"bg.canvas"}
          w={"full"}
          position={"relative"}
        >
          {isLoading ? (
            <Skeleton p={"md"} rounded={0} />
          ) : isError ? (
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              <StateRetry
                title={"Gagal Memuat Antrean Review"}
                description={
                  error?.message ||
                  "Terjadi kesalahan saat memuat antrean review pesanan. Silakan coba lagi."
                }
                onRetry={() => {
                  void refetch();
                }}
              />
            </Center>
          ) : isEmptyArray(orders) ? (
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              {isSearching ? (
                <StateNoResult
                  query={searchQuery}
                  description={
                    "Tidak ada pesanan permintaan yang sesuai dengan filter atau kata kunci pencarian Anda."
                  }
                />
              ) : (
                <StateNoData
                  icon={CheckCircleIcon}
                  title={"Tidak Ada Antrean Review"}
                  description={
                    "Semua pesanan permintaan data spasial telah diproses dan disetujui."
                  }
                />
              )}
            </Center>
          ) : (
            <VStack
              flex={1}
              minH={0}
              overflow={"hidden"}
              position={"relative"}
              w={"full"}
            >
              <TopBarLoader isFetching={isFetching} />

              <DataViewTable.Root<InternalOrderItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                withNumbering={true}
                virtualized={false}
                page={params.page}
                pageSize={params.pageSize}
                rounded={0}
                pb={0}
              >
                <DataViewTable.Header />
                <DataViewTable.Body />
              </DataViewTable.Root>

              <Separator borderColor={"bg.canvas"} flexShrink={0} />

              <DataViewFooter
                flexShrink={0}
                page={params.page ?? 1}
                pageSize={params.pageSize ?? 1}
                setPage={(nextPage: number) =>
                  setParams((prev) => ({ ...prev, page: nextPage }))
                }
                setPageSize={(nextSize: number) => {
                  setParams((prev) => ({
                    ...prev,
                    pageSize: nextSize,
                    page: 1,
                  }));
                }}
                currentDataLength={orders.length}
                totalData={pagination?.totalItems ?? orders.length}
                totalPage={pagination?.totalPages ?? 1}
              />
            </VStack>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
