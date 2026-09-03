// src/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerDataView } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useMitraDrawAoi } from "@/features/mitra/data-request/hooks/use-mitra-draw-aoi";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import type {
  DrawAoiAttributeViewProps,
  DrawAoiGuideAlertProps,
} from "@/features/mitra/data-request/types/mitra.data-request.draw-aoi.type";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { IconPolygonOff } from "@tabler/icons-react";
import {
  CheckIcon,
  InfoIcon,
  MapPinIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { memo, useState } from "react";

export const MitraDataRequestDrawAoiTabsContent = memo(
  (props: TabsContentProps) => {
    // Hooks
    const { selectedIgtLayer } = useSelectedIgtLayer();

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
      confirmedPolygon,
      aoiCqlFilter,
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
                <HStack gap={"sm"}>
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
                    onClick={() => {
                      void handleConfirmAndFetch(
                        selectedIgtLayer?.wfs.wfsTypeName,
                        selectedIgtLayer?.wfs.wfsUrl,
                      );
                    }}
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

        {isError && (
          <VStack gap={"sm"} p={"md"}>
            <P color={"fg.error"}>{error ?? "Terjadi kesalahan"}</P>
            <Button variant={"outline"} onClick={handleResetDraw}>
              {"Coba lagi"}
            </Button>
          </VStack>
        )}

        {isDone && aoiCqlFilter && (
          <DrawAoiAttributeList
            aoiCqlFilter={aoiCqlFilter}
            confirmedPolygon={confirmedPolygon}
            onResetDraw={handleResetDraw}
          />
        )}
      </Tabs.Content>
    );
  },
);

// -------------------------------------------------------------------------------------

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
      gap={"md"}
      p={"md"}
      pb={0}
      visibility={isVisible ? "visible" : "hidden"}
      pointerEvents={isVisible ? "auto" : "none"}
      {...restProps}
    >
      <HStack
        align={"center"}
        gap={"md"}
        p={"md"}
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

// -------------------------------------------------------------------------------------

const DrawAoiAttributeList = memo((props: DrawAoiAttributeViewProps) => {
  // Props
  const { aoiCqlFilter, confirmedPolygon, onResetDraw } = props;

  // Stores
  const map = useMapInstanceStore((state) => state.map);

  // Hooks
  const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();

  // States
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    selectedItems: [] as FormattedListItem[],
  });

  // Queries — server-side WFS pagination
  const { features, totalFeatures, isLoading, isFetching } = useIgtWfsCatalog({
    page: pageState.page,
    pageSize: pageState.pageSize,
    cqlFilter: aoiCqlFilter,
    typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
  });

  if (!selectedIgtLayer || !layerId) {
    return (
      <VStack
        flex={1}
        gap={0}
        overflowY={"auto"}
        bg={"bg.canvas"}
        position={"relative"}
        w={"full"}
      >
        <VStack
          wrap={"wrap"}
          justify={"space-between"}
          gap={"sm"}
          p={"md"}
          bg={"bg.body"}
          w={"full"}
        >
          <HStack
            wrap={"wrap"}
            justify={"space-between"}
            align={"center"}
            gap={"sm"}
            w={"full"}
          >
            <P fontWeight={"semibold"} fontSize={"md"}>
              {"Hasil query spasial gambar AOI"}
            </P>

            <HStack align={"center"} gap={"sm"}>
              {confirmedPolygon && map && (
                <Tooltip content={"Lihat di Peta"}>
                  <IconButton
                    variant={"outline"}
                    onClick={() => {
                      highlightFeatureOnMap(map, confirmedPolygon);
                    }}
                  >
                    <AppIcon icon={MapPinIcon} />
                  </IconButton>
                </Tooltip>
              )}

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

        <MitraDataRequestIgtLayerDataView
          cqlFilter={aoiCqlFilter}
          selectionType={"draw_aoi"}
          showFilter={false}
          onSelectIgtLayer={(layer) => {
            selectLayer(layer.id);
          }}
        />
      </VStack>
    );
  }

  return (
    <MitraDataRequestDetailAttributeView
      layer={selectedIgtLayer}
      cqlFilter={aoiCqlFilter}
      features={features}
      totalFeatures={totalFeatures}
      isLoading={isLoading}
      isFetching={isFetching}
      page={pageState.page}
      pageSize={pageState.pageSize}
      setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
      setPageSize={(pageSize) =>
        setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
      }
      selectedItems={pageState.selectedItems}
      setSelectedItems={(items) =>
        setPageState((prev) => ({ ...prev, selectedItems: items }))
      }
      showActions={false}
    />
  );
});
