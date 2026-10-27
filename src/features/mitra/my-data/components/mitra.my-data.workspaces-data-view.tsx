// src/features/mitra/my-data/components/mitra.my-data.workspaces-data-view.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { MaskedText } from "@/design-system/components/data-display/ui/masked-text";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { toast } from "@/design-system/components/toast/core/toast.manager";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { MitraWorkspaceRenewalTrigger } from "@/features/mitra/my-data/components/mitra.my-data.renewal-modal";
import {
  useMitraWorkspacesQuery,
  useRotateMitraApiKey,
} from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MitraWorkspaceItem,
  MitraWorkspaceQueryParams,
  WorkspaceActiveStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { checkOrderExtensionEligibility } from "@/features/mitra/my-data/utils/extension.utils";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { MitraMyDataIndexRoute } from "@/shared/libs/tanstack-router/routes";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2Icon,
  ClockIcon,
  ClockPlusIcon,
  CopyIcon,
  FileCheckIcon,
  FolderOpenIcon,
  KeyRoundIcon,
  LayersIcon,
  ReceiptTextIcon,
  RefreshCwIcon,
  SquarePen,
} from "lucide-react";
import { useMemo, useState } from "react";

const ACTIVE_STATUS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "almost_expired", label: "Hampir Kedaluwarsa" },
  { value: "expired", label: "Kedaluwarsa" },
];

export const MitraMyDataWorkspacesDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();
  const searchRouteParams = MitraMyDataIndexRoute.useSearch();

  // Stores & Hooks
  const { systemPolicies } = usePricingPolicy();
  const extensionWindowDays = systemPolicies.order_extension_window_days ?? 7;

  // States
  const [params, setParams] = useState<MitraWorkspaceQueryParams>(() => ({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    activeStatus: searchRouteParams.activeStatus ?? "all",
  }));

  // Derived Values
  const activeStatus = params.activeStatus ?? "all";
  const debouncedSearch = useDebouncedValue(params.search ?? "");
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const {
    workspaces,
    apiKey,
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
    activeStatus: activeStatus,
  });

  // Mutations
  const rotateApiKeyMutation = useRotateMitraApiKey();

  const handleRotateApiKey = () => {
    rotateApiKeyMutation.mutate();
  };

  // Derived Values — Table headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Workspace", sortable: true },
      { th: "WMS URL (Interop)", sortable: false },
      { th: "No. Pesanan", sortable: true },
      { th: "Jumlah Layer", sortable: true },
      { th: "Cakupan Bidang", sortable: true },
      { th: "Cakupan Kawasan", sortable: true },
      { th: "Periode Pembaruan", sortable: false, align: "start" },
      { th: "TTE & Faktur", sortable: false, align: "start" },
      { th: "Sisa Waktu", sortable: true },
      { th: "Tanggal Kedaluwarsa", sortable: true },
    ];

    const items: FormattedListItem<MitraWorkspaceItem>[] = workspaces.map(
      (item: MitraWorkspaceItem) => {
        const isExpired =
          item.status === "expired" ||
          checkOrderExtensionEligibility(item, systemPolicies).reason ===
            "Masa aktif pesanan telah habis (expired).";

        const totalPeriods = item.updatePeriods?.length ?? 0;
        const completedPeriods =
          item.updatePeriods?.filter((p) => p.completed).length ?? 0;
        const updatesLeft = totalPeriods - completedPeriods;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.workspaceName,
              td: isExpired ? (
                <VStack align={"start"} w={"300px"}>
                  <ClampedP
                    fontFamily={"mono"}
                    color={"fg.muted"}
                    textDecor={"line-through"}
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
              ) : (
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
              td: <P fontSize={"sm"}>{item.orderNumber || item.orderId}</P>,
              align: "start" as const,
            },
            {
              value: item.layersCount,
              td: <P textAlign={"center"}>{`${item.layersCount} Layer`}</P>,
            },
            {
              value: item.bidangCoverageCount,
              td: (
                <P>
                  {item.bidangCoverageCount ? (
                    <>
                      <TNum>{formatNumber(item.bidangCoverageCount)}</TNum>{" "}
                      {"Bidang"}
                    </>
                  ) : (
                    "-"
                  )}
                </P>
              ),
            },
            {
              value: item.kawasanCoverageHa,
              td: (
                <P>
                  {item.kawasanCoverageHa ? (
                    <>
                      <TNum>
                        {formatNumber(item.kawasanCoverageHa, {
                          maximumFractionDigits: 2,
                        })}
                      </TNum>{" "}
                      {"ha"}
                    </>
                  ) : (
                    "-"
                  )}
                </P>
              ),
            },
            {
              value: updatesLeft,
              td: (
                <HStack align={"center"}>
                  {totalPeriods === 0 && <P color={"fg.subtle"}>{"-"}</P>}

                  {totalPeriods > 0 && (
                    <Popover.Root
                      positioning={{ placement: "bottom-start", gutter: 8 }}
                    >
                      <Popover.Trigger asChild={true}>
                        <Box cursor={"pointer"} outline={"none"}>
                          {updatesLeft > 0 && (
                            <Badge
                              colorPalette={"blue"}
                              variant={"subtle"}
                              cursor={"pointer"}
                            >
                              <TNum>{formatNumber(updatesLeft)}</TNum>
                              {` / ${totalPeriods} update tersisa`}
                            </Badge>
                          )}
                          {updatesLeft === 0 && (
                            <Badge
                              colorPalette={"green"}
                              variant={"subtle"}
                              cursor={"pointer"}
                            >
                              {"Selesai diperbarui"}
                            </Badge>
                          )}
                        </Box>
                      </Popover.Trigger>

                      <Popover.Content w={"340px"}>
                        <Popover.Header pb={"md"}>
                          <HStack
                            justify={"space-between"}
                            align={"center"}
                            w={"full"}
                          >
                            <VStack align={"start"} gap={0}>
                              <Popover.Title fontWeight={"medium"}>
                                {"Jadwal Pembaruan"}
                              </Popover.Title>
                            </VStack>
                          </HStack>
                        </Popover.Header>

                        <Popover.Body p={0}>
                          <VStack align={"stretch"} gap={0}>
                            {item.updatePeriods?.map((period, pIdx) => {
                              const unitLabel =
                                period.unit === "minutes"
                                  ? "menit"
                                  : period.unit === "week"
                                    ? "minggu"
                                    : "hari";
                              const formattedTarget = period.targetAt
                                ? formatUtcDateTime(
                                    period.targetAt,
                                    preferredTimezone,
                                  )
                                : "-";

                              return (
                                <Box
                                  key={pIdx}
                                  px={4}
                                  py={3}
                                  borderTop={"1px solid"}
                                  borderColor={"border.subtle"}
                                  _hover={{ bg: "bg.subtle" }}
                                  transition={"background 0.2s"}
                                >
                                  <HStack
                                    justify={"space-between"}
                                    align={"center"}
                                  >
                                    <VStack align={"start"} gap={1}>
                                      <HStack gap={"xs"} align={"center"}>
                                        <P fontWeight={"medium"}>
                                          {`Tahap ${period.milestone}`}
                                        </P>
                                        <Badge
                                          variant={"subtle"}
                                          colorPalette={"gray"}
                                        >
                                          {`+${period.offset} ${unitLabel}`}
                                        </Badge>
                                      </HStack>

                                      <P color={"fg.muted"} fontSize={"sm"}>
                                        {formattedTarget}
                                      </P>
                                    </VStack>

                                    {period.completed && (
                                      <Badge
                                        colorPalette={"green"}
                                        variant={"subtle"}
                                      >
                                        <AppIcon icon={CheckCircle2Icon} />
                                        {"Selesai"}
                                      </Badge>
                                    )}
                                    {!period.completed && (
                                      <Badge
                                        colorPalette={"blue"}
                                        variant={"subtle"}
                                        alignItems={"center"}
                                      >
                                        <AppIcon icon={ClockIcon} size={"xs"} />
                                        {"Menunggu"}
                                      </Badge>
                                    )}
                                  </HStack>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Root>
                  )}
                </HStack>
              ),
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
                <Countdown
                  finishedAt={item.expiresAt}
                  warningThresholdDays={extensionWindowDays}
                />
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
        disabled: (item: MitraWorkspaceItem) =>
          item.status === "expired" ||
          checkOrderExtensionEligibility(item, systemPolicies).reason ===
            "Masa aktif pesanan telah habis (expired).",
        tooltip: (item: MitraWorkspaceItem) => {
          const isExpired =
            item.status === "expired" ||
            checkOrderExtensionEligibility(item, systemPolicies).reason ===
              "Masa aktif pesanan telah habis (expired).";
          return isExpired
            ? "Workspace sudah kedaluwarsa, tidak dapat digunakan dan akan dihapus dalam 1 hari kerja"
            : "Buka Layer IGT";
        },
        disabledMessage:
          "Workspace sudah kedaluwarsa, tidak dapat digunakan dan akan dihapus dalam 1 hari kerja",
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
            : (eligibility.reason ?? "Perpanjang Layanan");
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
  }, [
    workspaces,
    preferredTimezone,
    navigate,
    systemPolicies,
    extensionWindowDays,
  ]);

  return (
    <VStack flex={1} overflowY={"auto"} w={"full"} h={"full"}>
      <HStack align={"center"} gap={"xs"} p={"md"}>
        {isLoading && <Skeleton minW={"280px"} h={"40px"} rounded={"md"} />}

        {!isLoading && apiKey && (
          <HStack
            flex={1}
            align={"center"}
            gap={"xs"}
            minW={"280px"}
            h={"40px"}
            pl={"sm"}
            bg={"bg.subtle"}
            rounded={"md"}
          >
            <HStack align={"center"} gap={"xs"}>
              <AppIcon icon={KeyRoundIcon} />

              <ClampedP color={"fg.muted"} fontFamily={"mono"}>
                {"API Key:"}
              </ClampedP>
            </HStack>

            <MaskedText
              value={apiKey}
              copyLabel={"Salin API Key Mitra"}
              flex={1}
            />
          </HStack>
        )}

        <Tooltip content={"Ganti API Key"} aria-label={"Ganti API Key"}>
          <IconButton
            aria-label={"Rotate API Key"}
            variant={"outline"}
            loading={rotateApiKeyMutation.isPending}
            onClick={handleRotateApiKey}
          >
            <AppIcon icon={RefreshCwIcon} />
          </IconButton>
        </Tooltip>
      </HStack>

      <Separator borderColor={"bg.canvas"} />

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

        <StatusFilterSelect
          modalKey={"workspace-active-status-filter-modal"}
          placeholder={"Status Masa Aktif"}
          options={ACTIVE_STATUS_OPTIONS}
          value={activeStatus}
          onValueChange={(val) => {
            const nextStatus = (val as WorkspaceActiveStatus) || "all";
            setParams((prev) => ({
              ...prev,
              activeStatus: nextStatus,
              page: 1,
            }));
            // Clear URL param once user actively changes filter
            void navigate({
              to: "/mitra/my-data",
              replace: true,
              search: (prevSearch: Record<string, unknown>) => {
                const updated = { ...prevSearch };
                delete updated.activeStatus;
                return updated;
              },
            });
          }}
          w={"150px"}
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
                query={debouncedSearch}
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
