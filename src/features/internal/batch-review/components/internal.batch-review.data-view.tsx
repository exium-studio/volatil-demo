import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
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
import { InternalBatchReviewDetailTrigger } from "@/features/internal/batch-review/components/internal.batch-review.detail-modal";
import { InternalBatchReviewRejectTrigger } from "@/features/internal/batch-review/components/internal.batch-review.reject-modal";
import {
  useApproveBatch,
  useInternalBatchesQuery,
} from "@/features/internal/batch-review/hooks/use-batch-review";
import type {
  InternalBatchItem,
  InternalBatchListQueryParams,
} from "@/features/internal/batch-review/types/batch-review.type";
import type { CartBatchStatus } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { BatchStatusBadge } from "@/features/shared/components/batch-status.badge";
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
  EyeIcon,
  InboxIcon,
  LayersIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const BATCH_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending_review", label: "Menunggu Review" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
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
  const approveMutation = useApproveBatch();

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
      { th: "ID Batch & Pemohon", sortable: true },
      { th: "Status", sortable: true },
      { th: "Jumlah Layer", sortable: true, align: "center" },
      { th: "Total Estimasi PNBP", sortable: true, align: "end" },
      { th: "Waktu Pengajuan", sortable: true },
    ];

    const items = rawItems.map((batch) => {
      return {
        id: batch.batchId,
        data: batch,
        columns: [
          {
            value: batch.batchId,
            td: (
              <VStack align={"start"} gap={0} w={"220px"}>
                <ClampedP fontWeight={"medium"}>{batch.mitraName}</ClampedP>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {batch.batchId}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: batch.status,
            td: <BatchStatusBadge>{batch.status}</BatchStatusBadge>,
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
        key: "open-detail-batch",
        label: "Buka detail IGT",
        icon: LayersIcon,
        sticky: true,
        showInMenu: true,
        onClick: (batch: InternalBatchItem) => {
          void navigate({
            to: "/internal/batch-review/$batchId",
            params: { batchId: batch.batchId },
          });
        },
      },
      {
        key: "detail-batch",
        label: "Lihat Detail (Modal)",
        icon: EyeIcon,
        modal: {
          triggerComponent: (batch: InternalBatchItem) => (
            <InternalBatchReviewDetailTrigger
              modalKey={`detail-batch-${batch.batchId}`}
              batch={batch}
            />
          ),
        },
      },
      {
        key: "approve-batch",
        label: "Setujui Batch",
        icon: CheckCircle2Icon,
        colorPalette: "green",
        hidden: (batch: InternalBatchItem) => batch.status !== "pending_review",
        modal: {
          triggerComponent: (batch: InternalBatchItem) => (
            <ConfirmationTrigger
              modalKey={`approve-batch-${batch.batchId}`}
              title={"Setujui Permohonan Batch?"}
              description={`Apakah Anda yakin ingin menyetujui batch permohonan data "${batch.batchId}" milik ${batch.mitraName}?`}
              confirmLabel={"Setujui Batch"}
              colorPalette={"green"}
              onConfirm={() => {
                approveMutation.mutate({ batchId: batch.batchId });
              }}
            />
          ),
        },
      },
      {
        key: "reject-batch",
        label: "Tolak Batch",
        icon: XCircleIcon,
        colorPalette: "red",
        hidden: (batch: InternalBatchItem) => batch.status !== "pending_review",
        modal: {
          triggerComponent: (batch: InternalBatchItem) => (
            <InternalBatchReviewRejectTrigger
              modalKey={`reject-batch-${batch.batchId}`}
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
  }, [rawItems, preferredTimezone, approveMutation, navigate]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={"xs"} align={"center"}>
              <Heading>{"Review Batch Interop"}</Heading>

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
