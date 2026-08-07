// src/features/data-request/components/data-request.draw-aoi.tabs-content.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import { useDrawAoi } from "@/features/data-request/hooks/use-draw-aoi";
import type {
  DrawAoiControlsProps,
  DrawAoiDataListProps,
  DrawAoiGuideAlertProps,
} from "@/features/data-request/types/data-request.draw-aoi.type";
import type { IgtDataItem } from "@/features/data-request/types/igt-by-aoi.type";
import { t } from "@/shared/libs/i18n";
import {
  IconCheck,
  IconInfoCircle,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export const DataRequestDrawAoiTabsContent = (props: TabsContentProps) => {
  const {
    isDrawing,
    startDraw,
    cancelDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    isError,
    error,
    isLoading,
    isDone,
    hasEnoughItems,
    igtItems,
    handleResetDraw,
    handleConfirmAndFetch,
    itemActions,
  } = useDrawAoi();

  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      {!hasStartedDrawing && !isDone && !isLoading && (
        <NoDataState
          description={
            "Klik 'Mulai Gambar' lalu tentukan area pada peta dengan mengklik beberapa titik untuk menentukan batas area yang Anda inginkan."
          }
        >
          <Button primary onClick={startDraw}>
            <AppIcon icon={IconPencil} />
            Mulai Gambar
          </Button>
        </NoDataState>
      )}

      {hasStartedDrawing && !isDone && (
        <GuideAlert
          isLoading={isLoading}
          isDrawing={isDrawing}
          hasFinishedDraw={hasFinishedDraw}
        />
      )}

      <DrawControls
        isDrawing={isDrawing}
        isLoading={isLoading}
        hasFinishedDraw={hasFinishedDraw}
        isDone={isDone}
        onCancelDraw={cancelDraw}
        onResetDraw={handleResetDraw}
        onConfirmAndFetch={() => void handleConfirmAndFetch()}
      />

      {isLoading && (
        <Box
          display={"flex"}
          flex={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HStack align={"center"} gap={SPACING_SM}>
            <Loader />
            <P>Mengambil data IGT di area AOI Anda...</P>
          </HStack>
        </Box>
      )}

      {isError && (
        <VStack gap={SPACING_SM} p={PADDING_MD}>
          <P color={"fg.error"}>
            {(error as Error)?.message ?? "Terjadi kesalahan"}
          </P>
          <Button variant={"outline"} onClick={handleResetDraw}>
            Coba Lagi
          </Button>
        </VStack>
      )}

      {isDone && hasEnoughItems && (
        <DataList
          igtItems={igtItems}
          itemActions={itemActions}
          onResetDraw={handleResetDraw}
        />
      )}
    </Tabs.Content>
  );
};

const GuideAlert = ({
  isLoading,
  isDrawing,
  hasFinishedDraw,
}: DrawAoiGuideAlertProps) => {
  const { theme } = useThemeStore();

  const getAlertBg = () => {
    if (isLoading) return "bg.info";
    if (isDrawing) return "bg.warning";
    if (hasFinishedDraw) return "bg.success";
    return "bg.info";
  };

  const getAlertColor = () => {
    if (isLoading) return "fg.info";
    if (isDrawing) return "fg.warning";
    if (hasFinishedDraw) return "fg.success";
    return "fg.info";
  };

  const getGuideMessage = () => {
    if (isLoading) return "Mengambil data IGT di area AOI Anda...";
    if (isDrawing)
      return "Klik titik pada peta untuk menggambar. Klik titik pertama atau double-click untuk selesai.";
    if (hasFinishedDraw)
      return "Area berhasil digambar. Klik 'Konfirmasi & Clip' untuk mengambil data, atau 'Hapus Gambar' untuk menggambar ulang.";
    return "Klik 'Mulai Gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan.";
  };

  return (
    <VStack
      wrap={"wrap"}
      justify={"space-between"}
      gap={SPACING_MD}
      p={PADDING_MD}
      pb={0}
    >
      <HStack
        align={"center"}
        gap={SPACING_MD}
        p={PADDING_MD}
        bg={getAlertBg()}
        rounded={theme.radii.container}
        color={getAlertColor()}
      >
        <AppIcon icon={IconInfoCircle} />
        <P>{getGuideMessage()}</P>
      </HStack>
    </VStack>
  );
};

const DrawControls = ({
  isDrawing,
  isLoading,
  hasFinishedDraw,
  isDone,
  onCancelDraw,
  onResetDraw,
  onConfirmAndFetch,
}: DrawAoiControlsProps) => {
  if (isDrawing && !isLoading) {
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        p={PADDING_MD}
      >
        <Button variant={"outline"} colorPalette={"red"} onClick={onCancelDraw}>
          <AppIcon icon={IconX} />
          Batal Gambar
        </Button>
      </Box>
    );
  }

  if (hasFinishedDraw && !isLoading && !isDone) {
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        p={PADDING_MD}
      >
        <HStack gap={SPACING_SM}>
          <Button
            variant={"outline"}
            colorPalette={"red"}
            onClick={onResetDraw}
          >
            <AppIcon icon={IconTrash} />
            Hapus Gambar
          </Button>

          <Button primary onClick={onConfirmAndFetch}>
            <AppIcon icon={IconCheck} />
            Konfirmasi &amp; Clip
          </Button>
        </HStack>
      </Box>
    );
  }

  return null;
};

const DataList = ({
  igtItems,
  itemActions,
  onResetDraw,
}: DrawAoiDataListProps) => {
  const { theme } = useThemeStore();
  const [selectedItems, setSelectedItems] = useState<
    FormattedListItem<IgtDataItem>[]
  >([]);

  const dataList = useMemo(
    () => ({
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi" },
      ],
      items: igtItems.map((item) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.id,
              td: <P fontSize={"sm"}>{item.id}</P>,
              align: "start" as const,
            },
            {
              value: item.themes.map((th) => th.name).join(", "),
              td: (
                <HStack wrap={"wrap"} gap={1}>
                  {visibleThemes.map((theme) => (
                    <Badge
                      key={theme.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {theme.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge colorPalette={"neutral"} variant={"outline"}>
                      +{remainingCount} lainnya
                    </Badge>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.basis,
              td: (
                <Badge
                  colorPalette={
                    item.basis === "bidang"
                      ? BASIS_BIDANG_COLOR
                      : BASIS_KAWASAN_COLOR
                  }
                  variant={"subtle"}
                >
                  {item.basis}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.description ?? "",
              td: (
                <P
                  fontSize={"sm"}
                  color={"fg.subtle"}
                  maxW={"280px"}
                  whiteSpace={"wrap"}
                >
                  {item.description ?? "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),
    }),
    [igtItems],
  );

  return (
    <>
      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING_SM}
        >
          <HStack gap={SPACING_SM}>
            <SearchInput placeholder={t["action.search"]()} />
          </HStack>

          <HStack gap={SPACING_SM} align={"center"}>
            <Badge colorPalette={"green"} variant={"subtle"}>
              {igtItems.length} data ditemukan
            </Badge>

            <Button
              variant={"outline"}
              colorPalette={"red"}
              onClick={onResetDraw}
            >
              <AppIcon icon={IconTrash} />
              Hapus Gambar
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <VStack flex={1} gap={PADDING_SM} overflowY={"auto"} bg={"bg.canvas"}>
        <DataListTable.Root
          withNumbering={true}
          fixedItemHeight={false}
          headers={dataList.headers}
          items={dataList.items}
          itemActions={itemActions as DataListItemActionsGenerator[]}
          canBatchSelect
          pb={0}
          roundedTop={0}
          roundedBottom={theme.radii.container}
          shadow={"none"}
          onSelectedItemChange={({ selectedItems: sel }) => {
            setSelectedItems(sel as FormattedListItem<IgtDataItem>[]);
          }}
        >
          <DataListTable.Header />
          <DataListTable.Body />
        </DataListTable.Root>

        <DataRequestAddToCartButtons
          selectedItems={selectedItems}
          allItems={igtItems}
          onAddAllBidangClick={() => {
            console.log("add all bidang");
          }}
          onAddAllKawasanClick={() => {
            console.log("add all kawasan");
          }}
          onAddAllClick={() => {
            console.log("add all");
          }}
          onAddSelectedClick={() => {
            console.log("add selected", selectedItems);
          }}
          mt={"auto"}
        />
      </VStack>
    </>
  );
};
