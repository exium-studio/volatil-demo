// src/features/internal/order-review/components/internal.order-review.data-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import {
  useInternalOrdersQuery,
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
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  LayersIcon,
  MapPlusIcon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status (Paid & Review)" },
  { value: "paid", label: "Terbayar (Perlu Create WMS)" },
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
  } = useInternalOrdersQuery(params);

  // Mutations
  const provisionMutation = useProvisionOrder();

  // Derived Values - Headers & Items for DataList
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "ID Pesanan", sortable: true, align: "start" },
      { th: "Nama Mitra Pemohon", sortable: true, align: "start" },
      { th: "Metode Pengajuan", sortable: false, align: "start" },
      { th: "Daftar Layer IGT", sortable: false, align: "start" },
      { th: "Status", sortable: true, align: "start" },
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

      const layerNames = order.items
        .map((it) => it.sourceLayerTitle)
        .join(", ");

      return {
        id: order.orderId,
        data: order,
        columns: [
          {
            value: order.orderId,
            td: (
              <HStack gap={"xs"} align={"center"}>
                <P fontWeight={"semibold"}>{order.orderId}</P>
                <ClipboardButton
                  value={order.orderId}
                  variant={"ghost"}
                  size={"2xs"}
                  aria-label={"Salin ID Pesanan"}
                />
              </HStack>
            ),
            align: "start" as const,
          },
          {
            value: order.mitraName,
            td: (
              <VStack align={"start"} gap={0}>
                <P fontWeight={"medium"}>{order.mitraName}</P>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {`ID: ${order.mitraId}`}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: order.selectionType,
            td: (
              <SelectionTypeBadge size={"xs"}>
                {order.selectionType}
              </SelectionTypeBadge>
            ),
            align: "start" as const,
          },
          {
            value: layerNames,
            td: (
              <VStack align={"start"} maxW={"220px"} gap={0}>
                <ClampedP title={layerNames}>{layerNames}</ClampedP>
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
            td: <OrderStatusBadge showIcon>{order.status}</OrderStatusBadge>,
            align: "start" as const,
          },
          {
            value: order.totalPrice,
            td: (
              <P fontWeight={"semibold"} color={"blue.fg"}>
                {formatCurrency(order.totalPrice)}
              </P>
            ),
            align: "end" as const,
          },
          {
            value: order.createdAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
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
          provisionMutation.mutate({
            orderId: order.orderId,
          });
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
        label: "Setujui Permohonan",
        icon: CheckCircle2Icon,
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
  }, [orders, preferredTimezone, navigate, provisionMutation]);

  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
        {/* Header Container */}
        <HeaderContainer>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Review Permohonan Data IGT"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Validasi dan verifikasi permohonan data spasial mitra yang telah lunas bayar sebelum menerbitkan wrapper link GeoServer."
              }
            </InfoTip>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Filter Controls */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={"sm"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <SearchInput
            value={params.search}
            onValueChange={(val) => {
              setParams((prev) => ({ ...prev, search: val, page: 1 }));
            }}
            placeholder={"Cari ID Pesanan / Nama Mitra..."}
            maxW={"300px"}
          />

          <HStack wrap={"wrap"} gap={"sm"}>
            <StatusFilterSelect
              modalKey={"internal-order-review-status-filter"}
              placeholder={"Status Permohonan"}
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
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table / Content */}
        <VStack
          flex={1}
          gap={"sm"}
          overflowY={"auto"}
          bg={"bg.canvas"}
          w={"full"}
          position={"relative"}
        >
          {isLoading ? (
            <Skeleton p={"md"} rounded={0} />
          ) : isEmptyArray(orders) ? (
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              {params.search || params.status !== "all" ? (
                <NoResultState
                  description={
                    "Tidak ada pesanan permohonan yang sesuai dengan filter atau kata kunci pencarian Anda."
                  }
                />
              ) : (
                <NoDataState
                  icon={CheckCircleIcon}
                  title={"Tidak Ada Antrean Review"}
                  description={
                    "Semua pesanan permohonan data spasial telah diproses dan disetujui."
                  }
                />
              )}
            </Center>
          ) : (
            <Box w={"full"} position={"relative"} overflowY={"auto"}>
              <DataView.Table.Root<InternalOrderItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                withNumbering={true}
                page={params.page}
                pageSize={params.pageSize}
                rounded={0}
                pb={0}
              >
                <DataView.Table.Header />
                <DataView.Table.Body />
              </DataView.Table.Root>

              <TopBarLoader isFetching={isFetching} />

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
                roundedBottom={0}
              />
            </Box>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
