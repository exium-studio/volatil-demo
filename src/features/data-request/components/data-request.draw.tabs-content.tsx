// src/features/data-request/components/data-request.draw.tabs-content.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
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
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  PADDING_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import type { IgtCategory } from "@/features/data-request/types/data-request.type";
import { useClipStore } from "@/features/clip/stores/use-clip-store";
import { useWfsClip } from "@/features/clip/hooks/use-wfs-clip";
import { dummyIgtData } from "@/shared/constants/dummy-data";
import { t } from "@/shared/libs/i18n";
import {
  CheckIcon,
  InfoIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const IGT_THEME_TYPE_MAP = {
  bidang: {
    label: "IGT Berbasis Bidang",
    colorPalette: "blue",
    color: "blue.fg",
  },
  kawasan: {
    label: "IGT Berbasis Kawasan",
    colorPalette: "orange",
    color: "orange.fg",
  },
} as const;

const IGT_CATEGORY_MAP: Record<IgtCategory, string> = {
  hak_atas_tanah: "IGT Hak Atas Tanah",
  pemilikan_tanah: "IGT Pemilikan Tanah",
  bidang_tanah: "IGT Bidang Tanah",
  rtrw_nasional: "IGT RTRW Nasional",
  rtrw_provinsi: "IGT RTRW Provinsi",
  rtrw_kota: "IGT RTRW Kota",
};

const CLIP_STATUS_LABELS: Partial<Record<string, string>> = {
  fetching: "Mengambil data di AOI...",
  clipping: "Menyiapkan data IGT Anda...",
};

export const DataRequestDrawTabsContent = (props: TabsContentProps) => {
  // Stores
  const { theme } = useThemeStore();
  const { isDrawing, points, start, cancel: cancelDraw } = useMapDrawStore();
  const { status, error, clippedFeatures, reset: resetClip } = useClipStore();
  const { run, cancel: cancelClip } = useWfsClip();

  // Derived
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
      {/* Info banner */}
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
                  ? "Area berhasil digambar. Klik 'Kon  firmasi & Clip' untuk mengambil data, atau 'Hapus Gambar' untuk menggambar ulang."
                  : "Klik 'Mulai Gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan."}
          </P>
        </HStack>
      </VStack>

      {/* === Belum draw: tampilkan NoDataState + tombol mulai/batal === */}
      {!hasFinishedDraw && !isProcessing && (
        <NoDataState
          description={
            "Silakan gambar area di peta dengan mengklik beberapa titik, hubungkan kembali ke titik awal atau double-click untuk menyelesaikan"
          }
        >
          {isDrawing ? (
            <Button
              variant={"outline"}
              colorPalette={"red"}
              onClick={cancelDraw}
            >
              <AppIcon icon={XIcon} />
              Batal Gambar
            </Button>
          ) : (
            <Button primary onClick={() => start("polygon")}>
              <AppIcon icon={PencilIcon} />
              Mulai Gambar
            </Button>
          )}
        </NoDataState>
      )}

      {/* === Draw selesai, belum konfirmasi & belum processing === */}
      {hasFinishedDraw && !isProcessing && !isDone && (
        <NoDataState
          description={
            "Area berhasil digambar. Klik 'Konfirmasi & Clip' untuk mengambil data IGT di area tersebut."
          }
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
        </NoDataState>
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

      {/* === Done: tampilkan hasil clip + tombol reset === */}
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

              <HStack gap={SPACING_SM}>
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

          <DataList />
        </>
      )}
    </Tabs.Content>
  );
};

const DataList = () => {
  // States
  const [dataListState, setDataListState] = useState({
    perPage: DEFAULT_PER_PAGE_OPTIONS[0],
    page: 1000,
    selectedItems: [] as FormattedListItem[],
  });

  // Resolved Values
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "Nama Data IGT-PR", sortable: true },
        { th: "Jenis Tema IGT-PR", sortable: true },
        { th: "Basis Kuota", sortable: true },
        { th: "Kategori Tema IGT-PR" },
        { th: "Deskripsi Data" },
        { th: "Total Harga", sortable: true, align: "end" },
      ] as FormattedTableHeader[],

      items: dummyIgtData.items.map((item) => ({
        id: item.id,
        data: item,
        columns: [
          {
            value: item.name,
            td: <P>{item.name}</P>,
            align: "start",
          },
          {
            value: item.themeType,
            td: (
              <Badge
                colorPalette={IGT_THEME_TYPE_MAP[item.themeType].colorPalette}
                variant={"subtle"}
              >
                {IGT_THEME_TYPE_MAP[item.themeType].label}
              </Badge>
            ),
            align: "center",
          },
          {
            value: item.quotaBase,
            td: (
              <HStack align={"center"} gap={2}>
                <P>{item.quotaBase}</P>
                <P
                  fontSize={"sm"}
                  color={IGT_THEME_TYPE_MAP[item.themeType].color}
                >
                  {item.themeType === "bidang" ? "bidang" : "ha"}
                </P>
              </HStack>
            ),
            align: "start",
          },
          {
            value: item.categories.join(", "),
            td: (
              <HStack
                wrap={"wrap"}
                align={"start"}
                gap={1}
                w={"max"}
                maxW={"300px"}
              >
                {item.categories.map((cat) => (
                  <Badge key={cat} colorPalette={"neutral"}>
                    {IGT_CATEGORY_MAP[cat]}
                  </Badge>
                ))}
              </HStack>
            ),
            align: "start",
          },
          {
            value: item.description,
            td: (
              <P
                color={"fg.subtle"}
                w={"max"}
                maxW={"300px"}
                whiteSpace={"wrap"}
                fontSize={"sm"}
              >
                {item.description}
              </P>
            ),
            align: "start",
          },
          {
            value: item.price,
            td: (
              <FormatNumber
                value={item.price}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            ),
            align: "end",
          },
        ] as FormattedTableColumn[],
      })) as FormattedListItem[],
    }),
    [],
  );

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        withNumbering={false}
        headers={dataList.headers}
        items={dataList.items}
        canBatchSelect
        rounded={0}
        shadow={"none"}
        onSelectedItemChange={({ selectedItems }) => {
          console.log("selectedItems", selectedItems);
          setDataListState((prev) => ({ ...prev, selectedItems }));
        }}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>

      <DataListFooter
        perPage={dataListState.perPage}
        setPerPage={(perPage) =>
          setDataListState((prev) => ({ ...prev, perPage }))
        }
        page={dataListState.page}
        setPage={(page) => setDataListState((prev) => ({ ...prev, page }))}
        rounded={0}
      />

      <Separator borderColor={"bg.canvas"} />

      <DataRequestAddToCartButtons
        selectedItems={dataListState.selectedItems}
        totalItems={dummyIgtData.meta.total ?? 0}
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
