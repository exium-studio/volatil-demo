// src/features/internal/statistik-pesanan/components/internal.transaction-statistic.data-view.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { InternalTransactionDetailTrigger } from "@/features/internal/statistik-pesanan/components/internal.transaction-detail.modal";
import { useInternalTransactionsQuery } from "@/features/internal/statistik-pesanan/hooks/use-internal-transaction-statistic.query";
import type {
  InternalTransactionItem,
  InternalTransactionQueryParams,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { TransactionStatusBadge } from "@/features/shared/components/transaction-status.badge";
import { TRANSACTION_STATUS_OPTIONS } from "@/features/shared/constants/volatil.ssot-map";
import { useLocale } from "@/shared/libs/i18n/locale-provider";
import type { TransactionStatus } from "@/shared/types/status.type";
import {
  formatAdaptiveDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { isEmptyArray } from "@/shared/utils/data/array";
import { EyeIcon, HistoryIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const ITEMS_PER_PAGE_DEFAULT = DEFAULT_PAGE_SIZE_OPTIONS[0];

export const InternalTransactionStatisticDataView = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query parameters
  const [params, setParams] = useState<InternalTransactionQueryParams>({
    page: 1,
    pageSize: ITEMS_PER_PAGE_DEFAULT,
    search: "",
    transactionStatus: undefined,
  });

  // Stores & Hooks
  const { locale } = useLocale();
  const debouncedSearch = useDebouncedValue(params.search ?? "", 300);
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { transactions, isLoading, isFetching } = useInternalTransactionsQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: debouncedSearch || undefined,
    transactionStatus: params.transactionStatus,
  });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Transaksi", sortable: true, align: "start" },
      { th: "Mitra Pemohon", sortable: true, align: "start" },
      { th: "No. Order", sortable: true, align: "start" },
      { th: "Status Transaksi", sortable: true, align: "start" },
      { th: "Kode Billing", sortable: false, align: "start" },
      { th: "Waktu Transaksi", sortable: true, align: "start" },
      { th: "Metode", sortable: false, align: "start" },
      { th: "IGT Dibeli", sortable: false, align: "start" },
      { th: "Jumlah Layer", sortable: false, align: "start" },
      { th: "Tipe Seleksi", sortable: false, align: "start" },
      { th: "Total Nominal", sortable: true, align: "end" },
    ];

    const items: FormattedListItem<InternalTransactionItem>[] =
      transactions.items.map((item: InternalTransactionItem) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.transactionNumber,
              td: (
                <P fontWeight={"semibold"} fontSize={"sm"}>
                  {item.transactionNumber}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.mitra.name,
              td: (
                <VStack align={"start"} gap={0} w={"180px"}>
                  <ClampedP fontWeight={"medium"} fontSize={"sm"}>
                    {item.mitra.name}
                  </ClampedP>
                  <ClampedP fontSize={"xs"} color={"fg.subtle"}>
                    {item.mitra.agencyOrCompany || item.mitra.email}
                  </ClampedP>
                </VStack>
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
              value: item.transactionStatus,
              td: (
                <TransactionStatusBadge showIcon={true} size={"xs"}>
                  {item.transactionStatus}
                </TransactionStatusBadge>
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
              value: item.createdAt,
              td: (
                <P fontSize={"sm"} color={"fg.muted"}>
                  {formatAdaptiveDateTime(item.createdAt, {
                    timeZone: preferredTimezone,
                    locale,
                  })}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.paymentMethod,
              td: (
                <P fontSize={"sm"} color={"fg.muted"}>
                  {item.paymentMethod || "-"}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: itemNames,
              td: (
                <Tooltip content={itemNames || "-"}>
                  <P
                    fontSize={"sm"}
                    lineClamp={2}
                    w={"220px"}
                    title={itemNames}
                  >
                    {itemNames || "-"}
                  </P>
                </Tooltip>
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
              value: item.totalAmount,
              td: (
                <P fontWeight={"medium"}>
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
          key: "view-detail",
          label: "Detail",
          icon: EyeIcon,
          modal: {
            triggerComponent: (transaction: InternalTransactionItem) => (
              <InternalTransactionDetailTrigger
                modalKey={`internal-tx-detail-${transaction.id}`}
                transaction={transaction}
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
            placeholder={"Cari transaksi, mitra, billing..."}
            value={params.search}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({ ...prev, search: val, page: 1 }));
              })
            }
            maxW={"260px"}
          />

          <StatusFilterSelect
            modalKey={"internal-tx-status-filter"}
            value={params.transactionStatus ?? ""}
            options={TRANSACTION_STATUS_OPTIONS}
            placeholder={"Semua Status"}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  transactionStatus: val
                    ? (val as TransactionStatus)
                    : undefined,
                  page: 1,
                }));
              })
            }
            w={"170px"}
          />
        </ActionHeaderScrollContainer>

        <Separator borderColor={"bg.canvas"} />

        <VStack flex={1} w={"full"} position={"relative"}>
          {isLoading ? (
            <Skeleton flex={1} w={"full"} p={"md"} rounded={0} />
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
              {debouncedSearch || params.transactionStatus ? (
                <NoResultState
                  query={debouncedSearch || undefined}
                  description={
                    "Tidak ada transaksi yang sesuai dengan kata kunci atau filter yang Anda pilih."
                  }
                />
              ) : (
                <NoDataState
                  icon={HistoryIcon}
                  title={"Belum Ada Transaksi"}
                  description={
                    "Belum ada data riwayat transaksi permohonan dari mitra."
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
