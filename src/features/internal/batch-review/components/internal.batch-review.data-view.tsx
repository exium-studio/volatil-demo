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
import { InternalBatchReviewApproveTrigger } from "@/features/internal/batch-review/components/internal.batch-review.approve-modal";
import {
  useInternalBatchesQuery,
  useProvisionOrder,
} from "@/features/internal/batch-review/hooks/use-batch-review";
import type {
  InternalBatchItem,
  InternalBatchListQueryParams,
} from "@/features/internal/batch-review/types/batch-review.type";
import type { CartBatchStatus } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { BatchStatusBadge } from "@/features/shared/components/batch-status.badge";
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
  InboxIcon,
  LayersIcon,
  MapPlusIcon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const BATCH_STATUS_OPTIONS = [
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
  const [params, setParams] = useState<InternalBatchListQueryParams>({
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
  } = useInternalBatchesQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    status: params.status as CartBatchStatus | "all",
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
      { th: "Pemohon & ID Batch", sortable: true },
      { th: "Metode", sortable: true },
      { th: "Status", sortable: true },
      { th: "WMS URL (Volatil)", sortable: false },
      { th: "Jumlah Layer", sortable: true, align: "center" },
      { th: "Total Estimasi PNBP", sortable: true, align: "end" },
      { th: "Waktu Pengajuan", sortable: true },
    ];

    const items = rawItems.map((batch) => {
      const firstItem = batch.items?.[0];
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
        id: batch.batchId,
        data: batch,
        columns: [
          {
            value: batch.batchId,
            td: (
              <VStack align={"start"} gap={0} w={"200px"}>
                <ClampedP fontWeight={"medium"}>{batch.mitraName}</ClampedP>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {batch.batchId}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: batch.selectionType,
            td: (
              <SelectionTypeBadge size={"xs"}>
                {batch.selectionType}
              </SelectionTypeBadge>
            ),
            align: "start" as const,
          },
          {
            value: batch.status,
            td: <BatchStatusBadge showIcon>{batch.status}</BatchStatusBadge>,
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
            value: batch.items?.length ?? 0,
            td: (
              <P textAlign={"center"}>{`${batch.items?.length ?? 0} Layer`}</P>
            ),
            align: "center" as const,
          },
          {
            value: batch.totalPrice ?? 0,
            td: (
              <P fontWeight={"semibold"} color={"green.600"}>
                {formatCurrency(batch.totalPrice ?? 0)}
              </P>
            ),
            align: "end" as const,
          },
          {
            value: batch.createdAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(batch.createdAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    const itemActions: DataViewItemActionsGenerator<InternalBatchItem>[] = [
      {
        key: "provision-wms",
        label: "Create Service WMS",
        icon: MapPlusIcon,
        hidden: (batch: InternalBatchItem) => batch.status !== "paid",
        onClick: (batch: InternalBatchItem) => {
          provisionMutation.mutate({
            batchId: batch.batchId,
          });
        },
      },
      {
        key: "open-detail-batch",
        label: "Buka detail IGT",
        icon: LayersIcon,
        hidden: (batch: InternalBatchItem) => batch.status !== "pending_review",
        onClick: (batch: InternalBatchItem) => {
          void navigate({
            to: "/internal/batch-review/$batchId",
            params: { batchId: batch.batchId },
          });
        },
      },
      {
        key: "approve-batch",
        label: "Setujui Permohonan",
        icon: CheckCircle2Icon,
        colorPalette: "green",
        hidden: (batch: InternalBatchItem) => batch.status !== "pending_review",
        modal: {
          triggerComponent: (batch: InternalBatchItem) => (
            <InternalBatchReviewApproveTrigger
              modalKey={`approve-batch-${batch.batchId}`}
              batch={batch}
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
                  "Verifikasi dan berikan validasi persetujuan terhadap permohonan data spasial yang telah dibayar dan disiapkan oleh Interop Engine."
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
            placeholder={"Cari ID batch, nama pemohon..."}
            maxW={"280px"}
          />

          <StatusFilterSelect
            modalKey={"batch-review-status-filter"}
            options={BATCH_STATUS_OPTIONS}
            placeholder={"Semua Status"}
            value={params.status}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: val as CartBatchStatus | "all",
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
                      icon={InboxIcon}
                      title={"Tidak Ada Permohonan Batch"}
                      description={
                        "Saat ini belum ada batch permohonan data yang perlu direview."
                      }
                    />
                  )}
                </Center>
              )}

              {!isEmptyArray(rawItems) && (
                <Box w={"full"} position={"relative"}>
                  <TopBarLoader isFetching={isFetching} />

                  <DataView.Table.Root<InternalBatchItem>
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
