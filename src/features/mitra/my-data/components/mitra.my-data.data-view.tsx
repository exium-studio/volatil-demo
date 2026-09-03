import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MyDataItem,
  MyDataQueryParams,
  MyDataStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useNavigate } from "@tanstack/react-router";
import { DatabaseIcon, SquarePen } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const MY_DATA_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Sedang Diproses", value: "processing" },
  { label: "Menunggu Verifikasi", value: "pending_verification" },
  { label: "Aktif", value: "active" },
  { label: "Tidak Aktif", value: "expired" },
];

export const MitraMyDataDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<MyDataQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: undefined,
  });

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "");
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { myData, isLoading, isFetching } = useMitraMyDataQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: debouncedSearch || undefined,
    status: params.status,
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
      { th: "Tanggal Kedaluwarsa", sortable: true, align: "start" },
    ];

    const items: FormattedListItem[] = myData.items.map((item: MyDataItem) => {
      const isActive = item.status === "active";
      const isProcessing = item.status === "processing";
      const isPendingVerification = item.status === "pending_verification";
      const layerDisplayName = item.title || item.id.replace(/_/g, " ");
      const effectiveWfsUrl = item.externalWfsUrl || item.wfsUrl;
      const effectiveWmsUrl = item.externalWmsUrl || item.wmsUrl;

      const statusBadge = isProcessing ? (
        <Badge colorPalette={"blue"} variant={"subtle"}>
          {"Sedang Diproses"}
        </Badge>
      ) : isPendingVerification ? (
        <Badge colorPalette={"orange"} variant={"subtle"}>
          {"Menunggu Verifikasi"}
        </Badge>
      ) : isActive ? (
        <Badge colorPalette={"green"} variant={"subtle"}>
          {"Aktif"}
        </Badge>
      ) : (
        <Badge colorPalette={"red"} variant={"subtle"}>
          {"Tidak Aktif"}
        </Badge>
      );

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
            td: <BasisIgtBadge>{item.spatialBasis}</BasisIgtBadge>,
            align: "start" as const,
          },
          {
            value: effectiveWfsUrl ?? "",
            td: effectiveWfsUrl ? (
              <HStack gap={"xs"} align={"center"} maxW={"240px"}>
                <ExternalLink
                  href={effectiveWfsUrl}
                  display={"inline-flex"}
                  alignItems={"center"}
                  minW={0}
                  flex={1}
                >
                  <ClampedP fontSize={"sm"} truncate>
                    {effectiveWfsUrl}
                  </ClampedP>
                </ExternalLink>

                <ClipboardButton
                  value={effectiveWfsUrl}
                  variant={"ghost"}
                  aria-label={"Salin URL WFS"}
                  flexShrink={0}
                />
              </HStack>
            ) : (
              <P color={"fg.subtle"}>{"-"}</P>
            ),
            align: "start" as const,
          },
          {
            value: effectiveWmsUrl ?? "",
            td: effectiveWmsUrl ? (
              <HStack gap={"xs"} align={"center"} maxW={"240px"}>
                <ExternalLink
                  href={effectiveWmsUrl}
                  display={"inline-flex"}
                  alignItems={"center"}
                  minW={0}
                  flex={1}
                >
                  <ClampedP fontSize={"sm"} truncate>
                    {effectiveWmsUrl}
                  </ClampedP>
                </ExternalLink>

                <ClipboardButton
                  value={effectiveWmsUrl}
                  variant={"ghost"}
                  aria-label={"Salin URL WMS"}
                  flexShrink={0}
                />
              </HStack>
            ) : (
              <P color={"fg.subtle"}>{"-"}</P>
            ),
            align: "start" as const,
          },
          {
            value: item.status,
            td: statusBadge,
            align: "start" as const,
          },
          {
            value: item.expiresAt,
            td: isActive ? (
              <Countdown finishedAt={item.expiresAt} />
            ) : (
              <P color={"fg.subtle"}>{"-"}</P>
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
    <VStack flex={1} w={"full"}>
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
          value={params.search}
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari layer IGT / tema..."}
          maxW={"280px"}
        />

        <HStack wrap={"wrap"} gap={"sm"}>
          <StatusFilterSelect
            modalKey={"my-data-status-filter"}
            placeholder={"Status"}
            options={MY_DATA_STATUS_OPTIONS}
            value={params.status ?? ""}
            onValueChange={(value) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: (value as MyDataStatus) || undefined,
                  page: 1,
                }));
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
        ) : isEmptyArray(myData.items) ? (
          <VStack
            flex={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            bg={"bg.body"}
          >
            {debouncedSearch || params.status ? (
              <NoResultState
                description={
                  "Tidak ada layer IGT yang sesuai dengan kata kunci atau filter yang Anda pilih."
                }
              />
            ) : (
              <NoDataState
                icon={DatabaseIcon}
                title={"Belum Ada Data IGT"}
                description={
                  "Anda belum memiliki akses ke layer data spasial IGT. Silakan ajukan permohonan data terlebih dahulu."
                }
              >
                <Button
                  primary
                  size={"sm"}
                  onClick={() => {
                    navigate({ to: "/mitra/data-request" });
                  }}
                >
                  <AppIcon icon={SquarePen} />
                  {"Permohonan Data"}
                </Button>
              </NoDataState>
            )}
          </VStack>
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataView.Table.Root
              headers={dataList.headers}
              items={dataList.items}
              withNumbering={true}
              page={params.page}
              pageSize={params.pageSize}
              rounded={0}
              pb={0}
            >
              <DataView.Table.Header />
              <DataView.Table.Body />
            </DataView.Table.Root>

            <TopBarLoader isFetching={isFetching} />

            <DataViewFooter
              page={params.page}
              pageSize={params.pageSize}
              setPage={(nextPage: number) =>
                setParams((prev) => ({ ...prev, page: nextPage }))
              }
              setPageSize={(nextSize: number) => {
                setParams((prev) => ({
                  ...prev,
                  pageSize: nextSize,
                  page: 1,
                }));
              }}
              currentDataLength={myData.items.length}
              totalData={myData.pagination.totalItems}
              totalPage={myData.pagination.totalPages}
              roundedBottom={0}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
