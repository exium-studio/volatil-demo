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
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInputTrigger } from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { toast } from "@/design-system/components/toast";
import {
  MODAL_SEARCH_PARAM_KEY,
  usePopModal,
} from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { WfsDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
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
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import type { UploadAoiFileListTriggerProps } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import type GeoJSON from "geojson";
import { FilesIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

/** Parses an uploaded GeoJSON/JSON file and returns a CQL INTERSECTS filter string, or null. */
const parseFileToCqlFilter = async (file: File): Promise<string | null> => {
  if (
    !file.type.includes("json") &&
    !file.name.endsWith(".geojson") &&
    !file.name.endsWith(".json")
  ) {
    return null;
  }

  const text = await file.text();
  const parsed = JSON.parse(text) as GeoJSON.GeoJsonObject;

  let ring: number[][] | undefined;

  if (parsed.type === "FeatureCollection") {
    const fc = parsed as GeoJSON.FeatureCollection;
    const firstGeom = fc.features[0]?.geometry;
    if (firstGeom?.type === "Polygon") {
      ring = firstGeom.coordinates[0];
    }
  } else if (parsed.type === "Feature") {
    const feat = parsed as GeoJSON.Feature;
    if (feat.geometry?.type === "Polygon") {
      ring = feat.geometry.coordinates[0];
    }
  }

  if (!ring) return null;

  const wktCoords = ring.map((c) => `${c[0]} ${c[1]}`).join(", ");
  return `INTERSECTS(geom, POLYGON((${wktCoords})))`;
};

// -------------------------------------------------------------------------------------

export const MitraDataRequestUploadAoiTabsContent = (
  props: TabsContentProps,
) => {
  // States
  const [dataListState, setDataListState] = useState({
    selectedItems: [] as FormattedListItem[],
    uploadedFiles: [] as File[],
  });
  const [aoiCqlFilter, setAoiCqlFilter] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});

  // Search Params / Hooks
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // Handlers / Effects — parse uploaded file → derive CQL filter
  useEffect(() => {
    let isSubscribed = true;

    const processFile = async () => {
      await Promise.resolve();

      if (!isSubscribed) return;

      if (isEmptyArray(dataListState.uploadedFiles)) {
        setAoiCqlFilter(null);
        return;
      }

      const file = dataListState.uploadedFiles[0];

      try {
        const cqlFilter = await parseFileToCqlFilter(file);

        if (isSubscribed) {
          setAoiCqlFilter(cqlFilter);
        }
      } catch (error) {
        console.error("Failed to parse AOI file:", error);
        if (isSubscribed) {
          setAoiCqlFilter(null);
          toast.error("Gagal memproses file AOI");
        }
      }
    };

    void processFile();

    return () => {
      isSubscribed = false;
    };
  }, [dataListState.uploadedFiles]);

  // Derived Values
  const contextValue = useMemo(
    () => ({
      igtData: null,
      dataListState,
      setDataListState,
    }),
    [dataListState],
  );

  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isAoiFileModalOpen && isEmptyArray(dataListState.uploadedFiles)) {
          back();
        }
      },
    },
    [isAoiFileModalOpen, dataListState.uploadedFiles],
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
        {isEmptyArray(dataListState.uploadedFiles) && (
          <NoDataState
            description={
              "Upload file AOI untuk melihat data IGT yang tersedia di area tersebut"
            }
          >
            <AddFileButton />
          </NoDataState>
        )}

        {!isEmptyArray(dataListState.uploadedFiles) && (
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
                  <FileListTrigger>
                    <Button variant={"outline"}>
                      <AppIcon icon={FilesIcon} />
                      {`File AOI anda (${dataListState.uploadedFiles.length})`}
                    </Button>
                  </FileListTrigger>

                  <AddFileButton variant={"outline"} />
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

const AddFileButton = (props: ButtonProps) => {
  // Contexts
  const { dataListState, setDataListState } =
    useMitraDataRequestUploadAoiContext();

  return (
    <FileInputTrigger
      fileInputProps={{
        maxFiles: 1,
        value: dataListState.uploadedFiles,
        onFileChange: ({ acceptedFiles }) => {
          setDataListState((prev) => ({
            ...prev,
            uploadedFiles: acceptedFiles,
          }));
        },
      }}
    >
      <Button primary pl={3} {...props}>
        <AppIcon icon={PlusIcon} />
        {"Tambah file .shp"}
      </Button>
    </FileInputTrigger>
  );
};

// -------------------------------------------------------------------------------------

const FileListTrigger = (props: UploadAoiFileListTriggerProps) => {
  // Props
  const { children } = props;

  // Contexts
  const { dataListState, setDataListState } =
    useMitraDataRequestUploadAoiContext();

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
          {isEmptyArray(dataListState.uploadedFiles) && <NoDataState />}

          {dataListState.uploadedFiles.map((file, index) => (
            <FileItem
              key={index}
              name={file.name}
              mimeType={file.type}
              sizeLabel={formatByte(file.size)}
              onDelete={() => {
                setDataListState((prev) => ({
                  ...prev,
                  uploadedFiles: prev.uploadedFiles.filter(
                    (_, i) => i !== index,
                  ),
                }));
              }}
            />
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button
            flex={1}
            _hover={{
              color: "fg.error",
            }}
            onClick={() => {
              setDataListState((prev) => ({
                ...prev,
                uploadedFiles: [],
              }));
            }}
          >
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

          <WfsDataList
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
