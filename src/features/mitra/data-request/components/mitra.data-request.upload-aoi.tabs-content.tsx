// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { FileItem } from "@/design-system/components/data-display/ui/file-item";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  FileInput,
  FileInputTrigger,
} from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
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
import { toast } from "@/design-system/components/toast";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { WfsIgtFilterTrigger } from "@/features/mitra/data-request/components/wfs-igt-filter";
import {
  MitraDataRequestUploadAoiContext,
  useMitraDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useMitraUploadAoi } from "@/features/mitra/data-request/hooks/use-mitra-upload-aoi";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import type {
  MitraDataRequestUploadAoiAddFileButtonProps,
  MitraDataRequestUploadAoiDataListProps,
  MitraDataRequestUploadAoiFileListTriggerProps,
  MitraDataRequestUploadAoiLayer,
  MitraDataRequestUploadAoiPageState,
  MitraDataRequestUploadAoiTabsContentProps,
} from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import {
  FilesIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  TrashIcon,
} from "lucide-react";
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
  const { selectedIgtLayer } = useIgtLayerStore();

  // States
  const [aoiLayers, setAoiLayers] = useState<MitraDataRequestUploadAoiLayer[]>(
    [],
  );
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});

  // Hooks
  useMitraUploadAoi(map, aoiLayers);
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

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
      toast.error(
        `"${file.name}": format tidak didukung (.zip/.shp/.geojson/.json)`,
      );
      return;
    }

    // Validate size (10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error(`"${file.name}": ukuran file maksimal 10MB`);
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
        toast.error(`"${file.name}": tidak ada polygon yang ditemukan`);
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
      toast.error(`"${file.name}": gagal memproses file`);
      setAoiLayers((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
                ...l,
                status: "error" as const,
                errorMessage:
                  error instanceof Error ? error.message : "Unknown error",
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
  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isAoiFileModalOpen && !hasLayers) {
          back();
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
          <Box flex={1} p={PADDING.md} display={"flex"} flexDir={"column"}>
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
                    <AppIcon icon={PlusIcon} />
                    {"Upload AOI"}
                  </>
                ),
              }}
              flex={1}
              h={"full"}
            />
          </Box>
        )}

        {hasLayers && (
          <>
            <VStack
              wrap={"wrap"}
              justify={"space-between"}
              gap={SPACING.md}
              p={PADDING.md}
            >
              <HStack
                wrap={"wrap"}
                align={"center"}
                justify={"space-between"}
                gap={SPACING.sm}
              >
                <HStack gap={SPACING.sm}>
                  <SearchInput placeholder={t["action.search"]()} />

                  <WfsIgtFilterTrigger
                    onApply={(filters) => {
                      setAppliedFilters(filters);
                    }}
                  >
                    <IconButton variant={"outline"}>
                      <AppIcon icon={SlidersHorizontalIcon} />
                    </IconButton>
                  </WfsIgtFilterTrigger>
                </HStack>

                <HStack align={"center"} gap={SPACING.sm}>
                  <MitraDataRequestUploadAoiFileListTrigger
                    onFilesAdded={handleFilesAdded}
                    onDeleteLayer={handleDeleteLayer}
                    onClearAll={handleClearAll}
                  >
                    <Button variant={"outline"}>
                      <AppIcon icon={FilesIcon} />
                      {`File AOI anda (${aoiLayers.length})`}
                    </Button>
                  </MitraDataRequestUploadAoiFileListTrigger>

                  <MitraDataRequestUploadAoiAddFileButton
                    isIconButton
                    onFilesAdded={handleFilesAdded}
                    variant={"outline"}
                  />
                </HStack>
              </HStack>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            <MitraDataRequestUploadAoiDataList
              aoiCqlFilter={aoiCqlFilter}
              appliedFilters={appliedFilters}
              onAddToCartSelected={(selectedIds) =>
                addToCartSelectedMutation.mutate(selectedIds)
              }
              onAddAllBidang={() => {
                if (!selectedIgtLayer) return;
                addToCartAllMutation.mutate({
                  cqlFilter: aoiCqlFilter ?? undefined,
                  typeName: selectedIgtLayer.wfsTypeName,
                  wfsUrl: selectedIgtLayer.wfsUrl ?? "",
                });
              }}
              onAddAllKawasan={() => {
                if (!selectedIgtLayer) return;
                addToCartAllMutation.mutate({
                  cqlFilter: aoiCqlFilter ?? undefined,
                  typeName: selectedIgtLayer.wfsTypeName,
                  wfsUrl: selectedIgtLayer.wfsUrl ?? "",
                });
              }}
              onAddAllBoth={() => {
                if (!selectedIgtLayer) return;
                addToCartAllMutation.mutate({
                  cqlFilter: aoiCqlFilter ?? undefined,
                  typeName: selectedIgtLayer.wfsTypeName,
                  wfsUrl: selectedIgtLayer.wfsUrl ?? "",
                });
              }}
            />
          </>
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

// -------------------------------------------------------------------------------------

const MitraDataRequestUploadAoiAddFileButton = (
  props: MitraDataRequestUploadAoiAddFileButtonProps,
) => {
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
          <AppIcon icon={PlusIcon} />
        </IconButton>
      ) : (
        <Button primary w={"full"} pl={3} {...restProps}>
          <AppIcon icon={PlusIcon} />
          {"Tambah file AOI"}
        </Button>
      )}
    </FileInputTrigger>
  );
};

// -------------------------------------------------------------------------------------

const MitraDataRequestUploadAoiFileListTrigger = (
  props: MitraDataRequestUploadAoiFileListTriggerProps,
) => {
  // Props
  const { children, onFilesAdded, onDeleteLayer, onClearAll } = props;

  // Contexts
  const { aoiLayers } = useMitraDataRequestUploadAoiContext();

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

        <Modal.Body gap={SPACING.sm}>
          {isEmptyArray(aoiLayers) && <NoDataState />}

          {aoiLayers.map((layer) => (
            <FileItem
              key={layer.id}
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
              opacity={layer.status === "error" ? 0.6 : 1}
            />
          ))}
        </Modal.Body>

        <Modal.Footer gap={SPACING.sm}>
          <Button
            flex={1}
            w={"full"}
            variant={"outline"}
            colorPalette={"red"}
            onClick={onClearAll}
          >
            <AppIcon icon={TrashIcon} />
            {"Hapus semua"}
          </Button>

          <MitraDataRequestUploadAoiAddFileButton
            flex={1}
            w={"full"}
            onFilesAdded={onFilesAdded}
            variant={"outline"}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

// -------------------------------------------------------------------------------------

const MitraDataRequestUploadAoiDataList = memo(
  (props: MitraDataRequestUploadAoiDataListProps) => {
    // Props
    const {
      aoiCqlFilter,
      appliedFilters,
      onAddToCartSelected,
      onAddAllBidang,
      onAddAllKawasan,
      onAddAllBoth,
    } = props;

    // States
    const [pageState, setPageState] =
      useState<MitraDataRequestUploadAoiPageState>({
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
        selectedItems: [] as FormattedListItem[],
      });

    // Derived Values — Combine Upload AOI INTERSECTS filter with 5-field filter
    const combinedCqlFilter = useMemo(() => {
      const filterCql = buildWfsCqlFilter(appliedFilters);
      if (aoiCqlFilter && filterCql) {
        return `${aoiCqlFilter} AND ${filterCql}`;
      }
      return aoiCqlFilter ?? filterCql ?? undefined;
    }, [aoiCqlFilter, appliedFilters]);

    // Stores
    const { selectedIgtLayer } = useIgtLayerStore();

    // Queries — server-side WFS pagination
    const {
      features,
      totalFeatures,
      bidangCount,
      kawasanCount,
      isLoading,
      isFetching,
    } = useIgtWfsCatalog({
      page: pageState.page,
      pageSize: pageState.pageSize,
      cqlFilter: combinedCqlFilter,
      typeName: selectedIgtLayer?.wfsTypeName ?? "",
      wfsUrl: selectedIgtLayer?.wfsUrl ?? "",
    });

    // Render
    return (
      <VStack
        flex={1}
        gap={PADDING.sm}
        overflowY={"auto"}
        bg={"bg.canvas"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={PADDING.md} />
        ) : (
          <>
            <TopBarLoader isFetching={isFetching} />

            <WfsIgtDataList
              wfsFeatures={features}
              page={pageState.page}
              pageSize={pageState.pageSize}
              totalFeatures={totalFeatures}
              setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
              setPageSize={(pageSize) =>
                setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
              }
              onSelectedItemChange={({ selectedItems }) =>
                setPageState((prev) => ({ ...prev, selectedItems }))
              }
            />

            <MitraDataRequestAddToCartButtons
              selectedItems={pageState.selectedItems}
              allItems={features}
              totalBidangCount={bidangCount}
              totalKawasanCount={kawasanCount}
              totalCount={totalFeatures}
              onAddSelectedClick={() => {
                const selectedIds = pageState.selectedItems.map((item) =>
                  String(item.id),
                );
                onAddToCartSelected(selectedIds);
              }}
              onAddAllBidangClick={onAddAllBidang}
              onAddAllKawasanClick={onAddAllKawasan}
              onAddAllBothClick={onAddAllBoth}
            />
          </>
        )}
      </VStack>
    );
  },
);
