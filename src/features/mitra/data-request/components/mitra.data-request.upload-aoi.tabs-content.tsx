// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { FileItem } from "@/design-system/components/data-display/ui/file-item";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  FileInput,
  FileInputTrigger,
} from "@/design-system/components/input/ui/file-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { parseShpFile } from "@/design-system/components/map/utils/parse-shp-file";
import {
  MODAL_SEARCH_PARAM_KEY,
  usePopModal,
} from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { toast } from "@/design-system/components/toast";
import { P } from "@/design-system/components/typography/ui/p";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerDataView } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view";
import {
  MitraDataRequestUploadAoiContext,
  useMitraDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useMitraUploadAoi } from "@/features/mitra/data-request/hooks/use-mitra-upload-aoi";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import type {
  MitraDataRequestUploadAoiAttributeViewProps,
  MitraDataRequestUploadAoiLayer,
  MitraDataRequestUploadAoiPageState,
  MitraDataRequestUploadAoiTabsContentProps,
  UploadAoiAddFileButtonProps,
  UploadAoiFileListTriggerProps,
} from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import { FilePlusIcon, FilesIcon, MapPinIcon, TrashIcon } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

// -------------------------------------------------------------------------------------

/** Parses a GeoJSON/JSON file and returns a Polygon Feature, or null. */
const parseGeoJsonFile = async (
  file: File,
): Promise<GeoJSON.Feature<GeoJSON.Polygon> | null> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as GeoJSON.GeoJsonObject;

  if (parsed.type === "FeatureCollection") {
    return unionGeoJsonPolygons(parsed as GeoJSON.FeatureCollection);
  }

  if (parsed.type === "Feature") {
    const feat = parsed as GeoJSON.Feature;
    if (feat.geometry?.type === "Polygon") {
      return feat as GeoJSON.Feature<GeoJSON.Polygon>;
    }
  }

  if (parsed.type === "Polygon") {
    return {
      type: "Feature",
      properties: {},
      geometry: parsed as GeoJSON.Polygon,
    };
  }

  return null;
};

// -------------------------------------------------------------------------------------

export const MitraDataRequestUploadAoiTabsContent = (
  props: MitraDataRequestUploadAoiTabsContentProps,
) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const map = useMapInstanceStore((state) => state.map);
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // States
  const [aoiLayers, setAoiLayers] = useState<MitraDataRequestUploadAoiLayer[]>(
    [],
  );

  // Hooks
  useMitraUploadAoi(map, aoiLayers);

  // Search Params
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  // Handlers — parse a single file, update aoiLayers with status
  const processFile = useCallback(async (file: File) => {
    const id = crypto.randomUUID();

    // Validate extension
    const isShpOrZip = file.name.endsWith(".shp") || file.name.endsWith(".zip");
    const isGeoJson =
      file.name.endsWith(".geojson") || file.name.endsWith(".json");

    if (!isShpOrZip && !isGeoJson) {
      toast.error("Format file tidak didukung", {
        group: "Permohonan Data",
        description: `File "${file.name}" bukan berkas shapefile (.shp/.zip) atau GeoJSON (.geojson/.json).`,
      });
      return;
    }

    // Validate size (10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file melebihi batas", {
        group: "Permohonan Data",
        description: `File "${file.name}" melebihi ukuran maksimum 10MB.`,
      });
      return;
    }

    // Optimistically add layer in "parsing" state
    const placeholder: MitraDataRequestUploadAoiLayer = {
      id,
      fileName: file.name,
      fileSize: file.size,
      // Placeholder polygon — will be replaced on success
      polygon: {
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: [] },
      },
      status: "parsing",
    };
    setAoiLayers((prev) => [...prev, placeholder]);

    try {
      let polygon: GeoJSON.Feature<GeoJSON.Polygon> | null = null;

      if (isShpOrZip) {
        const fc = await parseShpFile(file);
        polygon = unionGeoJsonPolygons(fc);
      } else {
        polygon = await parseGeoJsonFile(file);
      }

      if (!polygon) {
        toast.error("Polygon tidak ditemukan", {
          group: "Permohonan Data",
          description: `Tidak ditemukan geometri polygon yang valid di dalam file "${file.name}".`,
        });
        setAoiLayers((prev) => prev.filter((l) => l.id !== id));
        return;
      }

      setAoiLayers((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, polygon, status: "done" as const } : l,
        ),
      );
    } catch (error) {
      console.error("Failed to parse AOI file:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membaca file";
      toast.error("Gagal memproses file AOI", {
        group: "Permohonan Data",
        description: `File "${file.name}": ${errorMsg}`,
      });
      setAoiLayers((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status: "error" as const,
                errorMessage: errorMsg,
              }
            : l,
        ),
      );
    }
  }, []);

  // Handlers — receive new files from file input (multi-file)
  const handleFilesAdded = useCallback(
    (files: File[]) => {
      if (isEmptyArray(files)) return;
      files.forEach((file) => void processFile(file));
    },
    [processFile],
  );

  // Handlers — delete a single MitraDataRequestUploadAoiLayer
  const handleDeleteLayer = useCallback(
    (id: string) => {
      setAoiLayers((prev) => {
        const remaining = prev.filter((l) => l.id !== id);
        if (isEmptyArray(remaining)) resetWfsClipStore();
        return remaining;
      });
    },
    [resetWfsClipStore],
  );

  // Handlers — clear all
  const handleClearAll = useCallback(() => {
    setAoiLayers([]);
    resetWfsClipStore();
  }, [resetWfsClipStore]);

  // Derived Values — CQL INTERSECTS OR from all "done" layers
  const aoiCqlFilter = useMemo(() => {
    const doneLayers = aoiLayers.filter((l) => l.status === "done");
    if (isEmptyArray(doneLayers)) return null;

    const clauses = doneLayers.map(
      (l) => `INTERSECTS(geom, ${geojsonPolygonToWkt(l.polygon)})`,
    );
    return clauses.length === 1 ? clauses[0] : `(${clauses.join(" OR ")})`;
  }, [aoiLayers]);

  const contextValue = useMemo(
    () => ({ aoiLayers, setAoiLayers }),
    [aoiLayers],
  );

  const hasLayers = !isEmptyArray(aoiLayers);

  // Effects
  const { close } = usePopModal({ modalKey: "aoi-file-list" });
  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isAoiFileModalOpen && !hasLayers) {
          close();
        }
      },
    },
    [isAoiFileModalOpen, hasLayers],
  );

  // Render
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
        {!hasLayers && (
          <Box flex={1} p={"md"} display={"flex"} flexDir={"column"}>
            <FileInput
              variant={"dropzone"}
              label={
                "Upload file AOI untuk melihat data IGT yang tersedia di area tersebut"
              }
              accept={[
                ".zip",
                ".shp",
                ".geojson",
                ".json",
                "application/zip",
                "application/x-zip-compressed",
              ]}
              maxFiles={10}
              maxFileSize={10 * 1024 * 1024}
              onFileChange={({ acceptedFiles }) => {
                handleFilesAdded(acceptedFiles);
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
                    {"Upload AOI"}
                  </>
                ),
              }}
              flex={1}
              h={"full"}
            />
          </Box>
        )}

        {hasLayers && aoiCqlFilter && (
          <UploadAoiAttributeList
            aoiCqlFilter={aoiCqlFilter}
            aoiLayers={aoiLayers}
            onFilesAdded={handleFilesAdded}
            onDeleteLayer={handleDeleteLayer}
            onClearAll={handleClearAll}
          />
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

// -------------------------------------------------------------------------------------

const UploadAoiAddFileButton = (props: UploadAoiAddFileButtonProps) => {
  // Props
  const { isIconButton, onFilesAdded, ...restProps } = props;

  return (
    <FileInputTrigger
      fileInputProps={{
        accept: [
          ".zip",
          ".shp",
          ".geojson",
          ".json",
          "application/zip",
          "application/x-zip-compressed",
        ],
        maxFiles: 10,
        maxFileSize: 10 * 1024 * 1024,
        value: [],
        onFileChange: ({ acceptedFiles }) => {
          onFilesAdded(acceptedFiles);
        },
      }}
    >
      {isIconButton ? (
        <IconButton primary {...restProps}>
          <AppIcon icon={FilePlusIcon} />
        </IconButton>
      ) : (
        <Button primary w={"full"} pl={3} {...restProps}>
          <AppIcon icon={FilePlusIcon} />
          {"Tambah file AOI"}
        </Button>
      )}
    </FileInputTrigger>
  );
};

// -------------------------------------------------------------------------------------

const UploadAoiFileListTrigger = (props: UploadAoiFileListTriggerProps) => {
  // Props
  const { children, onFilesAdded, onDeleteLayer, onClearAll } = props;

  // Contexts
  const { aoiLayers } = useMitraDataRequestUploadAoiContext();
  const map = useMapInstanceStore((state) => state.map);

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "aoi-file-list",
  });

  // Render
  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <Modal.Title fontSize={"lg"}>{"File AOI Anda"}</Modal.Title>

          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={"sm"}>
          {isEmptyArray(aoiLayers) && <NoDataState />}

          {aoiLayers.map((layer) => (
            <HStack key={layer.id} w={"full"} gap={2} align={"center"}>
              <FileItem
                flex={1}
                name={
                  layer.status === "parsing"
                    ? `${layer.fileName} (memproses...)`
                    : layer.status === "error"
                      ? `${layer.fileName} (gagal)`
                      : layer.fileName
                }
                mimeType={""}
                sizeLabel={formatByte(layer.fileSize)}
                onDelete={
                  layer.status === "parsing"
                    ? undefined
                    : () => onDeleteLayer(layer.id)
                }
                actionButtons={
                  layer.status === "done" &&
                  layer.polygon &&
                  map && (
                    <Tooltip content={"Lihat AOI di peta"}>
                      <IconButton
                        aria-label={"Lihat di Peta"}
                        size={"xs"}
                        onClick={() => {
                          highlightFeatureOnMap(map, layer.polygon);
                          close();
                        }}
                      >
                        <AppIcon icon={MapPinIcon} />
                      </IconButton>
                    </Tooltip>
                  )
                }
                opacity={layer.status === "error" ? 0.6 : 1}
              />
            </HStack>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <UploadAoiAddFileButton
              w={"full"}
              onFilesAdded={onFilesAdded}
              variant={"outline"}
            />

            <Button w={"full"} colorPalette={"red"} onClick={onClearAll}>
              <AppIcon icon={TrashIcon} />
              {"Hapus semua"}
            </Button>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

// -------------------------------------------------------------------------------------

const UploadAoiAttributeList = memo(
  (props: MitraDataRequestUploadAoiAttributeViewProps) => {
    // Props
    const { aoiCqlFilter, aoiLayers, onFilesAdded, onDeleteLayer, onClearAll } =
      props;

    // States
    const [pageState, setPageState] =
      useState<MitraDataRequestUploadAoiPageState>({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
        selectedItems: [] as FormattedListItem[],
      });

    // Hooks
    const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();

    // Queries — server-side WFS pagination
    const { features, totalFeatures, isLoading, isFetching } = useIgtWfsCatalog(
      {
        page: pageState.page,
        pageSize: pageState.pageSize,
        cqlFilter: aoiCqlFilter,
        typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
        wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
      },
    );

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
          {/* Header Action Bar — AOI File Management */}
          <VStack
            wrap={"wrap"}
            justify={"space-between"}
            gap={"sm"}
            p={"md"}
            bg={"bg.body"}
            w={"full"}
          >
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <P fontWeight={"semibold"} fontSize={"md"}>
                {`Hasil query spasial AOI`}
              </P>

              <HStack align={"center"} gap={"sm"}>
                <UploadAoiFileListTrigger
                  onFilesAdded={onFilesAdded}
                  onDeleteLayer={onDeleteLayer}
                  onClearAll={onClearAll}
                >
                  <Button variant={"outline"}>
                    <AppIcon icon={FilesIcon} />
                    {`File AOI anda (${aoiLayers.length})`}
                  </Button>
                </UploadAoiFileListTrigger>

                <UploadAoiAddFileButton
                  isIconButton
                  onFilesAdded={onFilesAdded}
                  variant={"outline"}
                />
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          <MitraDataRequestIgtLayerDataView
            cqlFilter={aoiCqlFilter}
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
