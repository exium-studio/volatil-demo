// src/features/mitra/my-data/components/mitra.my-data-list.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-list-table.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { IconButton } from "@/design-system/components/button/ui/button";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { IgtFilterTrigger } from "@/features/mitra/data-request/components/igt-filter";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataListProps,
  MyDataStatus,
  MyDataTransactionStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/features/mitra/my-data/utils/my-data-date";
import { t } from "@/shared/libs/i18n";
import { ExternalLinkIcon, SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { StatusSelect } from "@/shared/components/select/ui/status-select";

const MY_DATA_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Aktif", value: "active" },
  { label: "Kedaluwarsa", value: "expired" },
];

const TRANSACTION_STATUS: Record<
  MyDataTransactionStatus,
  { label: string; color: string }
> = {
  pending: { label: "Menunggu", color: "orange" },
  settled: { label: "Selesai", color: "green" },
  failed: { label: "Gagal", color: "red" },
};

export const MitraMyDataList = (_props: MitraMyDataListProps) => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [state, setState] = useState<{
    search: string;
    page: number;
    pageSize: number;
    status: MyDataStatus;
  }>({
    search: "",
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    status: "active",
  });
  const [wfsFilters, setWfsFilters] = useState<IgtFilterValues>({});
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const { myData, isLoading, isFetching } = useMitraMyDataQuery({
    ...state,
    search: state.search || undefined,
    basis: wfsFilters.basis?.value,
    tema: wfsFilters.tema?.value,
    provinsi: wfsFilters.provinsi?.value,
    kabupaten: wfsFilters.kabupaten?.value,
    kecamatan: wfsFilters.kecamatan?.value,
    kelurahan: wfsFilters.kelurahan?.value,
  });

  const updateState = (
    next: Partial<typeof state>,
    resetPage = false,
  ) => {
    setState((prev) => ({
      ...prev,
      ...next,
      page: resetPage ? 1 : (next.page ?? prev.page),
    }));
  };

  const headers = useMemo<FormattedTableHeader[]>(
    () => [
      { th: "ID Bidang", sortable: true },
      { th: "Basis Spasial", sortable: true, align: "center" },
      { th: "Dibeli Oleh", sortable: true },
      { th: "Tanggal Transaksi", sortable: true },
      { th: "Transaksi Diselesaikan", sortable: true },
      { th: "Status Transaksi", sortable: true, align: "center" },
      { th: "Tautan API WMS" },
      { th: "Sisa Masa Aktif", sortable: true },
      { th: "Tanggal Kedaluwarsa", sortable: true },
    ],
    [],
  );

  const items = useMemo(
    () =>
      myData.items.map((item) => ({
        id: item.id,
        data: item,
        columns: [
          {
            value: item.id,
            td: (
              <P fontSize={"sm"} fontWeight={"medium"}>
                {item.id}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.basis,
            td: (
              <Badge
                colorPalette={item.basis === "bidang" ? "blue" : "orange"}
                variant={"subtle"}
              >
                {item.basis}
              </Badge>
            ),
            align: "center" as const,
          },
          {
            value: item.purchasedBy.name,
            td: (
              <VStack align={"start"} gap={0} minW={"160px"}>
                <P fontSize={"sm"}>{item.purchasedBy.name}</P>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {item.purchasedBy.email}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: item.transactionDate,
            td: (
              <P fontSize={"sm"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.transactionDate, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.transactionSettledAt ?? "",
            td: (
              <P fontSize={"sm"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(
                  item.transactionSettledAt,
                  preferredTimezone,
                )}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.transactionStatus,
            td: (
              <Badge
                colorPalette={TRANSACTION_STATUS[item.transactionStatus].color}
                variant={"subtle"}
              >
                {TRANSACTION_STATUS[item.transactionStatus].label}
              </Badge>
            ),
            align: "center" as const,
          },
          {
            value: item.wfsUrl ?? "",
            td: item.wfsUrl ? (
              <ExternalLink
                href={item.wfsUrl}
                display={"inline-flex"}
                alignItems={"center"}
                gap={1}
                maxW={"220px"}
              >
                <P fontSize={"sm"} truncate>
                  {item.wfsUrl}
                </P>
                <AppIcon icon={ExternalLinkIcon} size={"xs"} flexShrink={0} />
              </ExternalLink>
            ) : (
              <P fontSize={"sm"} color={"fg.subtle"}>
                -
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.expiresAt,
            td: <Countdown finishedAt={item.expiresAt} fontSize={"sm"} />,
            align: "start" as const,
          },
          {
            value: item.expiresAt,
            td: (
              <P fontSize={"sm"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.expiresAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      })),
    [myData.items, preferredTimezone],
  );

  return (
    <VStack gap={SPACING.md} w={"full"}>
      <HStack wrap={"wrap"} align={"center"} justify={"space-between"} gap={SPACING.sm} w={"full"}>
        <SearchInput
          value={state.search}
          onValueChange={(val) =>
            startTransition(() => {
              updateState({ search: val }, true);
            })
          }
          placeholder={t["action.search"]()}
          maxW={"260px"}
        />
        <HStack wrap={"wrap"} gap={SPACING.sm}>
          <IgtFilterTrigger
            modalKey="mitra-my-data-filter-modal"
            value={wfsFilters}
            onApply={(filters: IgtFilterValues) => {
              startTransition(() => {
                setWfsFilters(filters);
                updateState({}, true);
              });
            }}
          >
            <IconButton variant={"outline"} aria-label={"Filter IGT"}>
              <AppIcon icon={SlidersHorizontalIcon} />
            </IconButton>
          </IgtFilterTrigger>

          <StatusSelect
            modalKey={"my-data-status-filter"}
            placeholder={"Status"}
            options={MY_DATA_STATUS_OPTIONS}
            value={state.status}
            onValueChange={(value) =>
              startTransition(() => {
                updateState({ status: value as MyDataStatus }, true);
              })
            }
            w={"180px"}
          />
        </HStack>
      </HStack>

      <Separator borderColor={"bg.canvas"} />

      <VStack
        flex={1}
        gap={PADDING.sm}
        overflowY={"auto"}
        bg={"bg.canvas"}
        w={"full"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={PADDING.md} rounded={0} />
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataListTable.Root
              headers={headers}
              items={items}
              withNumbering={false}
              page={state.page}
              pageSize={state.pageSize}
              rounded={0}
              pb={0}
              shadow={"none"}
            >
              <DataListTable.Header />
              <DataListTable.Body />
            </DataListTable.Root>
            <TopBarLoader isFetching={isFetching} />
            <DataListFooter
              page={state.page}
              pageSize={state.pageSize}
              setPage={(page) => updateState({ page })}
              setPageSize={(pageSize) => updateState({ pageSize }, true)}
              currentDataLength={myData.items.length}
              totalData={myData.pagination.totalItems}
              totalPage={myData.pagination.totalPages}
              roundedBottom={0}
              shadow={"none"}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
