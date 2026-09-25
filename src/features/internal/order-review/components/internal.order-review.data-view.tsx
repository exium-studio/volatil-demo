// src/features/internal/order-review/components/internal.order-review.data-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
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
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircleIcon, LayersIcon, MapPlusIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status (Paid, Proses & Review)" },
  { value: "paid", label: "Terbayar (Perlu Create WMS)" },
  { value: "processing", label: "Menyiapkan Layanan WMS" },
  { value: "pending_review", label: "Menunggu Review (WMS Siap)" },
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
      { th: "ID Pesanan", sortable: true, align: "start" },
      { th: "Nama Mitra Pemohon", sortable: true, align: "start" },
      { th: "Metode Pengajuan", sortable: false, align: "start" },
      { th: "Daftar Layer IGT", sortable: false, align: "start" },
      { th: "Status Pesanan", sortable: true, align: "start" },
      { th: "Total Biaya", sortable: true, align: "end" },
      { th: "Waktu Diajukan", sortable: true, align: "start" },
    ];

    const items = orders.map((order) => {
      const totalBidang = order.items
        .filter((i) => i.spatialBasis === "bidang")
        .reduce((sum, item) => sum + item.featuresCount, 0);

      const totalKawasanHa = order.items
        .filter((i) => i.spatialBasis === "kawasan")
        .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);

      return {
        id: order.orderId,
        data: order,
        columns: [
          {
            value: order.orderId,
            td: (
              <P fontWeight={"medium"} fontSize={"sm"}>
                {order.orderId}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: order.mitraName,
            td: (
              <VStack align={"start"} gap={0}>
                <P fontWeight={"medium"} fontSize={"sm"}>
                  {order.mitraName}
                </P>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {order.mitraId}
                </P>
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
            td: (
              <VStack align={"start"} gap={0}>
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {order.items.map((i) => i.sourceLayerTitle).join(", ")}
                </P>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {`${order.items.length} layer • `}
                  {totalBidang > 0 && `${totalBidang} bidang`}
                  {totalBidang > 0 && totalKawasanHa > 0 && " • "}
                  {totalKawasanHa > 0 && `${totalKawasanHa} ha`}
                </P>
              </VStack>
            ),
            align: "start" as const,
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
            value: order.totalPrice,
            td: (
              <P fontWeight={"medium"} fontSize={"sm"}>
                {formatCurrency(order.totalPrice)}
              </P>
            ),
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
        hidden: (order: InternalOrderItem) => order.status !== "paid",
        onClick: (order: InternalOrderItem) => {
          provisionOrderMutation.mutate({ orderId: order.orderId });
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
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
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
              w={"240px"}
            />
          </HStack>
        </ActionHeaderScrollContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Table / Content */}
        <VStack
          flex={1}
          bg={"bg.canvas"}
          w={"full"}
          position={"relative"}
        >
          {isLoading ? (
            <Skeleton p={"md"} rounded={0} />
          ) : isError ? (
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              <RetryState
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
              {params.search || params.status !== "all" ? (
                <NoResultState
                  description={
                    "Tidak ada pesanan permintaan yang sesuai dengan filter atau kata kunci pencarian Anda."
                  }
                />
              ) : (
                <NoDataState
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
              position={"relative"}
              w={"full"}
            >
              <TopBarLoader isFetching={isFetching} />

              <DataViewTable.Root<InternalOrderItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                withNumbering={true}
                page={params.page}
                pageSize={params.pageSize}
                rounded={0}
                pb={0}
              >
                <DataViewTable.Header />
                <DataViewTable.Body />
              </DataViewTable.Root>


              <Separator borderColor={"bg.canvas"} />

              <DataViewFooter
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
