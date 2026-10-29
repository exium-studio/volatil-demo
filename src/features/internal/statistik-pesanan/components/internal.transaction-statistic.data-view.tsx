// src/features/internal/statistik-pesanan/components/internal.transaction-statistic.data-view.tsx

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
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useInternalTransactionsQuery } from "@/features/internal/statistik-pesanan/hooks/use-internal-transaction-statistic.query";
import type {
  InternalTransactionItem,
  InternalTransactionQueryParams,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { InternalWmsStatusBadge } from "@/features/internal/statistik-pesanan/components/internal.wms-status.badge";
import {
  getWmsStatusKey,
  ORDER_STATUS_WITH_WMS_FILTER_OPTIONS,
  WMS_STATUS_MAP,
} from "@/features/internal/statistik-pesanan/constants/internal.transaction-statistic.wms-map";
import { useInternalTransactionStatisticFilterStore } from "@/features/internal/statistik-pesanan/stores/internal.transaction-statistic.store";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { OrderedIgtLayers } from "@/features/shared/components/ordered-igt-layers";
import { PaymentMethodBadge } from "@/features/shared/components/payment-method.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TransactionDetailTrigger } from "@/features/shared/components/transaction-detail.modal";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { ORDER_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { useLocale } from "@/shared/libs/i18n/locale-provider";
import type { OrderStatus } from "@/shared/types/status.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatRelativeTime,
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import {
  EyeIcon,
  FileCheckIcon,
  HistoryIcon,
  ReceiptTextIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { IconButton } from "@/design-system/components/button/ui/button";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";

const ITEMS_PER_PAGE_DEFAULT = DEFAULT_PAGE_SIZE_OPTIONS[0];

export const InternalTransactionStatisticDataView = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // Contexts
  const { locale } = useLocale();

  // Stores
  const { selectedOrderStatus, setSelectedOrderStatus, resetFilter } =
    useInternalTransactionStatisticFilterStore();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<InternalTransactionQueryParams>({
    page: 1,
    pageSize: ITEMS_PER_PAGE_DEFAULT,
    search: "",
    orderStatus: undefined,
  });

  // Effects — Synchronize store filter selection to data-view params
  useEffect(() => {
    startTransition(() => {
      setParams((prev) => ({
        ...prev,
        orderStatus: selectedOrderStatus,
        page: 1,
      }));
    });
  }, [selectedOrderStatus, startTransition]);

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "", 300);
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const activeWmsKey = getWmsStatusKey(params.orderStatus);
  const activeWmsConfig = activeWmsKey
    ? WMS_STATUS_MAP[activeWmsKey]
    : undefined;

  const isSearching = Boolean(debouncedSearch.trim() || params.orderStatus);
  const searchQuery = useMemo(() => {
    const parts: string[] = [];
    if (debouncedSearch.trim()) {
      parts.push(debouncedSearch.trim());
    }
    if (params.orderStatus) {
      const statusConfig = ORDER_STATUS_MAP[params.orderStatus];
      const wmsKey = getWmsStatusKey(params.orderStatus);
      const wmsLabel = wmsKey ? ` (${WMS_STATUS_MAP[wmsKey].label})` : "";
      parts.push(`${statusConfig?.label ?? params.orderStatus}${wmsLabel}`);
    }
    return parts.length > 0 ? parts.join(", ") : "...";
  }, [debouncedSearch, params.orderStatus]);

  // Queries
  const { transactions, isLoading, isFetching, isError, error, refetch } =
    useInternalTransactionsQuery({
      page: params.page,
      pageSize: params.pageSize,
      search: debouncedSearch || undefined,
      orderStatus: params.orderStatus,
    });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Tanggal Pengajuan", sortable: true, align: "start" },
      { th: "No. Pesanan", sortable: true, align: "start" },
      { th: "Status Pesanan", sortable: true, align: "start" },
      { th: "Mitra Pemohon", sortable: true, align: "start" },
      { th: "Status WMS", sortable: true, align: "start" },
      { th: "Kode Billing", sortable: false, align: "start" },
      { th: "Sisa Waktu Pembayaran", sortable: true, align: "start" },
      { th: "Metode Pembayaran", sortable: false, align: "start" },
      { th: "TTE & Faktur", sortable: false, align: "start" },
      { th: "IGT Dibeli", sortable: false, align: "start" },
      { th: "Jumlah Layer", sortable: false, align: "start" },
      { th: "Metode Pengajuan", sortable: false, align: "start" },
      { th: "Cakupan Bidang", sortable: true, align: "start" },
      { th: "Cakupan Kawasan", sortable: true, align: "start" },
      { th: "Total Nominal", sortable: true, align: "end" },
    ];

    const items: FormattedListItem<InternalTransactionItem>[] =
      transactions.items.map((item: InternalTransactionItem) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");
        const targetExpiry = item.billingExpiredAt || item.expiredAt;

        const effectiveOrderStatus: OrderStatus | undefined =
          item.transactionStatus === "expired" &&
          (!item.orderStatus || item.orderStatus === "pending_payment")
            ? "expired"
            : item.orderStatus;

        const effectiveBidangCount =
          item.bidangCoverageCount ??
          item.featuresCount ??
          item.items
            .filter((i) => (i.spatialBasis as string) === "bidang")
            .reduce((sum, it) => sum + (it.snapshotFeaturesCount ?? 0), 0);

        const effectiveKawasanHa =
          item.kawasanCoverageHa ??
          item.coverageHa ??
          item.items
            .filter((i) => (i.spatialBasis as string) === "kawasan")
            .reduce((sum, it) => sum + (it.snapshotAreaHa ?? 0), 0);

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.createdAt,
              td: (
                <HStack gap={2} whiteSpace={"nowrap"}>
                  <P fontSize={"sm"} color={"fg.muted"}>
                    {formatUtcDateTime(item.createdAt, preferredTimezone)}
                  </P>
                  {item.createdAt && (
                    <P color={"fg.subtle"} fontSize={"xs"}>
                      {`(${formatRelativeTime(item.createdAt, locale)})`}
                    </P>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.orderNumber || item.orderId,
              td: (
                <P fontSize={"sm"} color={"fg.muted"}>
                  {item.orderNumber || item.orderId}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: effectiveOrderStatus ?? "",
              td: effectiveOrderStatus ? (
                <OrderStatusBadge showIcon={true} size={"xs"}>
                  {effectiveOrderStatus}
                </OrderStatusBadge>
              ) : (
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {"-"}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.mitra.name,
              td: (
                <VStack align={"start"} gap={0} w={"180px"}>
                  <ClampedP fontSize={"sm"}>{item.mitra.name}</ClampedP>
                  <ClampedP fontSize={"xs"} color={"fg.subtle"}>
                    {item.mitra.agencyOrCompany || item.mitra.email}
                  </ClampedP>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: effectiveOrderStatus ?? "",
              td: (
                <InternalWmsStatusBadge showIcon={true} size={"xs"}>
                  {effectiveOrderStatus}
                </InternalWmsStatusBadge>
              ),
              align: "start" as const,
            },
            {
              value: item.billingCode,
              td: (
                <TNum fontSize={"sm"} color={"fg.muted"}>
                  {item.billingCode || "-"}
                </TNum>
              ),
              align: "start" as const,
            },
            {
              value: targetExpiry ?? "",
              td:
                effectiveOrderStatus === "pending_payment" && targetExpiry ? (
                  <Countdown
                    finishedAt={targetExpiry}
                    warningThresholdHours={1}
                    dangerThresholdMinutes={15}
                    finishColor={"fg.subtle"}
                  />
                ) : (
                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {"-"}
                  </P>
                ),
              align: "start" as const,
            },
            {
              value: item.paymentMethod,
              td: <PaymentMethodBadge>{item.paymentMethod}</PaymentMethodBadge>,
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
              value: itemNames,
              td: (
                <OrderedIgtLayers
                  items={item.items}
                  orderNumber={item.orderNumber || item.orderId}
                  coverageHa={effectiveKawasanHa ?? undefined}
                  bidangCoverageCount={effectiveBidangCount ?? undefined}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.items.length,
              td: (
                <P fontSize={"sm"} whiteSpace={"nowrap"}>
                  {`${item.items.length} Layer`}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.selectionType,
              td: (
                <SelectionTypeBadge size={"xs"}>
                  {item.selectionType}
                </SelectionTypeBadge>
              ),
              align: "start" as const,
            },
            {
              value: effectiveBidangCount,
              td: (
                <P fontSize={"sm"} whiteSpace={"nowrap"}>
                  {effectiveBidangCount > 0 ? (
                    <>
                      <TNum>{formatNumber(effectiveBidangCount)}</TNum>{" "}
                      {"bidang"}
                    </>
                  ) : (
                    "-"
                  )}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: effectiveKawasanHa,
              td: (
                <P fontSize={"sm"} whiteSpace={"nowrap"}>
                  {effectiveKawasanHa > 0 ? (
                    <>
                      <TNum>
                        {formatNumber(effectiveKawasanHa, {
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
              align: "start" as const,
            },
            {
              value: item.totalAmount,
              td: (
                <P>
                  <FormatNumber
                    value={item.totalAmount}
                    style={"currency"}
                    currency={"IDR"}
                    maximumFractionDigits={0}
                  />
                </P>
              ),
              align: "end" as const,
            },
          ],
        };
      });

    const itemActions: DataViewItemActionsGenerator<InternalTransactionItem>[] =
      [
        {
          key: "view-invoice",
          label: "Lihat Faktur",
          icon: ReceiptTextIcon,
          href: (transaction: InternalTransactionItem) =>
            transaction.invoiceUrl ?? undefined,
          target: "_blank",
          rel: "noopener noreferrer",
          hidden: (transaction: InternalTransactionItem) =>
            !transaction.invoiceUrl,
        },
        {
          key: "view-tte-invoice",
          label: "Lihat Faktur TTE",
          icon: FileCheckIcon,
          href: (transaction: InternalTransactionItem) =>
            transaction.tteInvoiceUrl ?? undefined,
          target: "_blank",
          rel: "noopener noreferrer",
          hidden: (transaction: InternalTransactionItem) =>
            !transaction.tteInvoiceUrl,
        },
        {
          key: "view-detail",
          label: "Detail",
          icon: EyeIcon,
          modal: {
            triggerComponent: (transaction: InternalTransactionItem) => (
              <TransactionDetailTrigger
                modalKey={`internal-tx-detail-${transaction.id}`}
                transaction={transaction}
                showPayButton={false}
              />
            ),
          },
        },
      ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [transactions.items, preferredTimezone, locale]);

  return (
    <Container.Root flex={1} withContext={true} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Body overflow={"clip"}>
        {/* Title Header */}
        <HeaderContainer>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Daftar Seluruh Transaksi"}</Heading>

            <InfoTip
              variant={"icon"}
              appIconProps={{
                size: "xs",
                color: "fg.subtle",
              }}
            >
              {
                "Monitoring dan kelola seluruh transaksi pembelian layer IGT oleh mitra ATR/BPN."
              }
            </InfoTip>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Filter Bar */}
        <ActionHeaderScrollContainer>
          <SearchInput
            placeholder={"Cari pesanan, mitra, billing..."}
            value={params.search}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({ ...prev, search: val, page: 1 }));
              })
            }
            maxW={"260px"}
          />

          <HStack align={"center"} gap={"xs"} minW={"auto"}>
            <StatusFilterSelect
              modalKey={"internal-tx-status-filter"}
              value={params.orderStatus ?? ""}
              options={ORDER_STATUS_WITH_WMS_FILTER_OPTIONS}
              placeholder={"Status Pesanan"}
              onValueChange={(val) => {
                const nextStatus = val ? (val as OrderStatus) : undefined;
                setSelectedOrderStatus(nextStatus);
                startTransition(() => {
                  setParams((prev) => ({
                    ...prev,
                    orderStatus: nextStatus,
                    page: 1,
                  }));
                });
              }}
              minW={"180px"}
            />

            {activeWmsConfig && (
              <HStack
                align={"center"}
                gap={"xs"}
                h={"40px"}
                px={"xs"}
                rounded={"md"}
                // border={"1px solid"}
                borderColor={"border.subtle"}
              >
                <InternalWmsStatusBadge
                  size={"xs"}
                  variant={"subtle"}
                  showIcon={true}
                >
                  {params.orderStatus}
                </InternalWmsStatusBadge>

                <Tooltip content={"Hapus filter Status WMS"}>
                  <IconButton
                    aria-label={"Hapus filter Status WMS"}
                    size={"2xs"}
                    variant={"ghost"}
                    color={"fg.subtle"}
                    rounded={"full"}
                    _hover={{
                      color: "fg",
                      bg: "bg.muted",
                    }}
                    onClick={() => {
                      resetFilter();
                      startTransition(() => {
                        setParams((prev) => ({
                          ...prev,
                          orderStatus: undefined,
                          page: 1,
                        }));
                      });
                    }}
                  >
                    <AppIcon icon={XIcon} boxSize={3} />
                  </IconButton>
                </Tooltip>
              </HStack>
            )}
          </HStack>
        </ActionHeaderScrollContainer>

        <Separator borderColor={"bg.canvas"} />

        <VStack flex={1} w={"full"} position={"relative"}>
          {isLoading ? (
            <Skeleton flex={1} w={"full"} minH={"300px"} p={"md"} rounded={0} />
          ) : isError ? (
            <Box
              flex={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              w={"full"}
              py={"xl"}
              bg={"bg.body"}
            >
              <StateRetry
                title={"Gagal Memuat Transaksi"}
                description={
                  error?.message ||
                  "Terjadi kesalahan saat memuat data statistik dan riwayat transaksi. Silakan coba lagi."
                }
                onRetry={() => {
                  void refetch();
                }}
              />
            </Box>
          ) : isEmptyArray(transactions.items) ? (
            <Box
              flex={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              w={"full"}
              py={"xl"}
              bg={"bg.body"}
            >
              {isSearching ? (
                <StateNoResult
                  query={searchQuery}
                  description={
                    "Tidak ada transaksi yang sesuai dengan kata kunci atau filter yang Anda pilih."
                  }
                />
              ) : (
                <StateNoData
                  icon={HistoryIcon}
                  title={"Belum Ada Transaksi"}
                  description={
                    "Belum ada data riwayat transaksi permintaan dari mitra."
                  }
                />
              )}
            </Box>
          ) : (
            <>
              <DataViewTable.Root
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
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
                currentDataLength={transactions.items.length}
                totalData={transactions.pagination.totalItems}
                totalPage={transactions.pagination.totalPages}
              />
            </>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
