// src/features/home/components/home.last-transaction.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import type { TransactionStatus } from "@/features/home/types/home.last-transaction.type";
import { homeData } from "@/shared/constants/dummy-data";
import { useMemo } from "react";

const statusColors: Record<TransactionStatus, string> = {
  success: "green",
  pending: "orange",
  failed: "red",
};

const statusLabels: Record<TransactionStatus, string> = {
  success: "Berhasil",
  pending: "Menunggu",
  failed: "Gagal",
};

export const HomeLastTransaction = () => {
  return (
    <Container.Root flex={"1 1 100%"} withContext={true}>
      <Container.Body pb={PADDING_MD}>
        <Header />

        <Separator borderColor={"bg.canvas"} />

        <DataList />
      </Container.Body>
    </Container.Root>
  );
};

const Header = () => {
  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING_MD}
      p={PADDING_MD}
    >
      <VStack gap={1} align={"start"}>
        <P>Transaksi Terakhir</P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          Daftar 5 transaksi terbaru dari akun Anda
        </P>
      </VStack>
    </HStack>
  );
};

const DataList = () => {
  const lastTransactions = homeData.lastTransactions;

  const headers = useMemo<FormattedTableHeader[]>(
    () => [
      { th: "No. Transaksi", sortable: false, align: "start" },
      { th: "Tanggal", sortable: false, align: "start" },
      { th: "Deskripsi", sortable: false, align: "start" },
      { th: "Metode Pembayaran", sortable: false, align: "start" },
      { th: "Total", sortable: false, align: "end" },
      { th: "Status", sortable: false, align: "center" },
    ],
    [],
  );

  const items = useMemo<FormattedListItem[]>(() => {
    return lastTransactions.map((item) => ({
      id: item.id,
      data: item,
      columns: [
        {
          value: item.transactionNo,
          td: <P>{item.transactionNo}</P>,
          align: "start",
        },
        {
          value: item.date,
          td: <P>{item.date}</P>,
          align: "start",
        },
        {
          value: item.description,
          td: <P>{item.description}</P>,
          align: "start",
        },
        {
          value: item.paymentMethod,
          td: <P>{item.paymentMethod}</P>,
          align: "start",
        },
        {
          value: item.amount,
          td: (
            <FormatNumber
              value={item.amount}
              style={"currency"}
              currency={"IDR"}
              maximumFractionDigits={0}
            />
          ),
          align: "end",
        },
        {
          value: item.status,
          td: (
            <Badge colorPalette={statusColors[item.status]} variant={"subtle"}>
              {statusLabels[item.status]}
            </Badge>
          ),
          align: "center",
        },
      ],
    }));
  }, [lastTransactions]);

  return (
    <VStack bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        headers={headers}
        items={items}
        roundedTop={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>
    </VStack>
  );
};
