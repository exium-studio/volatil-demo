// src/features/mitra/my-data/components/mitra.my-data.workspaces-data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { MitraWorkspaceRenewalTrigger } from "@/features/mitra/my-data/components/mitra.my-data.renewal-modal";
import { useMitraWorkspacesQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MitraWorkspaceItem,
  MitraWorkspaceQueryParams,
  MyDataStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { MyDataStatusBadge } from "@/features/shared/components/my-data-status.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { MY_DATA_STATUS_OPTIONS } from "@/features/shared/constants/volatil.ssot-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  FileCheckIcon,
  FolderOpenIcon,
  LayersIcon,
  ReceiptTextIcon,
  RotateCwIcon,
  SquarePen,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const MitraMyDataWorkspacesDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [params, setParams] = useState<MitraWorkspaceQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    status: undefined,
  });

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "");
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const {
    workspaces,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMitraWorkspacesQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: debouncedSearch || undefined,
    status: params.status,
  });

  // Derived Values — Table headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Workspace", sortable: true },
      { th: "WMS URL (Interop)", sortable: false },
      { th: "No. Transaksi / Pesanan", sortable: true },
      { th: "Jumlah Layer", sortable: true, align: "center" },
      { th: "Status Aktif", sortable: true },
      { th: "TTE & Faktur", sortable: false, align: "start" },
      { th: "Sisa Waktu", sortable: true },
      { th: "Tanggal Kedaluwarsa", sortable: true },
    ];

    const items: FormattedListItem<MitraWorkspaceItem>[] = workspaces.map(
      (item: MitraWorkspaceItem) => {
        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.workspaceName,
              td: (
                <VStack align={"start"} gap={0}>
                  <ClampedP
                    fontSize={"sm"}
                    fontFamily={"mono"}
                    color={"fg"}
                    maxW={"220px"}
                  >
                    {item.workspaceName}
                  </ClampedP>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {item.id}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: item.wmsUrl ?? "",
              td: (
                <Url
                  url={item.wmsUrl}
                  label={"Salin URL WMS Interop"}
                  maxW={"280px"}
                  minW={"280px"}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.orderNumber || item.orderId,
              td: (
                <VStack>
                  {item.transactionNumber && (
                    <P fontSize={"sm"}>{item.transactionNumber}</P>
                  )}

                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {item.orderNumber || item.orderId}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: item.layersCount,
              td: (
                <P textAlign={"center"} fontWeight={"medium"}>
                  {`${item.layersCount} Layer`}
                </P>
              ),
              align: "center" as const,
            },
            {
              value: item.status,
              td: <MyDataStatusBadge>{item.status}</MyDataStatusBadge>,
              align: "start" as const,
            },
            {
              value: item.tte ? "TTE" : "Belum TTE",
              td: (
                <TteBadge
                  tte={item.tte}
                  invoiceUrl={item.invoiceUrl}
                  tteInvoiceUrl={item.tteInvoiceUrl}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.expiresAt,
              td: item.expiresAt ? (
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
                  {item.expiresAt
                    ? formatUtcDateTime(item.expiresAt, preferredTimezone)
                    : "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      },
    );

    const itemActions: DataViewItemActionsGenerator<MitraWorkspaceItem>[] = [
      {
        key: "open-workspace-detail",
        label: "Buka Layer IGT",
        icon: FolderOpenIcon,
        onClick: (item: MitraWorkspaceItem) => {
          void navigate({
            to: "/mitra/my-data/$workspaceId",
            params: { workspaceId: item.id },
          });
        },
      },
      {
        key: "renew-workspace",
        label: "Perpanjang Layanan",
        icon: RotateCwIcon,
        modal: {
          triggerComponent: (item: MitraWorkspaceItem) => (
            <MitraWorkspaceRenewalTrigger
              modalKey={`workspace-renew-${item.id}`}
              workspace={item}
            />
          ),
        },
      },
      {
        key: "view-invoice",
        label: "Lihat Faktur",
        icon: ReceiptTextIcon,
        href: (item: MitraWorkspaceItem) => item.invoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (item: MitraWorkspaceItem) => !item.invoiceUrl,
      },
      {
        key: "view-tte-invoice",
        label: "Lihat Faktur TTE",
        icon: FileCheckIcon,
        href: (item: MitraWorkspaceItem) => item.tteInvoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (item: MitraWorkspaceItem) => !item.tteInvoiceUrl,
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [workspaces, preferredTimezone, navigate]);

  return (
    <VStack flex={1} overflowY={"auto"} w={"full"} h={"full"}>
      {/* Header Controls */}
      <ActionHeaderScrollContainer>
        <SearchInput
          value={params.search}
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari workspace / no. pesanan..."}
          maxW={"280px"}
        />

        <HStack gap={"sm"}>
          <StatusFilterSelect
            modalKey={"my-data-workspace-status-filter"}
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
      </ActionHeaderScrollContainer>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Content */}
      <VStack
        flex={1}
        gap={"sm"}
        position={"relative"}
        overflowY={"auto"}
        w={"full"}
        bg={"bg.canvas"}
      >
        {isLoading ? (
          <Skeleton p={"md"} rounded={0} />
        ) : isError ? (
          <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
            <RetryState
              title={"Gagal Memuat Workspace"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat daftar workspace Anda. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Center>
        ) : isEmptyArray(workspaces) ? (
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
                  "Tidak ada workspace yang sesuai dengan kata kunci atau filter yang Anda pilih."
                }
              />
            ) : (
              <NoDataState
                icon={LayersIcon}
                title={"Belum Ada Workspace"}
                description={
                  "Anda belum memiliki workspace aktif. Silakan ajukan permintaan data terlebih dahulu."
                }
              >
                <Button
                  primary
                  size={"sm"}
                  onClick={() => {
                    void navigate({ to: "/mitra/data-request" });
                  }}
                >
                  <AppIcon icon={SquarePen} />
                  {"Permintaan Data"}
                </Button>
              </NoDataState>
            )}
          </VStack>
        ) : (
          <VStack flex={1} w={"full"} position={"relative"} overflowY={"auto"}>
            <TopBarLoader isFetching={isFetching} />

            <DataViewTable.Root
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              withNumbering={true}
              page={params.page}
              pageSize={params.pageSize}
              rounded={0}
              pb={0}
            >
              <DataViewTable.Header />
              <DataViewTable.Body />
            </DataViewTable.Root>

            <Separator borderColor={"bg.canvas"} />

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
              currentDataLength={workspaces.length}
              totalData={pagination.totalItems}
              totalPage={pagination.totalPages}
            />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
