// src/features/data-request/components/data-request.draw-aoi.tabs-content.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
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
import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useGlobalMap } from "@/features/clip/hooks/use-global-map";
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import { fetchIgtByAoi } from "@/features/data-request/services/fetch-igt-by-aoi";
import type { IgtDataItem } from "@/features/data-request/types/igt-by-aoi.type";
import { t } from "@/shared/libs/i18n";
import {
  IconCheck,
  IconInfoCircle,
  IconMapPin,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import type GeoJSON from "geojson";
import { useCallback, useMemo, useRef, useState } from "react";

const MIN_PURCHASE_COUNT = 1;
const MAX_VISIBLE_THEMES = 2;

const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

type FetchStatus = "idle" | "loading" | "done" | "error";

const IGT_BY_AOI_HEADERS: FormattedTableHeader[] = [
  { th: "ID Bidang", sortable: true },
  { th: "Tema IGT-PR" },
  { th: "Basis IGT-PR", sortable: true },
  { th: "Deskripsi" },
];

export const DataRequestDrawAoiTabsContent = (props: TabsContentProps) => {
  const {
    isDrawing,
    startDraw,
    cancelDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    fetchStatus,
    fetchError,
    isLoading,
    isDone,
    hasEnoughItems,
    igtItems,
    formattedItems,
    selectedItems,
    setSelectedItems,
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
        <DrawAoiGuideAlert
          isLoading={isLoading}
          isDrawing={isDrawing}
          hasFinishedDraw={hasFinishedDraw}
        />
      )}

      <DrawAoiControls
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

      {fetchStatus === "error" && fetchError && (
        <VStack gap={SPACING_SM} p={PADDING_MD}>
          <P color={"fg.error"}>{fetchError}</P>
          <Button variant={"outline"} onClick={handleResetDraw}>
            Coba Lagi
          </Button>
        </VStack>
      )}

      {isDone && hasEnoughItems && (
        <DrawAoiResultTable
          igtItems={igtItems}
          formattedItems={formattedItems}
          selectedItems={selectedItems}
          itemActions={itemActions}
          onResetDraw={handleResetDraw}
          onSelectedItemsChange={setSelectedItems}
        />
      )}
    </Tabs.Content>
  );
};

type DrawAoiGuideAlertProps = {
  isLoading: boolean;
  isDrawing: boolean;
  hasFinishedDraw: boolean;
};

const DrawAoiGuideAlert = ({
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

type DrawAoiControlsProps = {
  isDrawing: boolean;
  isLoading: boolean;
  hasFinishedDraw: boolean;
  isDone: boolean;
  onCancelDraw: () => void;
  onResetDraw: () => void;
  onConfirmAndFetch: () => void;
};

const DrawAoiControls = ({
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

type DrawAoiResultTableProps = {
  igtItems: IgtDataItem[];
  formattedItems: FormattedListItem<IgtDataItem>[];
  selectedItems: FormattedListItem<IgtDataItem>[];
  itemActions: DataListItemActionsGenerator<IgtDataItem>[];
  onResetDraw: () => void;
  onSelectedItemsChange: (items: FormattedListItem<IgtDataItem>[]) => void;
};

const DrawAoiResultTable = ({
  igtItems,
  formattedItems,
  selectedItems,
  itemActions,
  onResetDraw,
  onSelectedItemsChange,
}: DrawAoiResultTableProps) => {
  const { theme } = useThemeStore();

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
          headers={IGT_BY_AOI_HEADERS}
          items={formattedItems}
          itemActions={itemActions as DataListItemActionsGenerator[]}
          canBatchSelect
          pb={0}
          roundedTop={0}
          roundedBottom={theme.radii.container}
          shadow={"none"}
          onSelectedItemChange={({ selectedItems: sel }) => {
            onSelectedItemsChange(sel as FormattedListItem<IgtDataItem>[]);
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

const useDrawAoi = () => {
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const map = useGlobalMap();

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [igtItems, setIgtItems] = useState<IgtDataItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<
    FormattedListItem<IgtDataItem>[]
  >([]);

  const abortRef = useRef<AbortController | null>(null);

  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;
  const isLoading = fetchStatus === "loading";
  const isDone = fetchStatus === "done";
  const hasEnoughItems = igtItems.length >= MIN_PURCHASE_COUNT;

  const formattedItems = useMemo<FormattedListItem<IgtDataItem>[]>(
    () => igtItems.map(igtItemToFormattedItem),
    [igtItems],
  );

  const handleResetDraw = useCallback(() => {
    abortRef.current?.abort();
    setFetchStatus("idle");
    setFetchError(null);
    setIgtItems([]);
    setSelectedItems([]);
    cancelDraw();
  }, [cancelDraw]);

  const handleConfirmAndFetch = useCallback(async () => {
    if (!hasFinishedDraw) return;

    const polygon: GeoJSON.Polygon = {
      type: "Polygon",
      coordinates: [
        [...points.map((p) => [p.lng, p.lat]), [points[0].lng, points[0].lat]],
      ],
    };

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetchStatus("loading");
    setFetchError(null);
    setIgtItems([]);
    setSelectedItems([]);

    try {
      const items = await fetchIgtByAoi(polygon, controller.signal);
      if (controller.signal.aborted) return;
      setIgtItems(items);
      setFetchStatus("done");
    } catch (err: unknown) {
      if ((err as { name?: string }).name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Gagal mengambil data IGT";
      setFetchError(message);
      setFetchStatus("error");
    }
  }, [hasFinishedDraw, points]);

  const handleFlyTo = useCallback(
    async (item: FormattedListItem<IgtDataItem>) => {
      if (!map) return;

      const controller = new AbortController();

      try {
        const fc = await fetchWfs({
          typeName: WFS_LAYER_NAME,
          cqlFilter: `id='${item.id}'`,
          signal: controller.signal,
        });

        const feature = fc.features[0];
        if (!feature?.geometry) return;

        const geom = feature.geometry;
        let lng = 0;
        let lat = 0;

        if (geom.type === "Point") {
          [lng, lat] = geom.coordinates as [number, number];
        } else if (geom.type === "Polygon" && geom.coordinates[0]?.length > 0) {
          const ring = geom.coordinates[0];
          const sumLng = ring.reduce((acc, c) => acc + c[0], 0);
          const sumLat = ring.reduce((acc, c) => acc + c[1], 0);
          lng = sumLng / ring.length;
          lat = sumLat / ring.length;
        }

        map.flyTo({ center: [lng, lat], zoom: 16 });
      } catch {
        // Silently ignore fly-to errors
      }
    },
    [map],
  );

  const itemActions: DataListItemActionsGenerator<IgtDataItem>[] = useMemo(
    () => [
      (item) => (
        <Menu.Item
          key={"fly-to"}
          value={"fly-to"}
          onClick={() => void handleFlyTo(item)}
        >
          <AppIcon icon={IconMapPin} />
          Lihat di Peta
        </Menu.Item>
      ),
    ],
    [handleFlyTo],
  );

  return {
    isDrawing,
    startDraw: () => start("polygon"),
    cancelDraw,
    hasStartedDrawing,
    hasFinishedDraw,
    fetchStatus,
    fetchError,
    isLoading,
    isDone,
    hasEnoughItems,
    igtItems,
    formattedItems,
    selectedItems,
    setSelectedItems,
    handleResetDraw,
    handleConfirmAndFetch,
    itemActions,
  };
};

const igtItemToFormattedItem = (
  item: IgtDataItem,
): FormattedListItem<IgtDataItem> => {
  const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
  const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

  const columns: FormattedTableColumn[] = [
    {
      value: item.id,
      td: <P fontSize={"sm"}>{item.id}</P>,
      align: "start",
    },
    {
      value: item.themes.map((th) => th.name).join(", "),
      td: (
        <HStack wrap={"wrap"} gap={1}>
          {visibleThemes.map((theme) => (
            <Badge key={theme.name} colorPalette={"neutral"} variant={"subtle"}>
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
      align: "start",
    },
    {
      value: item.basis,
      td: (
        <Badge
          colorPalette={
            item.basis === "bidang" ? BASIS_BIDANG_COLOR : BASIS_KAWASAN_COLOR
          }
          variant={"subtle"}
        >
          {item.basis}
        </Badge>
      ),
      align: "center",
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
      align: "start",
    },
  ];

  return { id: item.id, data: item, columns };
};
