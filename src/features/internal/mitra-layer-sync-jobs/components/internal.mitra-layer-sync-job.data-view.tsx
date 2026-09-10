// src/features/internal/mitra-layer-sync-jobs/components/internal.mitra-layer-sync-job.data-view.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import {
  MITRA_LAYER_SYNC_JOB_STATUS_MAP,
  MITRA_LAYER_SYNC_JOB_STATUS_OPTIONS,
} from "@/features/internal/mitra-layer-sync-jobs/constants/mitra-layer-sync-job.config";
import {
  useMitraLayerSyncJobsQuery,
  useMitraLayerSyncJobsStream,
} from "@/features/internal/mitra-layer-sync-jobs/hooks/use-mitra-layer-sync-jobs.query";
import type {
  MitraLayerSyncJobItem,
  MitraLayerSyncJobStatus,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { MitraLayerSyncJobStatusBadge } from "@/features/shared/components/mitra-layer-sync-job-status.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { t } from "@/shared/libs/i18n";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { RadioIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const InternalMitraLayerSyncJobDataView = () => {
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

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "ID Job", sortable: true },
      { th: "Layer Target", sortable: true },
      { th: "Status", sortable: true, align: "start" },
      { th: "Progres Sinkronisasi", sortable: true },
      { th: "Dijalankan Oleh", sortable: true },
      { th: "Waktu Dijadwalkan", sortable: true },
      { th: "Waktu Selesai", sortable: true },
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
            value: job.layerTitle,
            td: (
              <VStack align={"start"} gap={"2xs"}>
                <ClampedP fontWeight={"medium"}>{job.layerTitle}</ClampedP>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {job.typeName}
                </P>
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
                    fontWeight={"semibold"}
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
              <P fontSize={"sm"} color={"fg.muted"}>
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
  }, [rawItems, preferredTimezone]);

  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root
        flex={1}
        withContext={true}
        position={"relative"}
        overflowY={"auto"}
      >
        <TopBarLoader isFetching={isFetching} />

        <Container.Body overflowY={"auto"}>
          {/* Title Header */}
          <HeaderContainer>
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack gap={"xs"} align={"center"}>
                <Heading>{"Antrean Pembaruan Layer Mitra"}</Heading>

                <InfoTip
                  variant={"icon"}
                  appIconProps={{
                    size: "xs",
                    color: "fg.subtle",
                  }}
                >
                  {
                    "Memantau antrean tugas latar belakang (antrean job) sinkronisasi layer data mitra saat layer master diperbarui."
                  }
                </InfoTip>
              </HStack>

              <HStack gap={"xs"} align={"center"}>
                <Badge colorPalette={"green"} variant={"subtle"} size={"sm"}>
                  <AppIcon icon={RadioIcon} />
                  {"Sinkronisasi Langsung Aktif"}
                </Badge>
              </HStack>
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Filter Bar */}
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

          <VStack flex={1} w={"full"} position={"relative"} overflowY={"auto"}>
            {isLoading && <Skeleton flex={1} w={"full"} p={"md"} rounded={0} />}

            {!isLoading && (
              <>
                <DataViewTable.Root
                  headers={dataList.headers}
                  items={dataList.items}
                  page={params.page}
                  pageSize={params.pageSize}
                  roundedTop={0}
                >
                  <DataViewTable.Header />
                  <DataViewTable.Body />
                </DataViewTable.Root>

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
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
