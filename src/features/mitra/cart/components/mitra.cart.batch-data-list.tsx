// src/features/mitra/cart/components/mitra.cart.batch-data-list.tsx

import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import type {
  ActiveCartBatch,
  ActiveCartBatchItem,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { IconShoppingCartOff } from "@tabler/icons-react";
import { ClockIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { useMemo } from "react";

export type MitraCartBatchDataListProps = {
  activeBatch: ActiveCartBatch | null;
  isLoading: boolean;
};

export const MitraCartBatchDataList = (props: MitraCartBatchDataListProps) => {
  // Props
  const { activeBatch, isLoading } = props;

  // Derived Values - DataList
  const dataList = useMemo(() => {
    if (!activeBatch?.items) {
      return {
        headers: [],
        items: [],
        batchActions: [],
        itemActions: [],
      };
    }

    const headers: FormattedTableHeader[] = [
      { th: "Tema & Layer IGT", sortable: false, align: "start" },
      { th: "Basis Spasial", sortable: false, align: "start" },
      { th: "Metode Seleksi", sortable: false, align: "start" },
      { th: "Jumlah / Luas", sortable: false, align: "start" },
      { th: "Subtotal Estimasi", sortable: false, align: "end" },
    ];

    const items: FormattedListItem<ActiveCartBatchItem>[] =
      activeBatch.items.map((item: ActiveCartBatchItem) => {
        const isBidang = item.spatialBasis === "bidang";
        const quantityText = isBidang
          ? `${item.featuresCount} bidang`
          : `${item.areaHa ?? 0} ha`;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.sourceLayerTitle,
              td: (
                <VStack align={"start"} gap={0}>
                  <P fontSize={"sm"} fontWeight={"semibold"}>
                    {item.sourceLayerTitle}
                  </P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {item.sourceLayerId}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: item.spatialBasis,
              td: (
                <Badge
                  colorPalette={isBidang ? "blue" : "orange"}
                  variant={"subtle"}
                >
                  {isBidang ? "Bidang" : "Kawasan"}
                </Badge>
              ),
              align: "start" as const,
            },
            {
              value: item.selectionType,
              td: (
                <Badge variant={"outline"} colorPalette={"gray"}>
                  {item.selectionType.replace(/_/g, " ")}
                </Badge>
              ),
              align: "start" as const,
            },
            {
              value: quantityText,
              td: (
                <P fontSize={"sm"} color={"fg.muted"}>
                  {quantityText}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.subtotalPrice,
              td: (
                <P fontSize={"sm"} fontWeight={"medium"}>
                  <FormatNumber
                    value={item.subtotalPrice}
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

    return {
      headers,
      items,
      batchActions: [],
      itemActions: [],
    };
  }, [activeBatch]);

  if (isLoading) {
    return <Skeleton flex={1} w={"full"} h={"300px"} rounded={0} p={SPACING.md} />;
  }

  if (!activeBatch || activeBatch.items.length === 0) {
    return (
      <Box
        flex={1}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"full"}
        py={SPACING.xl}
        bg={"bg.body"}
      >
        <NoDataState
          icon={IconShoppingCartOff}
          title={"Keranjang Kosong"}
          description={"Silakan pilih layer IGT dan masukkan ke keranjang di menu Permohonan Data."}
        />
      </Box>
    );
  }

  const isPreparing = activeBatch.status === "preparing";
  const isReady = activeBatch.status === "ready";
  const isExpired = activeBatch.status === "expired";

  return (
    <VStack flex={1} align={"stretch"} gap={SPACING.sm}>
      {/* Interop Status & TTL Countdown Banner */}
      {isPreparing && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"} mx={SPACING.md} mt={SPACING.md}>
          <AppIcon icon={Loader2Icon} className={"animate-spin"} />
          <VStack align={"start"} gap={0}>
            <Alert.Title>{"Sistem Sedang Menyiapkan Data Spasial (Interop)"}</Alert.Title>
            <P fontSize={"xs"} color={"fg.muted"}>
              {"Data sedang diproses dan dipotong via Interop Engine. Anda akan menerima notifikasi/inbox saat WFS/WMS siap untuk dibayar."}
            </P>
          </VStack>
        </Alert.Root>
      )}

      {isReady && activeBatch.expiredAt && (
        <Alert.Root status={"success"} colorPalette={"green"} variant={"subtle"} mx={SPACING.md} mt={SPACING.md}>
          <AppIcon icon={SparklesIcon} />
          <HStack justify={"space-between"} align={"center"} w={"full"} wrap={"wrap"} gap={SPACING.sm}>
            <VStack align={"start"} gap={0}>
              <Alert.Title>{"Data Spasial Siap Dibayar!"}</Alert.Title>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"WFS/WMS layer telah berhasil di-generate. Silakan selesaikan checkout sebelum batas waktu TTL berakhir."}
              </P>
            </VStack>

            <HStack gap={1} align={"center"} bg={"bg.body"} px={3} py={1.5} rounded={"md"} border={"1px solid"} borderColor={"green.subtle"}>
              <AppIcon icon={ClockIcon} color={"orange.fg"} />
              <P fontSize={"xs"} color={"fg.muted"}>{"Sisa Waktu:"}</P>
              <Countdown finishedAt={activeBatch.expiredAt} fontWeight={"bold"} color={"orange.fg"} />
            </HStack>
          </HStack>
        </Alert.Root>
      )}

      {isExpired && (
        <Alert.Root status={"error"} colorPalette={"red"} variant={"subtle"} mx={SPACING.md} mt={SPACING.md}>
          <VStack align={"start"} gap={0}>
            <Alert.Title>{"Masa Tenggang Batch Telah Berakhir (Kadaluwarsa)"}</Alert.Title>
            <P fontSize={"xs"} color={"fg.muted"}>
              {"Batas waktu TTL 24 jam untuk batch ini telah habis. Silakan batalkan batch dan ajukan data kembali."}
            </P>
          </VStack>
        </Alert.Root>
      )}

      {/* Batch Items Table */}
      <Box flex={1} overflowY={"auto"}>
        <DataListTable.Root<ActiveCartBatchItem>
          headers={dataList.headers}
          items={dataList.items}
          withNumbering={true}
          rounded={0}
          shadow={"none"}
        >
          <DataListTable.Header />
          <DataListTable.Body />
        </DataListTable.Root>
      </Box>
    </VStack>
  );
};
