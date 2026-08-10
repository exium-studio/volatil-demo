// src/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
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
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import {
  WFS_BIDANG_ATTRIBUTE_MAP,
  WFS_BIDANG_ATTRIBUTES,
} from "@/features/mitra/data-request/constants/mitra.data-request.constant";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useMitraDrawAoi } from "@/features/mitra/data-request/hooks/use-mitra-draw-aoi";
import type {
  DrawAoiGuideAlertProps,
  DrawAoiWfsDataListProps,
} from "@/features/mitra/data-request/types/mitra.data-request.draw-aoi.type";
import { t } from "@/shared/libs/i18n";
import { IconPolygonOff } from "@tabler/icons-react";
import type GeoJSON from "geojson";
import {
  CheckIcon,
  InfoIcon,
  MapPinIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

export const MitraDataRequestDrawAoiTabsContent = memo(
  (props: TabsContentProps) => {
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
      wfsFeatures,
      handleResetDraw,
      handleConfirmAndFetch,
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
                  <AppIcon icon={PencilIcon} />
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
                  <AppIcon icon={XIcon} />
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
                    <AppIcon icon={IconPolygonOff} />
                    {"Hapus gambar"}
                  </Button>

                  <Button
                    primary
                    pl={3}
                    onClick={() => void handleConfirmAndFetch()}
                  >
                    <AppIcon icon={CheckIcon} />
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
            <P color={"fg.error"}>{error ?? "Terjadi kesalahan"}</P>
            <Button variant={"outline"} onClick={handleResetDraw}>
              {"Coba lagi"}
            </Button>
          </VStack>
        )}

        {isDone && hasEnoughItems && (
          <DataList wfsFeatures={wfsFeatures} onResetDraw={handleResetDraw} />
        )}
      </Tabs.Content>
    );
  },
);

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

  // Handlers / Utils
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
        <AppIcon icon={InfoIcon} />
        <P>{getGuideMessage()}</P>
      </HStack>
    </VStack>
  );
};

const DataList = memo((props: DrawAoiWfsDataListProps) => {
  // Props
  const { wfsFeatures, onResetDraw } = props;

  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((state) => state.map);

  // Hooks (Mutations)
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // States
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Derived Values — DataList Configuration
  const dataList = useMemo(
    () => ({
      headers: WFS_BIDANG_ATTRIBUTES.map((key) => ({
        th: WFS_BIDANG_ATTRIBUTE_MAP[key],
        sortable: key === "id" || key === "kodewilaya",
      })),

      items: wfsFeatures.map((feature) => {
        const featureId = String(feature.properties?.id ?? feature.id ?? "");
        return {
          id: featureId,
          data: feature as unknown as Record<string, unknown>,
          columns: WFS_BIDANG_ATTRIBUTES.map((key) => {
            const val = feature.properties?.[key];

            return {
              value: val ?? "-",
              align: "start" as const,
            };
          }),
        };
      }),

      itemActions: [
        (item: FormattedListItem) => {
          const feat = item.data as unknown as GeoJSON.Feature | undefined;
          return (
            <Menu.Item
              key={"fly-to"}
              value={"fly-to"}
              onClick={() => {
                if (!feat?.geometry || !map) return;
                const geom = feat.geometry;
                let lng = 0;
                let lat = 0;

                if (geom.type === "Point") {
                  [lng, lat] = geom.coordinates as [number, number];
                } else if (
                  geom.type === "Polygon" &&
                  geom.coordinates[0]?.length > 0
                ) {
                  const ring = geom.coordinates[0];
                  const sumLng = ring.reduce(
                    (acc: number, c: number[]) => acc + c[0],
                    0,
                  );
                  const sumLat = ring.reduce(
                    (acc: number, c: number[]) => acc + c[1],
                    0,
                  );
                  lng = sumLng / ring.length;
                  lat = sumLat / ring.length;
                } else if (
                  geom.type === "MultiPolygon" &&
                  geom.coordinates[0]?.[0]?.length > 0
                ) {
                  const ring = geom.coordinates[0][0];
                  const sumLng = ring.reduce(
                    (acc: number, c: number[]) => acc + c[0],
                    0,
                  );
                  const sumLat = ring.reduce(
                    (acc: number, c: number[]) => acc + c[1],
                    0,
                  );
                  lng = sumLng / ring.length;
                  lat = sumLat / ring.length;
                }

                if (lng && lat) {
                  map.flyTo({ center: [lng, lat], zoom: 16 });
                }
              }}
            >
              <AppIcon icon={MapPinIcon} />
              {"Lihat di Peta"}
            </Menu.Item>
          );
        },
      ] as DataListItemActionsGenerator[],
    }),
    [wfsFeatures, map],
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
            <Button
              variant={"outline"}
              colorPalette={"red"}
              pl={3}
              onClick={onResetDraw}
            >
              <AppIcon icon={IconPolygonOff} />
              {"Hapus gambar"}
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <VStack flex={1} gap={PADDING_SM} overflowY={"auto"} bg={"bg.canvas"}>
        <DataListTable.Root
          headers={dataList.headers}
          items={dataList.items}
          itemActions={dataList.itemActions}
          canBatchSelect
          pb={0}
          roundedTop={0}
          roundedBottom={theme.radii.container}
          shadow={"none"}
          onSelectedItemChange={({ selectedItems: sel }) => {
            setSelectedItems(sel as FormattedListItem[]);
          }}
        >
          <DataListTable.Header />
          <DataListTable.Body />
        </DataListTable.Root>

        <MitraDataRequestAddToCartButtons
          selectedItems={selectedItems}
          allItems={wfsFeatures}
          totalBidangCount={wfsFeatures.length}
          totalKawasanCount={0}
          totalCount={wfsFeatures.length}
          onAddAllBidangClick={() => {
            addToCartAllMutation.mutate({
              source: "draw_aoi",
              targetBasis: "bidang",
            });
          }}
          onAddAllKawasanClick={() => {
            addToCartAllMutation.mutate({
              source: "draw_aoi",
              targetBasis: "kawasan",
            });
          }}
          onAddAllBothClick={() => {
            addToCartAllMutation.mutate({
              source: "draw_aoi",
              targetBasis: "all",
            });
          }}
          onAddSelectedClick={() => {
            const selectedIds = selectedItems.map((item) => String(item.id));
            addToCartSelectedMutation.mutate({ itemIds: selectedIds });
          }}
          mt={"auto"}
        />
      </VStack>
    </>
  );
});
