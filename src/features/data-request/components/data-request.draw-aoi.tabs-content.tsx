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
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
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
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { t } from "@/shared/libs/i18n";
import {
  IconCheck,
  IconInfoCircle,
  IconMapPin,
  IconPencil,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { useCallback, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Config constants
// ---------------------------------------------------------------------------

/** Minimum number of AOI items required to enable bulk purchase. */
const MIN_PURCHASE_COUNT = 1;

/** Maximum number of IGT themes rendered as visible badges per row. */
const MAX_VISIBLE_THEMES = 2;

/** Color palette for "bidang" basis badge. */
const BASIS_BIDANG_COLOR = "blue" as const;

/** Color palette for "kawasan" basis badge. */
const BASIS_KAWASAN_COLOR = "orange" as const;

// ---------------------------------------------------------------------------
// Fetch status type
// ---------------------------------------------------------------------------

type FetchStatus = "idle" | "loading" | "done" | "error";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts IgtDataItem to FormattedListItem for DataListTable. */
const igtItemToFormattedItem = (
  item: IgtDataItem,
): FormattedListItem<IgtDataItem> => {
  const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
  const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

  const columns: FormattedTableColumn[] = [
    // Column 1 — ID Bidang
    {
      value: item.id,
      td: <P fontSize={"sm"}>{item.id}</P>,
      align: "start",
    },
    // Column 2 — Tema IGT-PR (badge list, collapsed after MAX_VISIBLE_THEMES)
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
    // Column 3 — Basis IGT-PR
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
    // Column 4 — Deskripsi
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

const IGT_BY_AOI_HEADERS: FormattedTableHeader[] = [
  { th: "ID Bidang", sortable: true },
  { th: "Tema IGT-PR" },
  { th: "Basis IGT-PR", sortable: true },
  { th: "Deskripsi" },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const DataRequestDrawAoiTabsContent = (props: TabsContentProps) => {
  // Stores
  const { theme } = useThemeStore();
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();

  // Map — used for flyTo action on row
  const map = useGlobalMap();

  // AOI fetch state
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [igtItems, setIgtItems] = useState<IgtDataItem[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Selection state
  const [selectedItems, setSelectedItems] = useState<
    FormattedListItem<IgtDataItem>[]
  >([]);

  // Derived
  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;
  const isLoading = fetchStatus === "loading";
  const isDone = fetchStatus === "done";
  const hasEnoughItems = igtItems.length >= MIN_PURCHASE_COUNT;

  // Formatted items for the table
  const formattedItems = useMemo<FormattedListItem<IgtDataItem>[]>(
    () => igtItems.map(igtItemToFormattedItem),
    [igtItems],
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleResetDraw = () => {
    // Abort any in-flight AOI fetch
    abortRef.current?.abort();
    setFetchStatus("idle");
    setFetchError(null);
    setIgtItems([]);
    setSelectedItems([]);
    cancelDraw();
  };

  const handleConfirmAndFetch = async () => {
    if (!hasFinishedDraw) return;

    // Build GeoJSON Polygon from drawn points
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
  };

  // flyTo action — lazy WFS fetch by id to get geometry centroid
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

        // Compute centroid from first coordinate of polygon/point
        const geom = feature.geometry;
        let lng = 0;
        let lat = 0;

        if (geom.type === "Point") {
          [lng, lat] = geom.coordinates as [number, number];
        } else if (geom.type === "Polygon" && geom.coordinates[0]?.length > 0) {
          // Average all ring coordinates as a simple centroid
          const ring = geom.coordinates[0];
          const sumLng = ring.reduce((acc, c) => acc + c[0], 0);
          const sumLat = ring.reduce((acc, c) => acc + c[1], 0);
          lng = sumLng / ring.length;
          lat = sumLat / ring.length;
        }

        map.flyTo({ center: [lng, lat], zoom: 16 });
      } catch {
        // Silently ignore fly-to errors (network / abort)
      }
    },
    [map],
  );

  // Row action: flyTo
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Tabs.Content
      display={"flex"}
      flexDir={"column"}
      flex={1}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      {/* === Initial state: not started drawing === */}
      {!hasStartedDrawing && !isDone && !isLoading && (
        <NoDataState
          description={
            "Klik 'Mulai Gambar' lalu tentukan area pada peta dengan mengklik beberapa titik untuk menentukan batas area yang Anda inginkan."
          }
        >
          <Button primary onClick={() => start("polygon")}>
            <AppIcon icon={IconPencil} />
            Mulai Gambar
          </Button>
        </NoDataState>
      )}

      {/* === Guide alert: visible when drawing is in progress === */}
      {hasStartedDrawing && !isDone && (
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
            bg={
              isLoading
                ? "bg.info"
                : isDrawing
                  ? "bg.warning"
                  : hasFinishedDraw
                    ? "bg.success"
                    : "bg.info"
            }
            rounded={theme.radii.container}
            color={
              isLoading
                ? "fg.info"
                : isDrawing
                  ? "fg.warning"
                  : hasFinishedDraw
                    ? "fg.success"
                    : "fg.info"
            }
          >
            <AppIcon icon={IconInfoCircle} />

            <P>
              {isLoading
                ? "Mengambil data IGT di area AOI Anda..."
                : isDrawing
                  ? "Klik titik pada peta untuk menggambar. Klik titik pertama atau double-click untuk selesai."
                  : hasFinishedDraw
                    ? "Area berhasil digambar. Klik 'Konfirmasi & Clip' untuk mengambil data, atau 'Hapus Gambar' untuk menggambar ulang."
                    : "Klik 'Mulai Gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan."}
            </P>
          </HStack>
        </VStack>
      )}

      {/* === Drawing: cancel button === */}
      {isDrawing && !isLoading && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          p={PADDING_MD}
        >
          <Button variant={"outline"} colorPalette={"red"} onClick={cancelDraw}>
            <AppIcon icon={IconX} />
            Batal Gambar
          </Button>
        </Box>
      )}

      {/* === Draw finished, not yet confirmed === */}
      {hasFinishedDraw && !isLoading && !isDone && (
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
              onClick={handleResetDraw}
            >
              <AppIcon icon={IconTrash} />
              Hapus Gambar
            </Button>

            <Button primary onClick={() => void handleConfirmAndFetch()}>
              <AppIcon icon={IconCheck} />
              Konfirmasi &amp; Clip
            </Button>
          </HStack>
        </Box>
      )}

      {/* === Loading spinner === */}
      {isLoading && (
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HStack align={"center"} gap={SPACING_SM}>
            <Loader />
            <P>Mengambil data IGT di area AOI Anda...</P>
          </HStack>
        </Box>
      )}

      {/* === Error === */}
      {fetchStatus === "error" && fetchError && (
        <VStack gap={SPACING_SM} p={PADDING_MD}>
          <P color={"fg.error"}>{fetchError}</P>
          <Button variant={"outline"} onClick={handleResetDraw}>
            Coba Lagi
          </Button>
        </VStack>
      )}

      {/* === Done: render IGT data table === */}
      {isDone && hasEnoughItems && (
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
                  onClick={handleResetDraw}
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
      )}
    </Tabs.Content>
  );
};
