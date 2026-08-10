// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { FileItem } from "@/design-system/components/data-display/ui/file-item";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInputTrigger } from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
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
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { WfsIgtFilterTrigger } from "@/features/mitra/data-request/components/wfs-igt-filter";
import {
  MitraDataRequestUploadAoiContext,
  useMitraDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useMitraUploadAoi } from "@/features/mitra/data-request/hooks/use-mitra-upload-aoi";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import type { AoiLayer } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import type { UploadAoiFileListTriggerProps } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import { FilesIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react";
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
  props: TabsContentProps,
) => {
  // Stores
  const map = useMapInstanceStore((state) => state.map);
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // States
  const [aoiLayers, setAoiLayers] = useState<AoiLayer[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});

  // Hooks
  useMitraUploadAoi(map, aoiLayers);

  // Search Params
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // Handler — parse a single file, update aoiLayers with status
  const processFile = useCallback(async (file: File) => {
    const id = crypto.randomUUID();

    // Validate extension
    const isShp = file.name.endsWith(".shp");
    const isGeoJson =
      file.name.endsWith(".geojson") || file.name.endsWith(".json");

    if (!isShp && !isGeoJson) {
      toast.error(
        `"${file.name}": format tidak didukung (.shp/.geojson/.json)`,
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
    const placeholder: AoiLayer = {
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

      if (isShp) {
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

  // Handler — receive new files from file input (multi-file)
  const handleFilesAdded = useCallback(
    (files: File[]) => {
      if (isEmptyArray(files)) return;
      files.forEach((file) => void processFile(file));
    },
    [processFile],
  );

  // Handler — delete a single AoiLayer
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

  // Handler — clear all
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

  return (
    <MitraDataRequestUploadAoiContext.Provider value={contextValue}>
      <Tabs.Content
        display={"flex"}
        flex={1}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
        {...props}
      >
        {!hasLayers && (
          <NoDataState
            description={
              "Upload file AOI untuk melihat data IGT yang tersedia di area tersebut"
            }
          >
            <AddFileButton onFilesAdded={handleFilesAdded} />
          </NoDataState>
        )}

        {hasLayers && (
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

                <HStack align={"center"} gap={SPACING_SM}>
                  <FileListTrigger
                    onFilesAdded={handleFilesAdded}
                    onDeleteLayer={handleDeleteLayer}
                    onClearAll={handleClearAll}
                  >
                    <Button variant={"outline"}>
                      <AppIcon icon={FilesIcon} />
                      {`File AOI anda (${aoiLayers.length})`}
                    </Button>
                  </FileListTrigger>

                  <AddFileButton
                    onFilesAdded={handleFilesAdded}
                    variant={"outline"}
                  />
                </HStack>
              </HStack>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            <UploadAoiDataList
              aoiCqlFilter={aoiCqlFilter}
              appliedFilters={appliedFilters}
              onAddToCartSelected={(selectedIds) =>
                addToCartSelectedMutation.mutate({ itemIds: selectedIds })
              }
              onAddAllBidang={() =>
                addToCartAllMutation.mutate({
                  source: "upload_aoi",
                  targetBasis: "bidang",
                })
              }
              onAddAllKawasan={() =>
                addToCartAllMutation.mutate({
                  source: "upload_aoi",
                  targetBasis: "kawasan",
                })
              }
              onAddAllBoth={() =>
                addToCartAllMutation.mutate({
                  source: "upload_aoi",
                  targetBasis: "all",
                })
              }
            />
          </>
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

// -------------------------------------------------------------------------------------

type AddFileButtonProps = ButtonProps & {
  onFilesAdded: (files: File[]) => void;
};

const AddFileButton = (props: AddFileButtonProps) => {
  // Props
  const { onFilesAdded, ...buttonProps } = props;

  return (
    <FileInputTrigger
      fileInputProps={{
        accept: [".shp", ".geojson", ".json"],
        maxFiles: 10,
        maxFileSize: 10 * 1024 * 1024,
        value: [],
        onFileChange: ({ acceptedFiles }) => {
          onFilesAdded(acceptedFiles);
        },
      }}
    >
      <Button primary pl={3} {...buttonProps}>
        <AppIcon icon={PlusIcon} />
        {"Tambah file AOI"}
      </Button>
    </FileInputTrigger>
  );
};

// -------------------------------------------------------------------------------------

type FileListTriggerProps = UploadAoiFileListTriggerProps & {
  onFilesAdded: (files: File[]) => void;
  onDeleteLayer: (id: string) => void;
  onClearAll: () => void;
};

const FileListTrigger = (props: FileListTriggerProps) => {
  // Props
  const { children, onFilesAdded, onDeleteLayer, onClearAll } = props;

  // Contexts
  const { aoiLayers } = useMitraDataRequestUploadAoiContext();

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "aoi-file-list",
  });

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

        <Modal.Body gap={SPACING_SM}>
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

        <Modal.Footer gap={SPACING_SM}>
          <AddFileButton
            flex={1}
            onFilesAdded={onFilesAdded}
            variant={"outline"}
          />

          <Button flex={1} _hover={{ color: "fg.error" }} onClick={onClearAll}>
            {"Hapus semua"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

// -------------------------------------------------------------------------------------

type UploadAoiDataListProps = {
  aoiCqlFilter: string | null;
  appliedFilters: WfsIgtFilterValues;
  onAddToCartSelected: (selectedIds: string[]) => void;
  onAddAllBidang: () => void;
  onAddAllKawasan: () => void;
  onAddAllBoth: () => void;
};

const UploadAoiDataList = memo((props: UploadAoiDataListProps) => {
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
  const [pageState, setPageState] = useState({
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
  });

  return (
    <VStack
      flex={1}
      gap={PADDING_SM}
      overflowY={"auto"}
      bg={"bg.canvas"}
      position={"relative"}
    >
      {isLoading ? (
        <Skeleton p={PADDING_MD} />
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
});
