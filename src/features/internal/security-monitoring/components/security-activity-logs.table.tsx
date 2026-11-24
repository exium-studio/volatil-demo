// src/features/internal/security-monitoring/components/security-activity-logs.table.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useSecurityLogsQuery } from "@/features/internal/security-monitoring/hooks/use-security-monitoring.query";
import type {
  MapServiceActivityLogItem,
  SecurityLogQueryParams,
} from "@/features/internal/security-monitoring/types/security-monitoring.type";
import { formatUtcDateTime } from "@/shared/utils/formatter/date.formatter";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

export const SecurityActivityLogsTable = () => {
  // States
  const [params, setParams] = useState<SecurityLogQueryParams>({
    page: 1,
    limit: 15,
  });

  // Queries
  const { data, isLoading } = useSecurityLogsQuery(params);

  // Handlers
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSearchLayer = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setParams((prev) => ({ ...prev, layerName: val, page: 1 }));
  };

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  // Derived Values - DataList Pattern (1 useMemo implicit return)
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Waktu Permintaan", sortable: true, align: "start" },
      { th: "Pengguna / IP", sortable: true, align: "start" },
      { th: "Layanan & Layer", sortable: true, align: "start" },
      { th: "Fitur / Bytes", sortable: true, align: "start" },
      { th: "Status HTTP", sortable: true, align: "start" },
      { th: "Durasi (ms)", sortable: true, align: "start" },
    ];

    const formattedItems: FormattedListItem<MapServiceActivityLogItem>[] =
      items.map((log: MapServiceActivityLogItem) => {
        const kbSize = (Number(log.responseBytes || 0) / 1024).toFixed(1);

        return {
          id: log.id,
          data: log,
          columns: [
            {
              value: log.createdAt,
              td: (
                <P fontSize={"xs"} color={"fg.muted"}>
                  {formatUtcDateTime(log.createdAt)}
                </P>
              ),
              align: "start",
            },
            {
              value: log.user?.name || log.clientIp || "-",
              td: (
                <VStack align={"start"} gap={0}>
                  <P fontSize={"xs"} fontWeight={"medium"}>
                    {log.user?.name || "Anonim / Direct API"}
                  </P>
                  <P fontSize={"2xs"} color={"fg.subtle"}>
                    {log.clientIp ?? "-"}
                  </P>
                </VStack>
              ),
              align: "start",
            },
            {
              value: `${log.serviceType} ${log.layerName ?? ""}`,
              td: (
                <VStack align={"start"} gap={0}>
                  <HStack gap={"2xs"} align={"center"}>
                    <Badge colorPalette={"teal"} variant={"outline"} size={"xs"}>
                      {log.serviceType}
                    </Badge>
                    <P fontSize={"xs"} fontWeight={"semibold"}>
                      {log.layerName || log.endpoint}
                    </P>
                  </HStack>
                  {log.isSuspicious && (
                    <Badge colorPalette={"red"} variant={"solid"} size={"xs"} mt={"2xs"}>
                      {"Mencurigakan"}
                    </Badge>
                  )}
                </VStack>
              ),
              align: "start",
            },
            {
              value: `${log.featureCount} / ${kbSize} KB`,
              td: (
                <P fontSize={"xs"}>
                  {`${new Intl.NumberFormat("id-ID").format(log.featureCount)} fitur · ${kbSize} KB`}
                </P>
              ),
              align: "start",
            },
            {
              value: log.statusCode,
              td: (
                <Badge
                  colorPalette={
                    log.statusCode >= 200 && log.statusCode < 300
                      ? "green"
                      : log.statusCode === 429
                        ? "orange"
                        : "red"
                  }
                  size={"sm"}
                >
                  {log.statusCode}
                </Badge>
              ),
              align: "start",
            },
            {
              value: log.durationMs,
              td: (
                <P fontSize={"xs"} color={"fg.muted"}>
                  {`${log.durationMs} ms`}
                </P>
              ),
              align: "start",
            },
          ],
        };
      });

    return {
      headers,
      items: formattedItems,
      batchActions: [],
      itemActions: () => [],
    };
  }, [items]);

  return (
    <VStack w={"full"} align={"stretch"} gap={"md"}>
      {/* Search Header only */}
      <ActionHeaderScrollContainer px={"md"} py={"sm"}>
        <SearchInput
          value={params.layerName ?? ""}
          onChange={handleSearchLayer}
          placeholder={"Filter nama layer..."}
          w={"240px"}
        />
      </ActionHeaderScrollContainer>

      <Separator borderColor={"bg.canvas"} />

      {isLoading ? (
        <Skeleton minH={"300px"} w={"full"} />
      ) : items.length === 0 ? (
        params.layerName ? (
          <StateNoResult query={params.layerName} />
        ) : (
          <StateNoData title={"Belum ada log aktivitas layanan peta"} />
        )
      ) : (
        <VStack w={"full"} align={"stretch"} gap={"sm"}>
          <DataViewTable.Root
            headers={dataList.headers}
            items={dataList.items}
            page={params.page}
            pageSize={params.limit}
            roundedTop={0}
          >
            <DataViewTable.Header />
            <DataViewTable.Body />
          </DataViewTable.Root>

          <Separator borderColor={"bg.canvas"} />

          {pagination && (
            <DataViewFooter
              page={pagination.currentPage}
              totalPage={pagination.totalPages}
              totalData={pagination.totalItems}
              currentDataLength={items.length}
              pageSize={pagination.limit}
              setPage={handlePageChange}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
};
