// src/features/internal/security-monitoring/components/security-users.table.tsx

import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
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
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import {
  useExecuteSecurityAction,
  useSecurityUsersQuery,
} from "@/features/internal/security-monitoring/hooks/use-security-monitoring.query";
import type {
  SecurityUserQueryParams,
  UserRiskItem,
} from "@/features/internal/security-monitoring/types/security-monitoring.type";
import { formatUtcDateTime } from "@/shared/utils/formatter/date.formatter";
import { BanIcon, RotateCcwIcon, TimerIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

export const SecurityUsersTable = () => {
  // States
  const [params, setParams] = useState<SecurityUserQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  // Queries & Mutations
  const { data, isLoading } = useSecurityUsersQuery(params);
  const { mutate: executeAction } = useExecuteSecurityAction();

  // Handlers
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setParams((prev) => ({ ...prev, search: val, page: 1 }));
  };

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  // Derived Values - DataList Pattern (1 useMemo implicit return)
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Pengguna / Mitra", sortable: true, align: "start" },
      { th: "Meter Risiko", sortable: true, align: "start" },
      { th: "Status Standing", sortable: true, align: "start" },
      { th: "Faktor Kontribusi", sortable: false, align: "start" },
      { th: "Kalkulasi Terakhir", sortable: true, align: "start" },
    ];

    const formattedItems: FormattedListItem<UserRiskItem>[] = items.map(
      (item: UserRiskItem) => {
        const score = item.currentScore;
        const badgePalette =
          score >= 90
            ? "red"
            : score >= 70
              ? "orange"
              : score >= 40
                ? "yellow"
                : "green";

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.user?.name || "User",
              td: (
                <VStack align={"start"} gap={"2xs"}>
                  <P fontWeight={"semibold"}>{item.user?.name || "User"}</P>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {item.user?.email}
                  </P>
                </VStack>
              ),
              align: "start",
            },
            {
              value: String(score),
              td: (
                <HStack gap={"xs"} align={"center"}>
                  <Badge colorPalette={badgePalette} variant={"subtle"} size={"sm"}>
                    {`${score} / 100`}
                  </Badge>
                  <P fontSize={"xs"} fontWeight={"medium"}>
                    {item.riskLevel}
                  </P>
                </HStack>
              ),
              align: "start",
            },
            {
              value: item.standingStatus,
              td: (
                <Badge
                  colorPalette={
                    item.standingStatus === "SUSPENDED"
                      ? "red"
                      : item.standingStatus === "THROTTLED"
                        ? "orange"
                        : item.standingStatus === "MONITORED"
                          ? "yellow"
                          : "blue"
                  }
                  variant={"solid"}
                  size={"sm"}
                >
                  {item.standingStatus}
                </Badge>
              ),
              align: "start",
            },
            {
              value: `${item.sequentialScrapeScore}-${item.volumeScore}-${item.velocityScore}`,
              td: (
                <P fontSize={"xs"} color={"fg.muted"}>
                  {`Seq: ${item.sequentialScrapeScore} | Vol: ${item.volumeScore} | Vel: ${item.velocityScore}`}
                </P>
              ),
              align: "start",
            },
            {
              value: item.lastCalculatedAt || "",
              td: (
                <P fontSize={"xs"} color={"fg.muted"}>
                  {item.lastCalculatedAt
                    ? formatUtcDateTime(item.lastCalculatedAt)
                    : "-"}
                </P>
              ),
              align: "start",
            },
          ],
        };
      },
    );

    const itemActions: DataViewItemActionsGenerator<UserRiskItem>[] = [
      {
        key: "reset",
        label: "Reset Skor Risiko",
        icon: RotateCcwIcon,
        onClick: (raw: UserRiskItem) => {
          executeAction({
            userId: raw.userId,
            action: "RESET_SCORE",
            reason: "Reset manual oleh administrator",
          });
        },
      },
      {
        key: "throttle",
        label: "Terapkan Throttling (Delay 1500ms)",
        icon: TimerIcon,
        onClick: (raw: UserRiskItem) => {
          executeAction({
            userId: raw.userId,
            action: "THROTTLE",
            reason: "Throttling manual oleh administrator",
          });
        },
      },
      {
        key: "suspend",
        label: "Bekukan Akses Peta (Suspend)",
        icon: BanIcon,
        colorPalette: "red",
        onClick: (raw: UserRiskItem) => {
          executeAction({
            userId: raw.userId,
            action: "SUSPEND",
            reason: "Pemblokiran manual oleh administrator",
          });
        },
      },
    ];

    return {
      headers,
      items: formattedItems,
      batchActions: [],
      itemActions,
    };
  }, [items, executeAction]);

  return (
    <Container.Root w={"full"} withContext={true}>
      <Container.Body gap={"md"}>
        <HeaderContainer>
          <HStack align={"center"} gap={"xs"}>
            <Heading size={"md"}>{"Peringkat Risiko Pengguna"}</Heading>
            <Badge colorPalette={"red"} variant={"subtle"} size={"sm"}>
              {"Sistem Deteksi Anomali"}
            </Badge>
          </HStack>

          <ActionHeaderScrollContainer>
            <SearchInput
              value={params.search ?? ""}
              onChange={handleSearchChange}
              placeholder={"Cari nama atau email..."}
              w={"240px"}
            />
          </ActionHeaderScrollContainer>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {isLoading ? (
          <Skeleton minH={"300px"} w={"full"} />
        ) : items.length === 0 ? (
          params.search ? (
            <StateNoResult query={params.search} />
          ) : (
            <StateNoData title={"Belum ada data risiko pengguna"} />
          )
        ) : (
          <VStack w={"full"} align={"stretch"} gap={"sm"}>
            <DataViewTable.Root
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
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
      </Container.Body>
    </Container.Root>
  );
};
