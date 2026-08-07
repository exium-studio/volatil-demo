// src/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content.tsx

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
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { useMitraDrawAoi } from "@/features/mitra/data-request/hooks/use-mitra-draw-aoi";
import type {
  DrawAoiDataListProps,
  DrawAoiGuideAlertProps,
} from "@/features/mitra/data-request/types/mitra.data-request.draw-aoi.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
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

export const MitraDataRequestDrawAoiTabsContent = (props: TabsContentProps) => {
  // Hooks
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
  } = useMitraDrawAoi();

  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      {!isDone && !isLoading && (
        <>
          <GuideAlert
            isLoading={isLoading}
            isDrawing={isDrawing}
            hasFinishedDraw={hasFinishedDraw}
            isVisible={hasStartedDrawing}
          />

          <NoDataState
            description={
              "Tentukan area spesifik pada peta untuk mengambil data IGT."
            }
          >
            {!hasStartedDrawing && (
              <Button primary pl={3} onClick={startDraw}>
                <AppIcon icon={IconPencil} />
                {"Mulai gambar"}
              </Button>
            )}

            {isDrawing && (
              <Button
                variant={"outline"}
                colorPalette={"red"}
                pl={3}
                onClick={cancelDraw}
              >
                <AppIcon icon={IconX} />
                {"Batal gambar"}
              </Button>
            )}

            {hasFinishedDraw && (
              <HStack gap={SPACING_SM}>
                <Button
                  variant={"outline"}
                  colorPalette={"red"}
                  pl={3}
                  onClick={handleResetDraw}
                >
                  <AppIcon icon={IconTrash} />
                  {"Hapus gambar"}
                </Button>

                <Button
                  primary
                  pl={3}
                  onClick={() => void handleConfirmAndFetch()}
                >
                  <AppIcon icon={IconCheck} />
                  {"Konfirmasi & clip"}
                </Button>
              </HStack>
            )}
          </NoDataState>

          <GuideAlert
            isLoading={isLoading}
            isDrawing={isDrawing}
            hasFinishedDraw={hasFinishedDraw}
            isVisible={false}
          />
        </>
      )}

      {isLoading && (
        <Box
          display={"flex"}
          flex={1}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HStack align={"center"} gap={SPACING_SM}>
            <Loader />
            <P>{"Mengambil data IGT di area AOI Anda..."}</P>
          </HStack>
        </Box>
      )}

      {isError && (
        <VStack gap={SPACING_SM} p={PADDING_MD}>
          <P color={"fg.error"}>
            {(error as Error)?.message ?? "Terjadi kesalahan"}
          </P>
          <Button variant={"outline"} onClick={handleResetDraw}>
            {"Coba lagi"}
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

const GuideAlert = (props: DrawAoiGuideAlertProps) => {
  // Props
  const {
    isLoading,
    isDrawing,
    hasFinishedDraw,
    isVisible = true,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Utils
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
      return "Area berhasil digambar. Klik 'Konfirmasi & clip' untuk mengambil data, atau 'Hapus gambar' untuk menggambar ulang.";
    return "Klik 'Mulai gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan.";
  };

  return (
    <VStack
      wrap={"wrap"}
      justify={"space-between"}
      gap={SPACING_MD}
      p={PADDING_MD}
      pb={0}
      visibility={isVisible ? "visible" : "hidden"}
      pointerEvents={isVisible ? "auto" : "none"}
      {...restProps}
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

const DataList = ({
  igtItems,
  itemActions,
  onResetDraw,
}: DrawAoiDataListProps) => {
  // Stores
  const { theme } = useThemeStore();

  // States
  const [selectedItems, setSelectedItems] = useState<
    FormattedListItem<IgtDataItem>[]
  >([]);

  // Derived Values
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi" },
      ],
      items: igtItems.map((item: IgtDataItem) => {
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
                  {visibleThemes.map((themeItem) => (
                    <Badge
                      key={themeItem.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {themeItem.name}
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
              {igtItems.length} {"data ditemukan"}
            </Badge>

            <Button
              variant={"outline"}
              colorPalette={"red"}
              pl={3}
              onClick={onResetDraw}
            >
              <AppIcon icon={IconTrash} />
              {"Hapus gambar"}
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

        <MitraDataRequestAddToCartButtons
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

export const DataRequestDrawAoiTabsContent = MitraDataRequestDrawAoiTabsContent;
