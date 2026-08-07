// src/features/data-request/components/data-request.draw-aoi.tabs-content.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PER_PAGE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-per-page";
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
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useClipResultLayer } from "@/features/clip/hooks/use-clip-result-layer";
import { useGlobalMap } from "@/features/clip/hooks/use-global-map";
import { useWfsClip } from "@/features/clip/hooks/use-wfs-clip";
import { useClipStore } from "@/features/clip/stores/use-clip-store";
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import { t } from "@/shared/libs/i18n";
import type GeoJSON from "geojson";
import {
  CheckIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const CLIP_STATUS_LABELS: Partial<Record<string, string>> = {
  fetching: "Mengambil data di AOI...",
  clipping: "Menyiapkan data IGT Anda...",
};

/**
 * Headers sesuai schema layer TEST_BIDANG_TANAH (dari WFS DescribeFeatureType).
 * Kolom: nib, kelurahan, kecamatan, kabupaten, tipehak, luastertul (m²), statbid.
 */
const BIDANG_HEADERS: FormattedTableHeader[] = [
  { th: "NIB", sortable: true },
  { th: "Kelurahan", sortable: true },
  { th: "Kecamatan", sortable: true },
  { th: "Kabupaten", sortable: true },
  { th: "Tipe Hak", sortable: true },
  { th: "Luas (m²)", sortable: true, align: "end" },
  { th: "Status Bidang", sortable: true },
];

/** Map a GeoJSON TEST_BIDANG_TANAH feature into a DataListTable FormattedListItem. */
const bidangFeatureToItem = (
  feature: GeoJSON.Feature,
  index: number,
): FormattedListItem => {
  const p = feature.properties ?? {};
  const id = String(p["id"] ?? feature.id ?? index);
  const luas =
    p["luastertul"] != null
      ? Number(p["luastertul"]).toLocaleString("id-ID")
      : "—";

  const columns: FormattedTableColumn[] = [
    {
      value: p["nib"] ?? "—",
      td: <P fontSize={"sm"}>{String(p["nib"] ?? "—")}</P>,
      align: "start",
    },
    {
      value: p["kelurahan"] ?? "—",
      td: <P fontSize={"sm"}>{String(p["kelurahan"] ?? "—")}</P>,
      align: "start",
    },
    {
      value: p["kecamatan"] ?? "—",
      td: <P fontSize={"sm"}>{String(p["kecamatan"] ?? "—")}</P>,
      align: "start",
    },
    {
      value: p["kabupaten"] ?? "—",
      td: <P fontSize={"sm"}>{String(p["kabupaten"] ?? "—")}</P>,
      align: "start",
    },
    {
      value: p["tipehak"] ?? "—",
      td: (
        <Badge colorPalette={"blue"} variant={"subtle"}>
          {String(p["tipehak"] ?? "—")}
        </Badge>
      ),
      align: "center",
    },
    {
      value: p["luastertul"] ?? 0,
      td: (
        <P fontSize={"sm"} textAlign={"end"}>
          {luas}
        </P>
      ),
      align: "end",
    },
    {
      value: p["statbid"] ?? "—",
      td: (
        <Badge
          colorPalette={p["statbid"] === "Terdaftar" ? "green" : "neutral"}
          variant={"subtle"}
        >
          {String(p["statbid"] ?? "—")}
        </Badge>
      ),
      align: "center",
    },
  ];

  return { id, data: feature as unknown as Record<string, unknown>, columns };
};

export const DataRequestDrawAoiTabsContent = (props: TabsContentProps) => {
  // Stores
  const { theme } = useThemeStore();
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const { status, error, clippedFeatures, reset: resetClip } = useClipStore();
  const { run, cancel: cancelClip } = useWfsClip();

  // Maps / Result sync
  const map = useGlobalMap();
  useClipResultLayer(map);

  // Derived
  const hasStartedDrawing = isDrawing || points.length > 0;
  const hasFinishedDraw = !isDrawing && points.length >= 3;
  const isProcessing = status === "fetching" || status === "clipping";
  const isDone = status === "done";

  const handleHapusGambar = () => {
    cancelClip();
    resetClip();
    cancelDraw();
  };

  const handleConfirmAndClip = () => {
    const polygon: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...points.map((p) => [p.lng, p.lat]),
            [points[0].lng, points[0].lat],
          ],
        ],
      },
    };
    void run(polygon);
  };

  return (
    <Tabs.Content
      display={"flex"}
      flexDir={"column"}
      flex={1}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      {/* ===  State awal: belum mulai gambar sama sekali === */}
      {!hasStartedDrawing && !isDone && !isProcessing && (
        <NoDataState
          description={
            "Klik 'Mulai Gambar' lalu tentukan area pada peta dengan mengklik beberapa titik untuk menentukan batas area yang Anda inginkan."
          }
        >
          <Button primary onClick={() => start("polygon")}>
            <AppIcon icon={PencilIcon} />
            Mulai Gambar
          </Button>
        </NoDataState>
      )}

      {/* === Alert guide: muncul setelah user klik mulai gambar === */}
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
              isProcessing
                ? "bg.info"
                : isDrawing
                  ? "bg.warning"
                  : hasFinishedDraw
                    ? "bg.success"
                    : "bg.info"
            }
            rounded={theme.radii.container}
            color={
              isProcessing
                ? "fg.info"
                : isDrawing
                  ? "fg.warning"
                  : hasFinishedDraw
                    ? "fg.success"
                    : "fg.info"
            }
          >
            <AppIcon icon={InfoIcon} />

            <P>
              {isProcessing
                ? (CLIP_STATUS_LABELS[status] ?? "Memproses...")
                : isDrawing
                  ? "Klik titik pada peta untuk menggambar. Klik titik pertama atau double-click untuk selesai."
                  : hasFinishedDraw
                    ? "Area berhasil digambar. Klik 'Konfirmasi & Clip' untuk mengambil data, atau 'Hapus Gambar' untuk menggambar ulang."
                    : "Klik 'Mulai Gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan."}
            </P>
          </HStack>
        </VStack>
      )}

      {/* === Sedang menggambar: tombol batal === */}
      {isDrawing && !isProcessing && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          p={PADDING_MD}
        >
          <Button variant={"outline"} colorPalette={"red"} onClick={cancelDraw}>
            <AppIcon icon={XIcon} />
            Batal Gambar
          </Button>
        </Box>
      )}

      {/* === Draw selesai, belum konfirmasi & belum processing === */}
      {hasFinishedDraw && !isProcessing && !isDone && (
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
              onClick={handleHapusGambar}
            >
              <AppIcon icon={Trash2Icon} />
              Hapus Gambar
            </Button>

            <Button primary onClick={handleConfirmAndClip}>
              <AppIcon icon={CheckIcon} />
              Konfirmasi &amp; Clip
            </Button>
          </HStack>
        </Box>
      )}

      {/* === Sedang proses: spinner === */}
      {isProcessing && (
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <HStack align={"center"} gap={SPACING_SM}>
            <Loader />
            <P>{CLIP_STATUS_LABELS[status] ?? "Memproses..."}</P>
          </HStack>
        </Box>
      )}

      {/* === Error === */}
      {status === "error" && error && (
        <VStack gap={SPACING_SM} p={PADDING_MD}>
          <P color={"fg.error"}>{error}</P>
          <Button variant={"outline"} onClick={handleHapusGambar}>
            Coba Lagi
          </Button>
        </VStack>
      )}

      {/* === Done: tampilkan hasil clip real dari WFS CQL filter === */}
      {isDone && clippedFeatures && (
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
                  {clippedFeatures.features.length} fitur ditemukan
                </Badge>

                <Button
                  variant={"outline"}
                  colorPalette={"red"}
                  onClick={handleHapusGambar}
                >
                  <AppIcon icon={Trash2Icon} />
                  Hapus Gambar
                </Button>
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          <DataList clippedFeatures={clippedFeatures} />
        </>
      )}
    </Tabs.Content>
  );
};

interface DataListProps {
  clippedFeatures: GeoJSON.FeatureCollection;
}

const DataList = ({ clippedFeatures }: DataListProps) => {
  // States
  const [dataListState, setDataListState] = useState({
    perPage: DEFAULT_PER_PAGE_OPTIONS[0],
    page: 1,
    selectedItems: [] as FormattedListItem[],
  });

  // Resolved Values
  const dataList = useMemo(() => {
    const features = clippedFeatures.features;

    const items: FormattedListItem[] = features.map((feature, idx) =>
      bidangFeatureToItem(feature, idx),
    );

    return { headers: BIDANG_HEADERS, items };
  }, [clippedFeatures]);

  const totalItems = dataList.items.length;

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        withNumbering={true}
        headers={dataList.headers}
        items={dataList.items}
        canBatchSelect
        rounded={0}
        shadow={"none"}
        onSelectedItemChange={({ selectedItems }) => {
          setDataListState((prev) => ({ ...prev, selectedItems }));
        }}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>

      <Separator borderColor={"bg.canvas"} mt={"auto"} />

      <DataRequestAddToCartButtons
        selectedItems={dataListState.selectedItems}
        totalItems={totalItems}
        onAddSelectedClick={() => {
          console.log("onAddSelectedClick");
        }}
        onAddAllClick={() => {
          console.log("onAddAllClick");
        }}
      />
    </VStack>
  );
};
