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
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { MitraWorkspaceRenewalTrigger } from "@/features/mitra/my-data/components/mitra.my-data.renewal-modal";
import { useMitraWorkspacesQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MitraWorkspaceItem,
  MitraWorkspaceQueryParams,
} from "@/features/mitra/my-data/types/my-data.type";
import { checkOrderExtensionEligibility } from "@/features/mitra/my-data/utils/extension.utils";
import { toast } from "@/design-system/components/toast/core/toast.manager";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  ClockPlusIcon,
  CopyIcon,
  FileCheckIcon,
  FolderOpenIcon,
  LayersIcon,
  ReceiptTextIcon,
  SquarePen,
} from "lucide-react";
import { useMemo, useState } from "react";

export const MitraMyDataWorkspacesDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();

  // Stores & Hooks
  const { systemPolicies } = usePricingPolicy();

  // States
  const [params, setParams] = useState<MitraWorkspaceQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
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
  });

  // Derived Values — Table headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Workspace", sortable: true },
      { th: "WMS URL (Interop)", sortable: false },
      { th: "No. Transaksi / Pesanan", sortable: true },
      { th: "Jumlah Layer", sortable: true, align: "center" },
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
                <NavLink
                  to={"/mitra/my-data/$workspaceId"}
                  params={{ workspaceId: item.id }}
                >
                  <VStack align={"start"} w={"300px"} className={"group"}>
                    <ClampedP
                      fontFamily={"mono"}
                      color={"fg"}
                      _groupHover={{
                        fontWeight: "bold",
                        color: "blue.fg",
                      }}
                    >
                      {item.workspaceName}
                    </ClampedP>

                    <ClampedP
                      fontSize={"sm"}
                      color={"fg.subtle"}
                      fontFamily={"mono"}
                    >
                      {`ID: ${item.id}`}
                    </ClampedP>
                  </VStack>
                </NavLink>
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
        key: "copy-workspace-url",
        label: "Salin URL WMS Workspace",
        icon: CopyIcon,
        onClick: (item: MitraWorkspaceItem) => {
          if (!item.wmsUrl) return;
          void navigator.clipboard.writeText(item.wmsUrl);
          toast.create({
            title: "URL Berhasil Disalin",
            description: `URL WMS Interop untuk ${item.workspaceName} telah disalin ke clipboard`,
            variant: "success",
          });
        },
        hidden: (item: MitraWorkspaceItem) => !item.wmsUrl,
      },
      {
        key: "renew-workspace",
        label: "Perpanjang Layanan",
        tooltip: (item: MitraWorkspaceItem) => {
          const eligibility = checkOrderExtensionEligibility(
            item,
            systemPolicies,
          );
          return eligibility.canExtend
            ? "Perpanjang Layanan"
            : eligibility.reason ?? "Perpanjang Layanan";
        },
        icon: ClockPlusIcon,
        disabled: (item: MitraWorkspaceItem) => {
          const eligibility = checkOrderExtensionEligibility(
            item,
            systemPolicies,
          );
          return !eligibility.canExtend;
        },
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
            <StateRetry
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
            {debouncedSearch ? (
              <StateNoResult
                description={
                  "Tidak ada workspace yang sesuai dengan kata kunci pencarian Anda."
                }
              />
            ) : (
              <StateNoData
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
              </StateNoData>
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
