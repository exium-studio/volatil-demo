// src/features/mitra/transaction-history/components/transaction-history.data-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  TRANSACTION_STATUS_BADGE_MAP,
  TRANSACTION_STATUS_OPTIONS,
} from "@/features/mitra/transaction-history/constants/transaction-history.config";
import { TransactionDetailTrigger } from "@/features/mitra/transaction-history/components/transaction-history.detail.modal";
import { useTransactionHistoryQuery } from "@/features/mitra/transaction-history/hooks/use-transaction-history";
import type {
  TransactionHistoryQueryParams,
  TransactionRecord,
  TransactionStatus,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useNavigate } from "@tanstack/react-router";
import { EyeIcon, HistoryIcon, SquarePen } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

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

  // Queries
  const { transactionHistory, isLoading, isFetching } =
    useTransactionHistoryQuery({
      page: params.page,
      pageSize: params.pageSize,
      search: debouncedSearch || undefined,
      status: params.status,
    });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Transaksi", sortable: true, align: "start" },
      { th: "No. Order", sortable: true, align: "start" },
      { th: "Status", sortable: true, align: "start" },
      { th: "Kode Billing", sortable: false, align: "start" },
      { th: "Waktu Transaksi", sortable: true, align: "start" },
      { th: "Metode", sortable: false, align: "start" },
      { th: "IGT Dibeli", sortable: false, align: "start" },
      { th: "Total Nominal", sortable: true, align: "end" },
    ];

    const items: FormattedListItem<TransactionRecord>[] =
      transactionHistory.items.map((item: TransactionRecord) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");
        const statusConfig = TRANSACTION_STATUS_BADGE_MAP[
          item.transactionStatus
        ] ?? {
          label: item.transactionStatus,
          colorPalette: "gray" as const,
        };

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.transactionNumber,
              td: <P fontWeight={"semibold"}>{item.transactionNumber}</P>,
              align: "start" as const,
            },
            {
              value: item.orderNumber,
              td: <P color={"fg.muted"}>{item.orderNumber}</P>,
              align: "start" as const,
            },
            {
              value: item.transactionStatus,
              td: (
                <Badge
                  colorPalette={statusConfig.colorPalette}
                  variant={"subtle"}
                >
                  {statusConfig.label}
                </Badge>
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
              value: item.createdAt,
              td: (
                <P whiteSpace={"nowrap"}>
                  {formatUtcDateTime(item.createdAt, preferredTimezone)}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.paymentMethod,
              td: item.paymentMethod ? (
                <Badge variant={"subtle"} colorPalette={"gray"}>
                  {item.paymentMethod}
                </Badge>
              ) : (
                "-"
              ),
              align: "start" as const,
            },
            {
              value: itemNames,
              td: (
                <VStack align={"start"} w={"200px"}>
                  <ClampedP title={itemNames}>{itemNames || "-"}</ClampedP>
                  <HStack gap={"xs"} align={"center"}>
                    <ClampedP fontSize={"xs"} color={"fg.subtle"}>
                      {`${item.items.length} Layer IGT`}
                    </ClampedP>
                    <SelectionTypeBadge size={"xs"}>
                      {item.selectionType}
                    </SelectionTypeBadge>
                  </HStack>
                </VStack>
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

    const itemActions: DataViewItemActionsGenerator<TransactionRecord>[] = [
      {
        key: "view-detail",
        label: "Detail",
        icon: EyeIcon,
        modal: {
          triggerComponent: (transaction: TransactionRecord) => (
            <TransactionDetailTrigger
              modalKey={`transaction-detail-${transaction.id}`}
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
  }, [transactionHistory.items, preferredTimezone]);

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
          value={params.search}
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari no. transaksi / order / billing..."}
          maxW={"300px"}
        />

        <HStack wrap={"wrap"} gap={"sm"}>
          <StatusFilterSelect
            modalKey={"transaction-history-status-filter"}
            placeholder={"Status"}
            options={TRANSACTION_STATUS_OPTIONS}
            value={params.status ?? ""}
            onValueChange={(value) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: (value as TransactionStatus) || undefined,
                  page: 1,
                }));
              });
            }}
            w={"200px"}
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
        ) : isEmptyArray(transactionHistory.items) ? (
          <Box
            flex={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
          >
            {debouncedSearch || params.status ? (
              <NoResultState
                description={
                  "Tidak ada transaksi yang sesuai dengan kata kunci atau filter yang Anda pilih."
                }
              />
            ) : (
              <NoDataState
                icon={HistoryIcon}
                title={"Belum Ada Riwayat Transaksi"}
                description={
                  "Anda belum pernah melakukan transaksi permohonan data IGT. Silakan ajukan permohonan data terlebih dahulu."
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
          </Box>
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataView.Table.Root<TransactionRecord>
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
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
              currentDataLength={transactionHistory.items.length}
              totalData={transactionHistory.pagination.totalItems}
              totalPage={transactionHistory.pagination.totalPages}
              roundedBottom={0}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
