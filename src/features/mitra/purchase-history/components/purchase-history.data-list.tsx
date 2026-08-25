// src/features/mitra/purchase-history/components/purchase-history.data-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { PurchaseHistoryDetailModal } from "@/features/mitra/purchase-history/components/purchase-history.detail-modal";
import { usePurchaseHistoryQuery } from "@/features/mitra/purchase-history/hooks/use-purchase-history";
import type {
  TransactionRecord,
  TransactionStatus,
} from "@/features/mitra/purchase-history/types/purchase-history.type";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { EyeIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const TRANSACTION_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Selesai (Lunas)", value: "settled" },
  { label: "Menunggu Pembayaran", value: "pending" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Gagal", value: "failed" },
];

const STATUS_BADGE_MAP: Record<
  TransactionStatus,
  { label: string; color: string }
> = {
  settled: { label: "Selesai", color: "green" },
  pending: { label: "Menunggu", color: "orange" },
  expired: { label: "Kedaluwarsa", color: "red" },
  failed: { label: "Gagal", color: "red" },
};

export const PurchaseHistoryDataList = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE_OPTIONS[0]);
  const [status, setStatus] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionRecord | null>(null);

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { purchaseHistory, isLoading, isFetching } = usePurchaseHistoryQuery({
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
      { th: "Metode", sortable: false, align: "center" },
      { th: "Item Order", sortable: false, align: "start" },
      { th: "Total Nominal", sortable: true, align: "end" },
      { th: "Status", sortable: true, align: "center" },
      { th: "Aksi", sortable: false, align: "center" },
    ];

    const items: FormattedListItem[] = purchaseHistory.items.map(
      (item: TransactionRecord) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");
        const statusConfig = STATUS_BADGE_MAP[item.transactionStatus] ?? {
          label: item.transactionStatus,
          color: "gray",
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
              align: "center" as const,
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
                <Badge
                  colorPalette={statusConfig.color}
                  variant={"subtle"}
                >
                  {statusConfig.label}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.id,
              td: (
                <Button
                  size={"xs"}
                  variant={"outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTransaction(item);
                  }}
                >
                  <AppIcon icon={EyeIcon} size={"xs"} />
                  {"Detail"}
                </Button>
              ),
              align: "center" as const,
            },
          ],
        };
      },
    );

    return {
      headers,
      items,
      batchActions: [],
      itemActions: [],
    };
  }, [purchaseHistory.items, preferredTimezone]);

  return (
    <VStack w={"full"}>
      {/* Header Controls */}
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"start"}
        gap={SPACING.sm}
        w={"full"}
        p={SPACING.md}
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

        <HStack wrap={"wrap"} gap={SPACING.sm}>
          <StatusSelect
            modalKey={"purchase-history-status-filter"}
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
        gap={SPACING.sm}
        overflowY={"auto"}
        bg={"bg.canvas"}
        w={"full"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={SPACING.md} rounded={0} />
        ) : (
          <Box w={"full"} position={"relative"} overflowY={"auto"}>
            <DataListTable.Root
              headers={dataList.headers}
              items={dataList.items}
              withNumbering={true}
              page={page}
              pageSize={pageSize}
              rounded={0}
              pb={0}
              shadow={"none"}
            >
              <DataListTable.Header />
              <DataListTable.Body />
            </DataListTable.Root>

            <TopBarLoader isFetching={isFetching} />

            <DataListFooter
              page={page}
              pageSize={pageSize}
              setPage={(nextPage) => setPage(nextPage)}
              setPageSize={(nextSize) => {
                setPageSize(nextSize);
                setPage(1);
              }}
              currentDataLength={purchaseHistory.items.length}
              totalData={purchaseHistory.pagination.totalItems}
              totalPage={purchaseHistory.pagination.totalPages}
              roundedBottom={0}
              shadow={"none"}
            />
          </Box>
        )}
      </VStack>

      {/* Detail Modal */}
      <PurchaseHistoryDetailModal
        transaction={selectedTransaction}
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
      />
    </VStack>
  );
};
