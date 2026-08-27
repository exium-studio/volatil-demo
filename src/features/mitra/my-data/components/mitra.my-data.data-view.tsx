// src/features/mitra/my-data/components/mitra.my-data-list.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MyDataItem,
  MyDataStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { ExternalLinkIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const MY_DATA_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "active" },
  { label: "Tidak Aktif", value: "expired" },
];

export const MitraMyDataDataView = (_props: MitraMyDataViewProps) => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );
  const [status, setStatus] = useState<string>("");

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { myData, isLoading, isFetching } = useMitraMyDataQuery({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status: (status as MyDataStatus) || undefined,
  });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT", sortable: true, align: "start" },
      { th: "Basis IGT", sortable: true, align: "start" },
      { th: "WFS URL", sortable: false, align: "start" },
      { th: "WMS URL", sortable: false, align: "start" },
      { th: "Status Aktif", sortable: true, align: "start" },
      { th: "Sisa Waktu", sortable: true, align: "start" },
      { th: "Tanggal Kadaluwarsa", sortable: true, align: "start" },
    ];

    const items: FormattedListItem[] = myData.items.map((item: MyDataItem) => {
      const isBidang = item.spatialBasis === "bidang";
      const isActive = item.status === "active";
      const layerDisplayName = item.title || item.id.replace(/_/g, " ");

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: layerDisplayName,
            td: (
              <P fontSize={"sm"} fontWeight={"medium"}>
                {layerDisplayName}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.spatialBasis,
            td: isBidang ? (
              <Badge colorPalette={"blue"} variant={"subtle"}>
                {"Bidang"}
              </Badge>
            ) : (
              <Badge colorPalette={"orange"} variant={"subtle"}>
                {"Kawasan"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.wfsUrl ?? "",
            td: item.wfsUrl ? (
              <ExternalLink
                href={item.wfsUrl}
                display={"inline-flex"}
                alignItems={"center"}
                gap={1}
                maxW={"200px"}
              >
                <P truncate>
                  {item.wfsUrl}
                </P>
                <AppIcon icon={ExternalLinkIcon} size={"xs"} flexShrink={0} />
              </ExternalLink>
            ) : (
              <P color={"fg.subtle"}>
                {"-"}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.wmsUrl ?? "",
            td: item.wmsUrl ? (
              <ExternalLink
                href={item.wmsUrl}
                display={"inline-flex"}
                alignItems={"center"}
                gap={1}
                maxW={"200px"}
              >
                <P truncate>
                  {item.wmsUrl}
                </P>
                <AppIcon icon={ExternalLinkIcon} size={"xs"} flexShrink={0} />
              </ExternalLink>
            ) : (
              <P color={"fg.subtle"}>
                {"-"}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.status,
            td: (
              <Badge
                colorPalette={isActive ? "green" : "red"}
                variant={"subtle"}
              >
                {isActive ? "Aktif" : "Tidak Aktif"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.expiresAt,
            td: isActive ? (
              <Countdown finishedAt={item.expiresAt} />
            ) : (
              <P color={"fg.subtle"}>
                {"-"}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.expiresAt,
            td: (
              <P whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.expiresAt, preferredTimezone)}
              </P>
            ),
            align: "start" as const,
          },
        ],
      };
    });

    return {
      headers,
      items,
      batchActions: [],
      itemActions: [],
    };
  }, [myData.items, preferredTimezone]);

  return (
    <VStack w={"full"}>
      {/* Header Controls */}
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
          value={searchRaw}
          onValueChange={(val) => {
            setSearchRaw(val);
            setPage(1);
          }}
          placeholder={"Cari layer IGT / tema..."}
          maxW={"280px"}
        />

        <HStack wrap={"wrap"} gap={"sm"}>
          <StatusSelect
            modalKey={"my-data-status-filter"}
            placeholder={"Status"}
            options={MY_DATA_STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => {
              startTransition(() => {
                setStatus(value);
                setPage(1);
              });
            }}
            w={"180px"}
          />
        </HStack>
      </HStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Content */}
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
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataView.Table.Root
              headers={dataList.headers}
              items={dataList.items}
              withNumbering={true}
              page={page}
              pageSize={pageSize}
              rounded={0}
              pb={0}
              shadow={"none"}
            >
              <DataView.Table.Header />
              <DataView.Table.Body />
            </DataView.Table.Root>

            <TopBarLoader isFetching={isFetching} />

            <DataViewFooter
              page={page}
              pageSize={pageSize}
              setPage={(nextPage: number) => setPage(nextPage)}
              setPageSize={(nextSize: number) => {
                setPageSize(nextSize);
                setPage(1);
              }}
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
