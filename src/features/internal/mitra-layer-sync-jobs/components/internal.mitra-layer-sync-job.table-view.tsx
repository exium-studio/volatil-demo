// src/features/internal/mitra-layer-sync-jobs/components/internal.mitra-layer-sync-job.table-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import {
  MITRA_LAYER_SYNC_JOB_STATUS_MAP,
  MITRA_LAYER_SYNC_JOB_STATUS_OPTIONS,
} from "@/features/internal/mitra-layer-sync-jobs/constants/mitra-layer-sync-job.config";
import {
  useMitraLayerSyncJobsQuery,
  useMitraLayerSyncJobsStream,
} from "@/features/internal/mitra-layer-sync-jobs/hooks/use-mitra-layer-sync-jobs.query";
import type {
  MitraLayerSyncJobDataViewProps,
  MitraLayerSyncJobItem,
  MitraLayerSyncJobStatus,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { MitraLayerSyncJobStatusBadge } from "@/features/shared/components/mitra-layer-sync-job-status.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useMemo, useState, useTransition } from "react";

export const InternalMitraLayerSyncJobTableView = (
  props: MitraLayerSyncJobDataViewProps,
) => {
  // Props
  const {
    initialLimit = DEFAULT_PAGE_SIZE_OPTIONS[0],
    showPagination = true,
    showFilters = true,
    roundedTop = 0,
  } = props;

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<{
    page: number;
    pageSize: number;
    search: string;
    status: string;
  }>({
    page: 1,
    pageSize: initialLimit,
    search: "",
    status: "all",
  });

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMitraLayerSyncJobsQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    status:
      params.status !== "all"
        ? (params.status as MitraLayerSyncJobStatus)
        : undefined,
  });

  // Real-time SSE Stream listener for job updates
  useMitraLayerSyncJobsStream();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const total = pagination?.totalItems ?? rawItems.length;
  const totalPages = pagination?.totalPages ?? 1;

  const isSearching = Boolean(params.search?.trim() || params.status !== "all");
  const searchQuery = useMemo(() => {
    const parts: string[] = [];
    if (params.search?.trim()) {
      parts.push(params.search.trim());
    }
    if (params.status && params.status !== "all") {
      const statusConfig =
        MITRA_LAYER_SYNC_JOB_STATUS_MAP[
          params.status as MitraLayerSyncJobStatus
        ];
      parts.push(statusConfig?.label ?? params.status);
    }
    return parts.length > 0 ? parts.join(", ") : "...";
  }, [params.search, params.status]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "ID Job", sortable: showPagination },
      { th: "Order & Mitra", sortable: showPagination },
      { th: "Pembaruan", sortable: showPagination },
      { th: "Status", sortable: showPagination, align: "start" },
      { th: "Progres Layer", sortable: showPagination },
      { th: "Dijalankan Oleh", sortable: showPagination },
      { th: "Waktu Dijadwalkan", sortable: showPagination },
      { th: "Waktu Selesai", sortable: showPagination },
    ];

    const items = rawItems.map((job: MitraLayerSyncJobItem) => {
      const statusConfig = MITRA_LAYER_SYNC_JOB_STATUS_MAP[job.status];

      return {
        id: job.id,
        data: job,
        columns: [
          {
            value: job.id,
            td: (
              <P fontSize={"xs"} fontFamily={"mono"} color={"fg.subtle"}>
                {job.id}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: job.orderNumber || job.layerTitle || job.id,
            td: (
              <VStack align={"start"} gap={"2xs"} minW={"180px"}>
                <ClampedP fontWeight={"medium"}>
                  {job.orderNumber || job.orderId || "-"}
                </ClampedP>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {job.mitraName || "Mitra"}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: job.milestoneIndex ?? 0,
            td: (
              <VStack align={"start"} gap={"2xs"} minW={"120px"}>
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {job.milestoneIndex ? (
                    <TNum>{job.milestoneIndex}</TNum>
                  ) : (
                    "-"
                  )}
                </P>
                {job.layerTitle && (
                  <ClampedP fontSize={"2xs"} color={"fg.subtle"}>
                    {job.layerTitle}
                  </ClampedP>
                )}
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: statusConfig.label,
            td: (
              <MitraLayerSyncJobStatusBadge showIcon={true}>
                {job.status}
              </MitraLayerSyncJobStatusBadge>
            ),
            align: "start" as const,
          },
          {
            value: `${job.progress}%`,
            td: (
              <VStack gap={"2xs"} w={"150px"}>
                <HStack justify={"space-between"} align={"center"} w={"full"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {`${job.processedMitraLayers} / ${job.totalMitraLayers} layer`}
                  </P>

                  <P
                    fontSize={"xs"}
                    textAlign={"end"}
                    fontVariantNumeric={"tabular-nums"}
                  >
                    {`${job.progress}%`}
                  </P>
                </HStack>
                {job.errorMessage && (
                  <ClampedP fontSize={"2xs"} color={"fg.error"}>
                    {job.errorMessage}
                  </ClampedP>
                )}
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: job.triggeredByUserName,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {job.triggeredByUserName}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: job.createdAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(job.createdAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: job.completedAt ?? "-",
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {job.completedAt
                  ? formatUtcDateTime(job.completedAt, preferredTimezone)
                  : "-"}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    const batchActions: unknown[] = [];
    const itemActions: unknown[] = [];

    return {
      headers,
      items,
      batchActions,
      itemActions,
    };
  }, [rawItems, preferredTimezone, showPagination]);

  if (isLoading) {
    return <Skeleton flex={1} minH={"260px"} w={"full"} p={"md"} rounded={0} />;
  }

  return (
    <VStack flex={1} w={"full"} position={"relative"} align={"stretch"}>
      <TopBarLoader isFetching={isFetching} />

      {showFilters && (
        <>
          <ActionHeaderScrollContainer>
            <SearchInput
              placeholder={t["action.search"]()}
              value={params.search}
              onValueChange={(val) =>
                startTransition(() => {
                  setParams((prev) => ({ ...prev, search: val, page: 1 }));
                })
              }
              maxW={"260px"}
            />

            <StatusFilterSelect
              modalKey={"mitra-layer-sync-jobs-status-filter"}
              value={params.status}
              options={MITRA_LAYER_SYNC_JOB_STATUS_OPTIONS}
              onValueChange={(val) =>
                startTransition(() => {
                  setParams((prev) => ({
                    ...prev,
                    status: val,
                    page: 1,
                  }));
                })
              }
              w={"180px"}
            />
          </ActionHeaderScrollContainer>

          <Separator borderColor={"bg.canvas"} />
        </>
      )}

      {/* Horizontal scrollable DataViewTable */}
      <VStack
        flex={1}
        w={"full"}
        position={"relative"}
        overflowX={"auto"}
        align={"stretch"}
      >
        {isLoading && <Skeleton p={"md"} rounded={0} />}

        {!isLoading && isError && (
          <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
            <StateRetry
              title={"Gagal Memuat Riwayat Sinkronisasi"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat daftar tugas sinkronisasi layer. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Center>
        )}

        {!isLoading && !isError && (
          <>
            {isEmptyArray(rawItems) && (
              <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
                {isSearching ? (
                  <StateNoResult
                    query={searchQuery}
                    description={
                      "Tidak ada tugas sinkronisasi yang sesuai dengan filter atau kata kunci pencarian Anda."
                    }
                  />
                ) : (
                  <StateNoData
                    title={"Belum Ada Tugas Sinkronisasi"}
                    description={
                      "Belum ada riwayat tugas sinkronisasi layer IGT ke geoserver mitra."
                    }
                  />
                )}
              </Center>
            )}

            {!isEmptyArray(rawItems) && (
              <>
                <TopBarLoader isFetching={isFetching} />

                <DataViewTable.Root
                  headers={dataList.headers}
                  items={dataList.items}
                  page={showPagination ? params.page : undefined}
                  pageSize={showPagination ? params.pageSize : undefined}
                  roundedTop={roundedTop}
                >
                  <DataViewTable.Header />
                  <DataViewTable.Body />
                </DataViewTable.Root>

                {showPagination && (
                  <>
                    <Separator borderColor={"bg.canvas"} />

                    <DataViewFooter
                      page={params.page}
                      pageSize={params.pageSize}
                      setPage={(newPage: number) =>
                        setParams((prev) => ({ ...prev, page: newPage }))
                      }
                      setPageSize={(newSize: number) => {
                        setParams((prev) => ({
                          ...prev,
                          pageSize: newSize,
                          page: 1,
                        }));
                      }}
                      currentDataLength={rawItems.length}
                      totalData={total}
                      totalPage={totalPages}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </VStack>
    </VStack>
  );
};
