// src/features/mitra/home/components/mitra.home.last-transaction.tsx

// src\features\mitra\home\components\mitra.home.last-transaction.tsx

// src\features\mitra\home\components\mitra.home.last-transaction.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import type { MitraHomeLastTransactionProps } from "@/features/mitra/home/types/mitra.home.last-transaction.type";
import { useTransactionHistoryQuery } from "@/features/mitra/transaction-history/hooks/use-transaction-history";
import type { TransactionRecord } from "@/features/mitra/transaction-history/types/transaction-history.type";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { PaymentMethodBadge } from "@/features/shared/components/payment-method.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { TransactionDetailTrigger } from "@/features/shared/components/transaction-detail.modal";
import type { OrderStatus } from "@/shared/types/status.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CreditCardIcon,
  EyeIcon,
  HistoryIcon,
} from "lucide-react";
import { useMemo } from "react";

export const MitraHomeLastTransaction = (
  props: MitraHomeLastTransactionProps,
) => {
  return (
    <Container.Root withContext={true} {...props}>
      <MitraHomeLastTransactionContent />
    </Container.Root>
  );
};

const MitraHomeLastTransactionContent = () => {
  // Navigation
  const navigate = useNavigate();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { transactionHistory, isLoading, isFetching, isError, error, refetch } =
    useTransactionHistoryQuery({
      page: 1,
      pageSize: 5,
    });

  if (isLoading) {
    return <Skeleton minH={"380px"} w={"full"} />;
  }

  return (
    <Container.Body pb={"md"}>
      <MitraHomeLastTransactionHeader />

      <Separator borderColor={"bg.canvas"} />

      <MitraHomeLastTransactionDataView
        transactionHistory={transactionHistory}
        isFetching={isFetching}
        isError={isError}
        error={error}
        refetch={refetch}
        preferredTimezone={preferredTimezone}
        navigate={navigate}
      />
    </Container.Body>
  );
};

const MitraHomeLastTransactionHeader = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={"md"}
      p={"md"}
    >
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Transaksi Terakhir"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Daftar 5 transaksi terbaru dari akun Anda"}
        </InfoTip>
      </HStack>

      <Button asChild={true} variant={"ghost"} size={"xs"}>
        <Link to={"/mitra/transaction-history"}>
          {"Lihat Semua"}
          <AppIcon icon={ArrowRightIcon} />
        </Link>
      </Button>
    </HStack>
  );
};

const MitraHomeLastTransactionDataView = (props: {
  transactionHistory: { items: TransactionRecord[] };
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  preferredTimezone: string;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  // Props
  const {
    transactionHistory,
    isFetching,
    isError,
    error,
    refetch,
    preferredTimezone,
    navigate,
  } = props;

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "No. Transaksi", sortable: false, align: "start" },
      { th: "No. Pesanan", sortable: false, align: "start" },
      { th: "Status Pesanan", sortable: false, align: "start" },
      { th: "Kode Billing", sortable: false, align: "start" },
      { th: "Waktu Transaksi", sortable: false, align: "start" },
      { th: "Metode", sortable: false, align: "start" },
      { th: "IGT Dibeli", sortable: false, align: "start" },
      { th: "Jumlah Layer", sortable: false, align: "start" },
      { th: "Tipe Seleksi", sortable: false, align: "start" },
      { th: "Total Nominal", sortable: false, align: "end" },
    ];

    const items: FormattedListItem<TransactionRecord>[] =
      transactionHistory.items.map((item: TransactionRecord) => {
        const itemNames = item.items
          .map((it) => it.sourceLayerTitle)
          .join(", ");

        const effectiveOrderStatus: OrderStatus | undefined =
          item.transactionStatus === "expired" &&
          (!item.orderStatus || item.orderStatus === "pending_payment")
            ? "rejected"
            : item.orderStatus;

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
              td: <PaymentMethodBadge>{item.paymentMethod}</PaymentMethodBadge>,
              align: "start" as const,
            },
            {
              value: itemNames,
              td: (
                <Tooltip content={itemNames || "-"}>
                  <P lineClamp={2} w={"220px"} title={itemNames}>
                    {itemNames || "-"}
                  </P>
                </Tooltip>
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
        key: "pay-billing",
        label: "Bayar",
        icon: CreditCardIcon,
        hidden: (transaction: TransactionRecord) =>
          transaction.transactionStatus !== "pending",
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
    <VStack bg={"bg.canvas"} w={"full"} position={"relative"}>
      {isError ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          py={"xl"}
          bg={"bg.body"}
        >
          <RetryState
            title={"Gagal Memuat Riwayat Transaksi"}
            description={
              error?.message ||
              "Terjadi kesalahan saat memuat transaksi terbaru. Silakan coba lagi."
            }
            onRetry={() => {
              void refetch();
            }}
          />
        </Box>
      ) : isEmptyArray(transactionHistory.items) ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          py={"xl"}
          bg={"bg.body"}
        >
          <NoDataState
            icon={HistoryIcon}
            title={"Belum Ada Riwayat Transaksi"}
            description={
              "Anda belum memiliki riwayat transaksi permintaan data."
            }
          />
        </Box>
      ) : (
        <VStack w={"full"} position={"relative"}>
          <TopBarLoader isFetching={isFetching} />

          <DataViewTable.Root<TransactionRecord>
            headers={dataList.headers}
            items={dataList.items}
            itemActions={dataList.itemActions}
            withNumbering={true}
            page={1}
            pageSize={5}
            roundedTop={0}
          >
            <DataViewTable.Header />
            <DataViewTable.Body />
          </DataViewTable.Root>
        </VStack>
      )}
    </VStack>
  );
};
