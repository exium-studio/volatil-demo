// src/features/mitra/home/components/mitra.home.last-transaction.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";
import type {
  DataStatus,
  MitraHomeLastTransactionProps,
  ThemeCategory,
  ThemeType,
  TransactionItem,
  TransactionStatus,
} from "@/features/mitra/home/types/mitra.home.last-transaction.type";
import { useMemo } from "react";

const TRANSACTION_STATUS_MAP: Record<
  TransactionStatus,
  { label: string; color: string }
> = {
  success: { label: "Berhasil", color: "green" },
  pending: { label: "Sedang Proses", color: "orange" },
  failed: { label: "Gagal", color: "red" },
};

const THEME_TYPE_MAP: Record<ThemeType, { label: string; color: string }> = {
  rtr: { label: "Rencana Tata Ruang", color: "blue" },
  boundary: { label: "Batas Wilayah", color: "purple" },
  land: { label: "Pertanahan", color: "orange" },
};

const DATA_STATUS_MAP: Record<DataStatus, { label: string; color: string }> = {
  active: { label: "Aktif", color: "green" },
  inactive: { label: "Non-Aktif", color: "red" },
};

const THEME_CATEGORY_MAP: Record<
  ThemeCategory,
  { label: string; color: string }
> = {
  spatial: { label: "Tata Ruang", color: "teal" },
  land: { label: "Pertanahan", color: "indigo" },
};

export const MitraHomeLastTransaction = (
  props: MitraHomeLastTransactionProps,
) => {
  return (
    <Container.Root withContext={true} {...props}>
      <Container.Body pb={"md"}>
        <MitraHomeLastTransactionHeader />

        <Separator borderColor={"bg.canvas"} />

        <MitraHomeLastTransactionDataList />
      </Container.Body>
    </Container.Root>
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
        <Heading>
          {"Transaksi Terakhir"}
        </Heading>

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
    </HStack>
  );
};

const MitraHomeLastTransactionDataList = () => {
  // Queries / Data
  const { lastTransactions } = useMitraHomeData();

  // Derived Values
  const headers = useMemo<FormattedTableHeader[]>(
    () => [
      { th: "ID Transaksi", sortable: false, align: "start" },
      { th: "Username", sortable: false, align: "start" },
      { th: "Tanggal Transaksi", sortable: false, align: "start" },
      { th: "Status Transaksi", sortable: false, align: "center" },
      { th: "Nama Data IGT-PR", sortable: false, align: "start" },
      { th: "Jenis Tema IGT-PR", sortable: false, align: "center" },
      { th: "Link API WPS", sortable: false, align: "start" },
      { th: "API WPS", sortable: false, align: "start" },
      { th: "Sisa Waktu", sortable: false, align: "start" },
      { th: "Status Data", sortable: false, align: "center" },
      { th: "Sisa Kuota", sortable: false, align: "start" },
      { th: "Kategori Tema IGT-PR", sortable: false, align: "center" },
      { th: "Deskripsi Data", sortable: false, align: "start" },
      { th: "Total Harga", sortable: false, align: "end" },
    ],
    [],
  );

  const items = useMemo<FormattedListItem[]>(() => {
    return lastTransactions.map((item: TransactionItem) => ({
      id: item.id,
      data: item,
      columns: [
        {
          value: item.transactionNo,
          td: <P>{item.transactionNo}</P>,
          align: "start",
        },
        {
          value: item.username,
          td: <P>{item.username}</P>,
          align: "start",
        },
        {
          value: item.date,
          td: <P>{item.date}</P>,
          align: "start",
        },
        {
          value: item.status,
          td: (
            <Badge
              colorPalette={TRANSACTION_STATUS_MAP[item.status].color}
              variant={"subtle"}
            >
              {TRANSACTION_STATUS_MAP[item.status].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.dataName,
          td: <P>{item.dataName}</P>,
          align: "start",
        },
        {
          value: item.themeType,
          td: (
            <Badge
              colorPalette={THEME_TYPE_MAP[item.themeType].color}
              variant={"subtle"}
            >
              {THEME_TYPE_MAP[item.themeType].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.apiLink,
          td: <P>{item.apiLink}</P>,
          align: "start",
        },
        {
          value: item.apiWps,
          td: <P>{item.apiWps}</P>,
          align: "start",
        },
        {
          value: item.timeLeft,
          td: <P>{item.timeLeft}</P>,
          align: "start",
        },
        {
          value: item.dataStatus,
          td: (
            <Badge
              colorPalette={DATA_STATUS_MAP[item.dataStatus].color}
              variant={"subtle"}
            >
              {DATA_STATUS_MAP[item.dataStatus].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.quota,
          td: <P>{item.quota}</P>,
          align: "start",
        },
        {
          value: item.themeCategory,
          td: (
            <Badge
              colorPalette={THEME_CATEGORY_MAP[item.themeCategory].color}
              variant={"subtle"}
            >
              {THEME_CATEGORY_MAP[item.themeCategory].label}
            </Badge>
          ),
          align: "center",
        },
        {
          value: item.description,
          td: <P>{item.description}</P>,
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
