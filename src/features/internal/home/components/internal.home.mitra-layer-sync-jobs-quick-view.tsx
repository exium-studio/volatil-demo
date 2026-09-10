// src/features/internal/home/components/internal.home.mitra-layer-sync-jobs-quick-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { MITRA_LAYER_SYNC_JOB_STATUS_MAP } from "@/features/internal/mitra-layer-sync-jobs/constants/mitra-layer-sync-job.config";
import {
  useMitraLayerSyncJobsQuickViewQuery,
  useMitraLayerSyncJobsStream,
} from "@/features/internal/mitra-layer-sync-jobs/hooks/use-mitra-layer-sync-jobs.query";
import type { MitraLayerSyncJobItem } from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { MitraLayerSyncJobStatusBadge } from "@/features/shared/components/mitra-layer-sync-job-status.badge";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { ArrowRightIcon, RadioIcon } from "lucide-react";
import { useMemo } from "react";

export const InternalHomeMitraLayerSyncJobsQuickView = () => {
  // Queries
  const { items, totalCount, isLoading, isFetching } =
    useMitraLayerSyncJobsQuickViewQuery();

  // SSE Stream listener for live updates
  useMitraLayerSyncJobsStream();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const quickList = useMemo(() => items.slice(0, 10), [items]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "ID Job", sortable: false },
      { th: "Layer Target", sortable: false },
      { th: "Status", sortable: false, align: "start" },
      { th: "Progres Sinkronisasi", sortable: false },
      { th: "Dijalankan Oleh", sortable: false },
      { th: "Waktu Dijadwalkan", sortable: false },
      { th: "Waktu Selesai", sortable: false },
    ];

    const formattedItems = quickList.map((job: MitraLayerSyncJobItem) => {
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
              <VStack align={"start"} gap={"2xs"} minW={"200px"}>
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
              <VStack align={"stretch"} gap={"2xs"} minW={"140px"}>
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
      items: formattedItems,
      batchActions,
      itemActions,
    };
  }, [quickList, preferredTimezone]);

  if (isLoading) {
    return <Skeleton h={"260px"} w={"full"} rounded={"md"} />;
  }

  return (
    <Container.Root withContext={true} w={"full"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Body gap={"md"} py={"md"}>
        {/* Header section with live SSE badge and link to full jobs page */}
        <HStack justify={"space-between"} align={"center"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Antrean Pembaruan Layer Mitra"}</Heading>

            <InfoTip
              variant={"icon"}
              appIconProps={{ size: "xs", color: "fg.subtle" }}
            >
              {
                "Menampilkan 10 antrean tugas sinkronisasi layer data mitra terbaru yang berjalan di latar belakang."
              }
            </InfoTip>

            <Badge colorPalette={"blue"} variant={"subtle"} size={"sm"}>
              {`${totalCount} Total Tugas`}
            </Badge>

            <Badge colorPalette={"green"} variant={"subtle"} size={"sm"}>
              <AppIcon icon={RadioIcon} />
              {"Sinkronisasi Langsung Aktif"}
            </Badge>
          </HStack>

          <Button
            asChild={true}
            variant={"ghost"}
            size={"sm"}
            colorPalette={"gray"}
          >
            <NavLink to={"/internal/jobs"}>
              {"Lihat Semua Antrean"}
              <AppIcon icon={ArrowRightIcon} />
            </NavLink>
          </Button>
        </HStack>

        {/* Horizontal scrollable DataViewTable */}
        <VStack align={"stretch"} w={"full"} overflowX={"auto"}>
          <DataViewTable.Root
            headers={dataList.headers}
            items={dataList.items}
            roundedTop={0}
          >
            <DataViewTable.Header />
            <DataViewTable.Body />
          </DataViewTable.Root>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
