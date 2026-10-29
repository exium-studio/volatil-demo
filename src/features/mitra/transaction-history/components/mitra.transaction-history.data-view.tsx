// src/features/mitra/transaction-history/components/mitra.transaction-history.data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
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
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useTransactionHistoryQuery } from "@/features/mitra/transaction-history/hooks/use-transaction-history";
import type {
  TransactionHistoryQueryParams,
  TransactionRecord,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { OrderedIgtLayers } from "@/features/shared/components/ordered-igt-layers";
import { PaymentMethodBadge } from "@/features/shared/components/payment-method.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TransactionDetailTrigger } from "@/features/shared/components/transaction-detail.modal";
import { TteBadge } from "@/features/shared/components/tte.badge";
import {
  ORDER_STATUS_FILTER_OPTIONS,
  ORDER_STATUS_MAP,
} from "@/features/shared/constants/volatil.ssot-map";
import type { OrderStatus } from "@/shared/types/status.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatRelativeTime,
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  CreditCardIcon,
  EyeIcon,
  FileCheckIcon,
  HistoryIcon,
  ReceiptTextIcon,
  SquarePen,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Countdown } from "@/design-system/components/data-display/ui/countdown";

const ITEMS_PER_PAGE_DEFAULT = DEFAULT_PAGE_SIZE_OPTIONS[0];

export const TransactionHistoryDataView = () => {
  // Navigation
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<TransactionHistoryQueryParams>({
    page: 1,
    pageSize: ITEMS_PER_PAGE_DEFAULT,
    search: "",
    status: undefined,
  });

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "", 300);
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const isSearching = Boolean(debouncedSearch.trim() || params.status);
  const searchQuery = useMemo(() => {
    const parts: string[] = [];
    if (debouncedSearch.trim()) {
      parts.push(debouncedSearch.trim());
    }
    if (params.status) {
      const statusConfig = ORDER_STATUS_MAP[params.status];
      parts.push(statusConfig?.label ?? params.status);
    }
    return parts.length > 0 ? parts.join(", ") : "...";
  }, [debouncedSearch, params.status]);

  // Queries
  const { transactionHistory, isLoading, isFetching, isError, error, refetch } =
    useTransactionHistoryQuery({
      page: params.page,
      pageSize: params.pageSize,
      search: debouncedSearch || undefined,
      status: params.status,
    });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Tanggal Pengajuan", sortable: true, align: "start" },
      { th: "No. Pesanan", sortable: true, align: "start" },
      { th: "Status Pesanan", sortable: true, align: "start" },
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

    const items: FormattedListItem<TransactionRecord>[] =
      transactionHistory.items.map((item: TransactionRecord) => {
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
            .reduce((sum, it) => sum + (it.featuresCount ?? 0), 0);

        const effectiveKawasanHa =
          item.kawasanCoverageHa ??
          item.coverageHa ??
          item.items
            .filter((i) => (i.spatialBasis as string) === "kawasan")
            .reduce((sum, it) => sum + (it.areaHa ?? 0), 0);

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.createdAt,
              td: (
                <HStack gap={2} whiteSpace={"nowrap"}>
                  <P>{formatUtcDateTime(item.createdAt, preferredTimezone)}</P>
                  {item.createdAt && (
                    <P color={"fg.subtle"} fontSize={"xs"}>
                      {`(${formatRelativeTime(item.createdAt)})`}
                    </P>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.orderNumber,
              td: <P>{item.orderNumber}</P>,
              align: "start" as const,
            },
            {
              value: effectiveOrderStatus ?? "",
              td: effectiveOrderStatus ? (
                <OrderStatusBadge showIcon={true}>
                  {effectiveOrderStatus}
                </OrderStatusBadge>
              ) : (
                <P color={"fg.subtle"}>{"-"}</P>
              ),
              align: "start" as const,
            },
            {
              value: item.billingCode,
              td: (
                <P>
                  <TNum>{item.billingCode}</TNum>
                </P>
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
                  <P color={"fg.subtle"}>{"-"}</P>
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
                  orderNumber={item.orderNumber}
                  coverageHa={effectiveKawasanHa ?? undefined}
                  bidangCoverageCount={effectiveBidangCount ?? undefined}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.items.length,
              td: <P whiteSpace={"nowrap"}>{`${item.items.length} Layer`}</P>,
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
                <P whiteSpace={"nowrap"}>
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
                <P whiteSpace={"nowrap"}>
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

    const itemActions: DataViewItemActionsGenerator<TransactionRecord>[] = [
      {
        key: "pay-billing",
        label: "Bayar",
        icon: CreditCardIcon,
        colorPalette: "blue",
        hidden: (transaction: TransactionRecord) =>
          transaction.orderStatus !== "pending_payment" ||
          transaction.transactionStatus === "expired",
        onClick: (transaction: TransactionRecord) => {
          if (transaction.billingCode) {
            void navigate({
              to: "/mitra/billing/$billingCode",
              params: { billingCode: transaction.billingCode },
              search: { orderId: transaction.orderId || transaction.id },
            });
          }
        },
      },

      {
        key: "view-invoice",
        label: "Lihat Faktur",
        icon: ReceiptTextIcon,
        href: (transaction: TransactionRecord) =>
          transaction.invoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (transaction: TransactionRecord) => !transaction.invoiceUrl,
      },

      {
        key: "view-tte-invoice",
        label: "Lihat Faktur TTE",
        icon: FileCheckIcon,
        href: (transaction: TransactionRecord) =>
          transaction.tteInvoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (transaction: TransactionRecord) => !transaction.tteInvoiceUrl,
      },

      {
        key: "view-detail",
        label: "Detail",
        icon: EyeIcon,
        modal: {
          triggerComponent: (transaction: TransactionRecord) => (
            <TransactionDetailTrigger
              modalKey={`transaction-detail-${transaction.id}`}
              transaction={transaction}
              showPayButton={true}
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
  }, [transactionHistory.items, preferredTimezone, navigate]);

  return (
    <VStack flex={1} overflowY={"auto"} w={"full"}>
      {/* Header Controls */}
      <ActionHeaderScrollContainer>
        <SearchInput
          value={params.search}
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari no. pesanan / billing..."}
          maxW={"300px"}
        />

        <HStack gap={"sm"}>
          <StatusFilterSelect
            modalKey={"transaction-history-status-filter"}
            placeholder={"Status"}
            options={ORDER_STATUS_FILTER_OPTIONS}
            value={params.status ?? ""}
            onValueChange={(value) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: (value as OrderStatus) || undefined,
                  page: 1,
                }));
              });
            }}
            minW={"150px"}
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
        bg={"bg.canvas"}
        w={"full"}
      >
        {isLoading ? (
          <Skeleton minH={"300px"} p={"md"} rounded={0} />
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
              title={"Gagal Memuat Riwayat Transaksi"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat daftar riwayat transaksi Anda. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Box>
        ) : isEmptyArray(transactionHistory.items) ? (
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
                title={"Belum Ada Riwayat Transaksi"}
                description={
                  "Anda belum pernah melakukan transaksi permintaan data IGT. Silakan ajukan permintaan data terlebih dahulu."
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
                  {"Permintaan Data"}
                </Button>
              </StateNoData>
            )}
          </Box>
        ) : (
          <VStack flex={1} w={"full"} position={"relative"} overflowY={"auto"}>
            <TopBarLoader isFetching={isFetching} />

            <DataViewTable.Root<TransactionRecord>
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
              currentDataLength={transactionHistory.items.length}
              totalData={transactionHistory.pagination.totalItems}
              totalPage={transactionHistory.pagination.totalPages}
            />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
