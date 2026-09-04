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
import { InternalOrderReviewApproveTrigger } from "@/features/internal/batch-review/components/internal.batch-review.approve-modal";
import {
  useInternalOrdersQuery,
  useProvisionOrder,
} from "@/features/internal/batch-review/hooks/use-batch-review";
import type {
  InternalOrderItem,
  InternalOrderListQueryParams,
} from "@/features/internal/batch-review/types/order-review.type";
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

export const InternalBatchReviewDataView = () => {
  // Hooks
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<InternalOrderListQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: "all",
  });

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useInternalOrdersQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    status: params.status as CartOrderStatus | "all",
  });

  // Mutations
  const provisionMutation = useProvisionOrder();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const isSearching = Boolean(params.search?.trim() || params.status !== "all");
  const searchQuery = useMemo(() => {
    if (params.search?.trim()) return params.search;
    if (params.status !== "all") return params.status ?? "...";
    return "...";
  }, [params.search, params.status]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Pemohon & ID Pesanan", sortable: true },
      { th: "Metode", sortable: true },
      { th: "Status", sortable: true },
      { th: "WMS URL (Volatil)", sortable: false },
      { th: "Jumlah Layer", sortable: true, align: "center" },
      { th: "Total Estimasi PNBP", sortable: true, align: "end" },
      { th: "Waktu Pengajuan", sortable: true },
    ];

    const items = rawItems.map((order) => {
      const firstItem = order.items?.[0];
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
      const rawWmsUrl =
        firstItem?.previewWmsUrl ||
        firstItem?.wmsUrl ||
        (firstItem?.sourceLayerId
          ? `/api/proxy/wms?layerId=${firstItem.sourceLayerId}`
          : "");
      const previewWmsUrl = rawWmsUrl
        ? rawWmsUrl.startsWith("http")
          ? rawWmsUrl
          : `${apiBaseUrl}${rawWmsUrl}`
        : "";

      return {
        id: order.orderId,
        data: order,
        columns: [
          {
            value: order.orderId,
            td: (
              <VStack align={"start"} gap={0} w={"200px"}>
                <ClampedP fontWeight={"medium"}>{order.mitraName}</ClampedP>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {order.orderId}
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
            value: order.status,
            td: <OrderStatusBadge showIcon>{order.status}</OrderStatusBadge>,
          },
          {
            value: previewWmsUrl,
            td: previewWmsUrl ? (
              <HStack gap={"xs"} align={"center"} maxW={"220px"}>
                <ClampedP
                  fontSize={"xs"}
                  fontFamily={"mono"}
                  color={"fg.muted"}
                  truncate
                >
                  {previewWmsUrl}
                </ClampedP>

                <ClipboardButton
                  value={previewWmsUrl}
                  variant={"ghost"}
                  size={"xs"}
                  aria-label={"Salin WMS URL"}
                />
              </HStack>
            ) : (
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"-"}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: order.items?.length ?? 0,
            td: (
              <P textAlign={"center"}>{`${order.items?.length ?? 0} Layer`}</P>
            ),
            align: "center" as const,
          },
          {
            value: order.totalPrice ?? 0,
            td: (
              <P fontWeight={"semibold"} color={"green.600"}>
                {formatCurrency(order.totalPrice ?? 0)}
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
            to: "/internal/batch-review/$batchId",
            params: { batchId: order.orderId },
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
  }, [rawItems, preferredTimezone, navigate, provisionMutation]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={"xs"} align={"center"}>
              <Heading>{"Review Permohonan"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{
                  size: "xs",
                  color: "fg.subtle",
                }}
              >
                {
                  "Verifikasi dan berikan validasi persetujuan terhadap pesanan permohonan data spasial yang telah dibayar dan disiapkan oleh sistem."
                }
              </InfoTip>
            </HStack>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"start"}
          gap={"sm"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <SearchInput
            value={params.search}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({ ...prev, search: val, page: 1 }));
              })
            }
            placeholder={"Cari ID pesanan, nama pemohon..."}
            maxW={"280px"}
          />

          <StatusFilterSelect
            modalKey={"order-review-status-filter"}
            options={ORDER_STATUS_OPTIONS}
            placeholder={"Semua Status"}
            value={params.status}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: val as CartOrderStatus | "all",
                  page: 1,
                }));
              })
            }
            w={"180px"}
          />
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        <VStack flex={1} gap={"sm"} w={"full"} position={"relative"}>
          {isLoading && <Skeleton p={"md"} rounded={0} />}

          {!isLoading && (
            <>
              {isEmptyArray(rawItems) && (
                <Center flex={1} w={"full"} p={"xl"} bg={"bg.body"}>
                  {isSearching ? (
                    <NoResultState query={searchQuery} />
                  ) : (
                    <NoDataState
                      icon={CheckCircleIcon}
                      title={"Tidak Ada Permohonan Pesanan"}
                      description={
                        "Saat ini belum ada pesanan permohonan data yang perlu direview."
                      }
                    />
                  )}
                </Center>
              )}

              {!isEmptyArray(rawItems) && (
                <Box w={"full"} position={"relative"}>
                  <TopBarLoader isFetching={isFetching} />

                  <DataView.Table.Root<InternalOrderItem>
                    headers={dataList.headers}
                    items={dataList.items}
                    itemActions={dataList.itemActions}
                    withNumbering
                    page={params.page}
                    pageSize={params.pageSize}
                    pb={0}
                    rounded={0}
                  >
                    <DataView.Table.Header />
                    <DataView.Table.Body />
                  </DataView.Table.Root>

                  <Separator borderColor={"bg.canvas"} />

                  <DataViewFooter
                    page={params.page ?? 1}
                    pageSize={params.pageSize ?? DEFAULT_PAGE_SIZE_OPTIONS[0]}
                    setPage={(nextPage: number) =>
                      setParams((prev) => ({ ...prev, page: nextPage }))
                    }
                    setPageSize={(nextSize: number) =>
                      setParams((prev) => ({
                        ...prev,
                        pageSize: nextSize,
                        page: 1,
                      }))
                    }
                    currentDataLength={rawItems.length}
                    totalData={pagination?.totalItems ?? rawItems.length}
                    totalPage={pagination?.totalPages ?? 1}
                  />
                </Box>
              )}
            </>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
