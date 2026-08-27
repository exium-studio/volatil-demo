// src/features/mitra/transaction-history/components/transaction-history.data-list.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  TRANSACTION_STATUS_BADGE_MAP,
  TRANSACTION_STATUS_OPTIONS,
} from "@/features/mitra/transaction-history/constants/transaction-history.config";
import { TransactionDetailTrigger } from "@/features/mitra/transaction-history/components/transaction-history.detail-modal";
import { useTransactionHistoryQuery } from "@/features/mitra/transaction-history/hooks/use-transaction-history";
import type {
  TransactionRecord,
  TransactionStatus,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { EyeIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const TransactionHistoryDataView = () => {
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
  const { transactionHistory, isLoading, isFetching } =
    useTransactionHistoryQuery({
      page,
      pageSize,
      search: debouncedSearch || undefined,
      status: (status as TransactionStatus) || undefined,
    });

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Transaksi", sortable: true, align: "start" },
      { th: "No. Order", sortable: true, align: "start" },
      { th: "Kode Billing", sortable: false, align: "start" },
      { th: "Waktu Transaksi", sortable: true, align: "start" },
      { th: "Metode", sortable: false, align: "start" },
      { th: "Item Order", sortable: false, align: "start" },
      { th: "Total Nominal", sortable: true, align: "end" },
      { th: "Status", sortable: true, align: "start" },
    ];

    const items: FormattedListItem<TransactionRecord>[] =
      transactionHistory.items.map((item: TransactionRecord) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");
        const statusConfig = TRANSACTION_STATUS_BADGE_MAP[item.transactionStatus] ?? {
          label: item.transactionStatus,
          colorPalette: "gray" as const,
        };

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.transactionNumber,
              td: (
                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {item.transactionNumber}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.orderNumber,
              td: (
                <P fontSize={"sm"} color={"fg.muted"}>
                  {item.orderNumber}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.billingCode,
              td: (
                <P fontSize={"sm"}>
                  <TNum>{item.billingCode}</TNum>
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.createdAt,
              td: (
                <P fontSize={"sm"} whiteSpace={"nowrap"}>
                  {formatUtcDateTime(item.createdAt, preferredTimezone)}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.paymentMethod,
              td: (
                <Badge variant={"subtle"} colorPalette={"gray"}>
                  {item.paymentMethod}
                </Badge>
              ),
              align: "start" as const,
            },
            {
              value: itemNames,
              td: (
                <VStack align={"start"} gap={0} maxW={"220px"}>
                  <P fontSize={"sm"} truncate title={itemNames}>
                    {itemNames || "-"}
                  </P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {`${item.items.length} Layer IGT`}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: item.totalAmount,
              td: (
                <P fontSize={"sm"} fontWeight={"medium"}>
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
            {
              value: item.transactionStatus,
              td: (
                <Badge colorPalette={statusConfig.colorPalette} variant={"subtle"}>
                  {statusConfig.label}
                </Badge>
              ),
              align: "start" as const,
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
          value={searchRaw}
          onValueChange={(val) => {
            setSearchRaw(val);
            setPage(1);
          }}
          placeholder={"Cari no. transaksi / order / billing..."}
          maxW={"300px"}
        />

        <HStack wrap={"wrap"} gap={"sm"}>
          <StatusSelect
            modalKey={"transaction-history-status-filter"}
            placeholder={"Status"}
            options={TRANSACTION_STATUS_OPTIONS}
            value={status}
            onValueChange={(value) => {
              startTransition(() => {
                setStatus(value);
                setPage(1);
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
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataView.Table.Root<TransactionRecord>
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
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
              currentDataLength={transactionHistory.items.length}
              totalData={transactionHistory.pagination.totalItems}
              totalPage={transactionHistory.pagination.totalPages}
              roundedBottom={0}
              shadow={"none"}
            />
          </Box>
        )}
      </VStack>
    </VStack>
  );
};
