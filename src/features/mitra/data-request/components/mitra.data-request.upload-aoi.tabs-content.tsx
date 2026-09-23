// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { RadioIndicator } from "@/design-system/components/input/ui/radio-indicator";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { fitBoundsSafe } from "@/design-system/components/map/utils/map-camera";
import { parseShpFile } from "@/design-system/components/map/utils/parse-shp-file";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { toast } from "@/design-system/components/toast";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerDataView } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view";
import { MitraDataRequestUploadAoiContext } from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useMitraUploadAoi } from "@/features/mitra/data-request/hooks/use-mitra-upload-aoi";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import type {
  AoiFeatureItem,
  MitraDataRequestUploadAoiAttributeViewProps,
  MitraDataRequestUploadAoiPageState,
  MitraDataRequestUploadAoiTabsContentProps,
  UploadAoiFeatureListProps,
  UploadedAoiFile,
} from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { calculateFeatureAreaInHectares } from "@/features/mitra/data-request/utils/calculate-feature-area";
import {
  getGeometryBounds,
  highlightFeatureOnMap,
} from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  FilePlusIcon,
  FocusIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";

// -------------------------------------------------------------------------------------

/** Extracts human-friendly name or identifier from feature properties. */
const extractFeatureName = (
  props: GeoJSON.GeoJsonProperties,
  index: number,
): string => {
  if (!props) return `Area #${index + 1}`;

  const candidates = [
    props.name,
    props.nama,
    props.NAMOBJ,
    props.namobj,
    props.NAMA,
    props.TITLE,
    props.title,
    props.LABEL,
    props.label,
    props.KODE,
    props.kode,
    props.id,
    props.ID,
    props.WADMKC,
    props.WADMKK,
    props.WADMPR,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
    if (typeof c === "number") return String(c);
  }

  return `Area #${index + 1}`;
};

/** Extracts individual Polygon/MultiPolygon features from a GeoJSON object. */
const extractPolygonFeatures = (
  geojson: GeoJSON.GeoJsonObject,
): Array<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>> => {
  const result: Array<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>> =
    [];

  const addIfPolygon = (
    geom: GeoJSON.Geometry | null | undefined,
    properties: GeoJSON.GeoJsonProperties = {},
  ) => {
    if (!geom) return;
    if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
      result.push({
        type: "Feature",
        properties,
        geometry: geom,
      });
    } else if (geom.type === "GeometryCollection") {
      geom.geometries.forEach((g) => addIfPolygon(g, properties));
    }
  };

  if (geojson.type === "FeatureCollection") {
    const fc = geojson as GeoJSON.FeatureCollection;
    fc.features.forEach((f) => {
      if (f && f.geometry) {
        addIfPolygon(f.geometry, f.properties);
      }
    });
  } else if (geojson.type === "Feature") {
    const feat = geojson as GeoJSON.Feature;
    addIfPolygon(feat.geometry, feat.properties);
  } else if (geojson.type === "Polygon" || geojson.type === "MultiPolygon") {
    const polyGeom = geojson as GeoJSON.Polygon | GeoJSON.MultiPolygon;
    result.push({
      type: "Feature",
      properties: {},
      geometry: polyGeom,
    });
  }

  return result;
};

// -------------------------------------------------------------------------------------

export const MitraDataRequestUploadAoiTabsContent = (
  props: MitraDataRequestUploadAoiTabsContentProps,
) => {
  // Props
  const { isActive = false, ...restProps } = props;

  // Stores
  const map = useMapInstanceStore((state) => state.map);
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // States
  const [uploadedFile, setUploadedFile] = useState<UploadedAoiFile | null>(
    null,
  );
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null,
  );
  const [confirmedFeature, setConfirmedFeature] =
    useState<AoiFeatureItem | null>(null);

  // Derived Values — Map Layers (either confirmed polygon OR visible list features)
  const mapActiveFeatures = useMemo(() => {
    if (confirmedFeature) {
      return [
        {
          id: `confirmed-${confirmedFeature.id}`,
          polygon: confirmedFeature.polygon,
        },
      ];
    }
    if (uploadedFile?.features) {
      return uploadedFile.features
        .filter((f) => f.isVisibleOnMap)
        .map((f) => ({ id: f.id, polygon: f.polygon }));
    }
    return [];
  }, [confirmedFeature, uploadedFile]);

  // Hooks
  useMitraUploadAoi(map, mapActiveFeatures);
  const isMounted = useMountTimeout({
    isOpen: isActive,
    mountDelay: 250,
  });

  // Handlers — parse a single file
  const processFile = useCallback(async (file: File) => {
    const fileId = crypto.randomUUID();

    // Validate extension
    const isShpOrZip = file.name.endsWith(".shp") || file.name.endsWith(".zip");
    const isGeoJson =
      file.name.endsWith(".geojson") || file.name.endsWith(".json");

    if (!isShpOrZip && !isGeoJson) {
      toast.error("Format file tidak didukung", {
        group: "Permintaan Data",
        description: `File "${file.name}" bukan berkas shapefile (.shp/.zip) atau GeoJSON (.geojson/.json).`,
      });
      return;
    }

    // Validate size (10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file melebihi batas", {
        group: "Permintaan Data",
        description: `File "${file.name}" melebihi ukuran maksimum 10MB.`,
      });
      return;
    }

    setUploadedFile({
      id: fileId,
      fileName: file.name,
      fileSize: file.size,
      features: [],
      status: "parsing",
    });

    try {
      let rawFeatures: Array<
        GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
      > = [];

      if (isShpOrZip) {
        const fc = await parseShpFile(file);
        rawFeatures = extractPolygonFeatures(fc);
      } else {
        const text = await file.text();
        const parsed = JSON.parse(text) as GeoJSON.GeoJsonObject;
        rawFeatures = extractPolygonFeatures(parsed);
      }

      if (isEmptyArray(rawFeatures)) {
        toast.error("Polygon tidak ditemukan", {
          group: "Permintaan Data",
          description: `Tidak ditemukan geometri polygon yang valid di dalam file "${file.name}".`,
        });
        setUploadedFile(null);
        return;
      }

      const featureItems: AoiFeatureItem[] = rawFeatures.map((feat, idx) => ({
        id: `${fileId}-${idx}`,
        index: idx,
        name: extractFeatureName(feat.properties, idx),
        areaHa: calculateFeatureAreaInHectares(feat),
        polygon: feat,
        isVisibleOnMap: false,
      }));

      setUploadedFile({
        id: fileId,
        fileName: file.name,
        fileSize: file.size,
        features: featureItems,
        status: "done",
      });

      // Keep selection empty by default
      setSelectedFeatureId(null);
    } catch (error) {
      console.error("Failed to parse AOI file:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membaca file";
      toast.error("Gagal memproses file AOI", {
        group: "Permintaan Data",
        description: `File "${file.name}": ${errorMsg}`,
      });
      setUploadedFile(null);
    }
  }, []);

  const handleSelectFeature = useCallback((featureId: string) => {
    setSelectedFeatureId(featureId);
  }, []);

  const handleToggleFeatureVisibility = useCallback((featureId: string) => {
    setUploadedFile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: prev.features.map((f) =>
          f.id === featureId ? { ...f, isVisibleOnMap: !f.isVisibleOnMap } : f,
        ),
      };
    });
  }, []);

  const handleConfirmSelection = useCallback(() => {
    if (!uploadedFile || !selectedFeatureId) return;
    const target = uploadedFile.features.find(
      (f) => f.id === selectedFeatureId,
    );
    if (!target) return;

    setConfirmedFeature(target);
    if (map) {
      const bounds = getGeometryBounds(target.polygon.geometry);
      if (bounds) {
        fitBoundsSafe(map, bounds, {
          padding: 80,
          maxZoom: 16,
          duration: 1200,
        });
      }
    }
  }, [uploadedFile, selectedFeatureId, map]);

  const handleResetAoi = useCallback(() => {
    setConfirmedFeature(null);
    resetWfsClipStore();
  }, [resetWfsClipStore]);

  const handleResetFile = useCallback(() => {
    setUploadedFile(null);
    setSelectedFeatureId(null);
    setConfirmedFeature(null);
    resetWfsClipStore();
  }, [resetWfsClipStore]);

  // Derived Values — CQL INTERSECTS clause from confirmed feature
  const aoiCqlFilter = useMemo(() => {
    if (!confirmedFeature) return null;
    return `INTERSECTS(geom, ${geojsonPolygonToWkt(confirmedFeature.polygon)})`;
  }, [confirmedFeature]);

  const contextValue = useMemo(
    () => ({
      uploadedFile,
      setUploadedFile,
      confirmedFeature,
      setConfirmedFeature,
    }),
    [uploadedFile, confirmedFeature],
  );

  return (
    <MitraDataRequestUploadAoiContext.Provider value={contextValue}>
      <Tabs.Content
        display={"flex"}
        flex={1}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
        {...restProps}
      >
        {/* Step 1: Upload Dropzone (No File Uploaded Yet) */}
        {!uploadedFile && !confirmedFeature && (
          <Box flex={1} p={"md"} display={"flex"} flexDir={"column"}>
            <FileInput
              variant={"dropzone"}
              label={
                "Upload file AOI (.shp/.zip atau .geojson/.json) untuk mengambil data IGT"
              }
              accept={[
                ".zip",
                ".shp",
                ".geojson",
                ".json",
                "application/zip",
                "application/x-zip-compressed",
              ]}
              maxFiles={1}
              maxFileSize={10 * 1024 * 1024}
              onFileChange={({ acceptedFiles }) => {
                if (!isEmptyArray(acceptedFiles)) {
                  void processFile(acceptedFiles[0]);
                }
              }}
              dropzoneProps={{
                flex: 1,
                h: "full",
                minH: "0",
              }}
              dropzoneButtonProps={{
                primary: true,
                children: (
                  <>
                    <AppIcon icon={FilePlusIcon} />
                    {"Upload Berkas AOI"}
                  </>
                ),
              }}
              flex={1}
              h={"full"}
            />
          </Box>
        )}

        {/* Loading skeleton while mounting tab or parsing */}
        {uploadedFile?.status === "parsing" && (
          <Skeleton h={"full"} w={"full"} flex={1} p={"md"} rounded={0} />
        )}

        {/* Step 2: Uploaded State — Polygon Selection List */}
        {uploadedFile &&
          uploadedFile.status === "done" &&
          !confirmedFeature && (
            <UploadAoiFeatureList
              file={uploadedFile}
              selectedFeatureId={selectedFeatureId}
              onSelectFeature={handleSelectFeature}
              onToggleFeatureVisibility={handleToggleFeatureVisibility}
              onConfirmSelection={handleConfirmSelection}
              onResetFile={handleResetFile}
            />
          )}

        {/* Step 3: Confirmed AOI State — Query & IGT Layer Data View */}
        {confirmedFeature && (!isActive || !isMounted) && (
          <Skeleton h={"full"} w={"full"} flex={1} p={"md"} rounded={0} />
        )}

        {confirmedFeature && isActive && isMounted && aoiCqlFilter && (
          <UploadAoiConfirmedAttributeList
            aoiCqlFilter={aoiCqlFilter}
            confirmedPolygon={confirmedFeature.polygon}
            onResetAoi={handleResetAoi}
          />
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

// -------------------------------------------------------------------------------------

const UploadAoiFeatureList = memo((props: UploadAoiFeatureListProps) => {
  // Props
  const {
    file,
    selectedFeatureId,
    onSelectFeature,
    onToggleFeatureVisibility,
    onConfirmSelection,
    onResetFile,
  } = props;

  // Stores
  const map = useMapInstanceStore((state) => state.map);
  const { theme } = useThemeStore();

  // Virtualizer setup
  const parentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: file.features.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76,
    overscan: 5,
  });

  return (
    <VStack flex={1} w={"full"} gap={0} overflow={"hidden"}>
      {/* Header Info */}
      <VStack p={"md"} gap={"xs"} bg={"bg.body"} w={"full"} align={"stretch"}>
        <HStack
          justify={"space-between"}
          align={"center"}
          wrap={"wrap"}
          gap={2}
        >
          <VStack align={"start"} gap={0}>
            <P fontWeight={"semibold"} fontSize={"md"}>
              {"Pilih Area AOI"}
            </P>

            <P fontSize={"xs"} color={"fg.subtle"}>
              {`${file.fileName} (${formatByte(file.fileSize)}) • ${file.features.length} Polygon`}
            </P>
          </VStack>

          <Tooltip content={"Ganti Berkas / Unggah Ulang"}>
            <IconButton
              variant={"outline"}
              colorPalette={"red"}
              aria-label={"Ganti Berkas / Unggah Ulang"}
              onClick={onResetFile}
            >
              <AppIcon icon={TrashIcon} />
            </IconButton>
          </Tooltip>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Virtualized Polygon List */}
      <Box
        ref={parentRef}
        flex={1}
        w={"full"}
        overflowY={"auto"}
        p={"md"}
        position={"relative"}
      >
        <Box
          position={"relative"}
          w={"full"}
          h={`${rowVirtualizer.getTotalSize()}px`}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const feat = file.features[virtualRow.index];
            if (!feat) return null;
            const isSelected = selectedFeatureId === feat.id;

            return (
              <Box
                key={feat.id}
                position={"absolute"}
                top={0}
                left={0}
                w={"full"}
                transform={`translateY(${virtualRow.start}px)`}
                pb={"sm"}
              >
                <Container.Root>
                  <Container.Body
                    p={"sm"}
                    border={"1px solid"}
                    borderColor={"border.subtle"}
                    bg={"bg.body"}
                    rounded={theme.radii.component}
                    transition={"150ms"}
                    _hover={{
                      bg: "bg.subtle",
                    }}
                  >
                    <HStack
                      align={"center"}
                      justify={"space-between"}
                      w={"full"}
                      gap={"sm"}
                    >
                      {/* Left: Radio Select Clickable Area */}
                      <HStack
                        align={"center"}
                        gap={"sm"}
                        flex={1}
                        minW={0}
                        cursor={"pointer"}
                        onClick={() => onSelectFeature(feat.id)}
                      >
                        <RadioIndicator checked={isSelected} />
                        <VStack align={"start"} gap={0} flex={1} minW={0}>
                          <P
                            fontWeight={isSelected ? "semibold" : "medium"}
                            fontSize={"sm"}
                            truncate
                          >
                            {feat.name}
                          </P>
                          {feat.areaHa > 0 && (
                            <P fontSize={"xs"} color={"fg.subtle"}>
                              {`Luas: ${formatNumber(feat.areaHa, { maximumFractionDigits: 2 })} ha`}
                            </P>
                          )}
                        </VStack>
                      </HStack>

                      {/* Right: Actions (Map Toggle & Zoom) */}
                      <HStack align={"center"} gap={"xs"} flexShrink={0}>
                        <Tooltip
                          content={
                            feat.isVisibleOnMap
                              ? "Sembunyikan di Peta"
                              : "Tampilkan di Peta"
                          }
                        >
                          <HStack align={"center"} gap={1}>
                            <Switch
                              size={"sm"}
                              checked={feat.isVisibleOnMap}
                              onCheckedChange={() =>
                                onToggleFeatureVisibility(feat.id)
                              }
                            />
                          </HStack>
                        </Tooltip>

                        {map && (
                          <Tooltip content={"Zoom ke Area"}>
                            <IconButton
                              size={"xs"}
                              variant={"ghost"}
                              aria-label={"Zoom ke Area"}
                              onClick={() => {
                                highlightFeatureOnMap(map, feat.polygon);
                              }}
                            >
                              <AppIcon icon={FocusIcon} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </HStack>
                    </HStack>
                  </Container.Body>
                </Container.Root>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Separator borderColor={"bg.canvas"} />

      {/* Footer Confirm Action */}
      <VStack p={"md"} bg={"bg.body"} w={"full"}>
        <Button
          primary
          w={"full"}
          disabled={!selectedFeatureId}
          onClick={onConfirmSelection}
        >
          <AppIcon icon={CheckIcon} />
          {"Konfirmasi & Gunakan AOI Ini"}
        </Button>
      </VStack>
    </VStack>
  );
});

// -------------------------------------------------------------------------------------

const UploadAoiConfirmedAttributeList = memo(
  (props: MitraDataRequestUploadAoiAttributeViewProps) => {
    // Props
    const { aoiCqlFilter, confirmedPolygon, onResetAoi } = props;

    // Stores
    const map = useMapInstanceStore((state) => state.map);

    // States
    const [isAoiVisible, setIsAoiVisible] = useState(true);
    const [pageState, setPageState] =
      useState<MitraDataRequestUploadAoiPageState>({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
        selectedItems: [] as FormattedListItem[],
      });

    // Hooks
    const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();

    // Queries — server-side WFS pagination
    const {
      features,
      totalFeatures,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useIgtWfsCatalog({
      page: pageState.page,
      pageSize: pageState.pageSize,
      cqlFilter: aoiCqlFilter,
      typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
      wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
    });

    // Derived Values
    const aoiAreaHa = useMemo(() => {
      if (!confirmedPolygon) return 0;
      return calculateFeatureAreaInHectares(confirmedPolygon);
    }, [confirmedPolygon]);

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
          {/* Header Action Bar */}
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
              align={"center"}
              justify={"space-between"}
              gap={"sm"}
              w={"full"}
            >
              <VStack align={"start"} gap={0}>
                <P fontWeight={"semibold"} fontSize={"md"}>
                  {"Hasil query spasial AOI"}
                </P>
                {aoiAreaHa > 0 && (
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {`Luas AOI: ${formatNumber(aoiAreaHa, { maximumFractionDigits: 2 })} ha`}
                  </P>
                )}
              </VStack>

              <HStack align={"center"} gap={"sm"}>
                {confirmedPolygon && map && (
                  <>
                    <Tooltip
                      content={
                        isAoiVisible
                          ? "Sembunyikan Area (AOI) dari Peta"
                          : "Tampilkan Area (AOI) di Peta"
                      }
                    >
                      <IconButton
                        variant={"outline"}
                        aria-label={"Toggle Visibilitas AOI"}
                        onClick={() => setIsAoiVisible((prev) => !prev)}
                      >
                        <AppIcon icon={isAoiVisible ? EyeIcon : EyeOffIcon} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content={"Zoom ke Area (AOI)"}>
                      <IconButton
                        variant={"outline"}
                        aria-label={"Zoom ke Area (AOI)"}
                        onClick={() => {
                          highlightFeatureOnMap(map, confirmedPolygon);
                        }}
                      >
                        <AppIcon icon={FocusIcon} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                <Tooltip content={"Ganti AOI / Unggah Ulang"}>
                  <IconButton
                    variant={"outline"}
                    colorPalette={"red"}
                    aria-label={"Ganti AOI"}
                    onClick={onResetAoi}
                  >
                    <AppIcon icon={RotateCcwIcon} />
                  </IconButton>
                </Tooltip>
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          <MitraDataRequestIgtLayerDataView
            cqlFilter={aoiCqlFilter}
            aoiPolygon={confirmedPolygon}
            isAoiVisible={isAoiVisible}
            selectionType={"upload_aoi"}
            showFilter={false}
            onSelectIgtLayer={(layer) => {
              selectLayer(layer.id);
            }}
          />
        </VStack>
      );
    }

    // Render Detail Data View
    return (
      <MitraDataRequestDetailAttributeView
        layer={selectedIgtLayer}
        cqlFilter={aoiCqlFilter}
        features={features}
        totalFeatures={totalFeatures}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch();
        }}
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
  },
);
