// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import { Button } from "@/design-system/components/button/ui/button";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { FileItem } from "@/design-system/components/data-display/ui/file-item";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInputTrigger } from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { WFS_LAYER_NAME } from "@/design-system/components/map/constants/map.config";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useWfsClipStore } from "@/design-system/components/map/stores/map.wfs-clip.store";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import {
  MODAL_SEARCH_PARAM_KEY,
  usePopModal,
} from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { toast } from "@/design-system/components/toast";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import {
  WFS_BIDANG_ATTRIBUTE_LABELS,
  WFS_BIDANG_ATTRIBUTES,
} from "@/features/mitra/data-request/constants/mitra.data-request.constant";
import {
  MitraDataRequestUploadAoiContext,
  useMitraDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import type { UploadAoiFileListTriggerProps } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import type GeoJSON from "geojson";
import { FilesIcon, MapPinIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const MitraDataRequestUploadAoiTabsContent = (
  props: TabsContentProps,
) => {
  // States
  const [dataListState, setDataListState] = useState({
    selectedItems: [] as FormattedListItem[],
    uploadedFiles: [] as File[],
  });
  const [wfsFeatures, setWfsFeatures] = useState<GeoJSON.Feature[]>([]);
  const setClippedFeatures = useWfsClipStore(
    (state) => state.setClippedFeatures,
  );
  const resetWfsClipStore = useWfsClipStore((state) => state.reset);

  // Search Params / Hooks
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // Handlers / Effects
  useEffect(() => {
    let isSubscribed = true;

    const readAndFetchWfs = async () => {
      await Promise.resolve();

      if (!isSubscribed) return;

      if (isEmptyArray(dataListState.uploadedFiles)) {
        setWfsFeatures([]);
        resetWfsClipStore();
        return;
      }

      const file = dataListState.uploadedFiles[0];

      try {
        let cqlFilter: string | undefined;

        // Attempt to parse text if file is JSON/GeoJSON
        if (
          file.type.includes("json") ||
          file.name.endsWith(".geojson") ||
          file.name.endsWith(".json")
        ) {
          const text = await file.text();
          const parsed = JSON.parse(text) as GeoJSON.GeoJsonObject;

          if (parsed.type === "FeatureCollection") {
            const fc = parsed as GeoJSON.FeatureCollection;
            const firstGeom = fc.features[0]?.geometry;
            if (firstGeom?.type === "Polygon") {
              const ring = firstGeom.coordinates[0];
              const wktCoords = ring.map((c) => `${c[0]} ${c[1]}`).join(", ");
              cqlFilter = `INTERSECTS(geom, POLYGON((${wktCoords})))`;
            }
          } else if (parsed.type === "Feature") {
            const feat = parsed as GeoJSON.Feature;
            if (feat.geometry?.type === "Polygon") {
              const ring = feat.geometry.coordinates[0];
              const wktCoords = ring.map((c) => `${c[0]} ${c[1]}`).join(", ");
              cqlFilter = `INTERSECTS(geom, POLYGON((${wktCoords})))`;
            }
          }
        }

        const result = await fetchWfs({
          typeName: WFS_LAYER_NAME,
          cqlFilter,
        });

        if (isSubscribed) {
          setWfsFeatures(result.features ?? []);
          setClippedFeatures(result);
        }
      } catch (error) {
        console.error("Failed to process uploaded file or fetch WFS:", error);
        if (isSubscribed) {
          setWfsFeatures([]);
          resetWfsClipStore();
          toast.error("Gagal memproses file AOI atau mengambil data WFS");
        }
      }
    };

    void readAndFetchWfs();

    return () => {
      isSubscribed = false;
    };
  }, [dataListState.uploadedFiles, setClippedFeatures, resetWfsClipStore]);

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

            <VStack
              flex={1}
              gap={PADDING_SM}
              overflowY={"auto"}
              bg={"bg.canvas"}
            >
              <DataList wfsFeatures={wfsFeatures} />

              <MitraDataRequestAddToCartButtons
                selectedItems={dataListState.selectedItems}
                allItems={wfsFeatures}
                totalBidangCount={wfsFeatures.length}
                totalKawasanCount={0}
                totalCount={wfsFeatures.length}
                onAddSelectedClick={() => {
                  const selectedIds = dataListState.selectedItems.map((item) =>
                    String(item.id),
                  );
                  addToCartSelectedMutation.mutate({ itemIds: selectedIds });
                }}
                onAddAllBidangClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "bidang",
                  });
                }}
                onAddAllKawasanClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "kawasan",
                  });
                }}
                onAddAllBothClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "all",
                  });
                }}
              />
            </VStack>
          </>
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

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
          <P textAlign={"center"}>{"File AOI Anda"}</P>
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

type UploadAoiWfsDataListProps = {
  wfsFeatures: GeoJSON.Feature[];
};

const DataList = (props: UploadAoiWfsDataListProps) => {
  // Props
  const { wfsFeatures } = props;

  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((state) => state.map);

  // Contexts
  const { setDataListState } = useMitraDataRequestUploadAoiContext();

  // Derived Values — DataList Configuration
  const dataList = useMemo(
    () => ({
      headers: WFS_BIDANG_ATTRIBUTES.map((key) => ({
        th: WFS_BIDANG_ATTRIBUTE_LABELS[key],
        sortable: key === "id" || key === "kodewilaya",
      })),

      items: wfsFeatures.map((feature) => {
        const featureId = String(feature.properties?.id ?? feature.id ?? "");
        return {
          id: featureId,
          data: feature as unknown as Record<string, unknown>,
          columns: WFS_BIDANG_ATTRIBUTES.map((key) => {
            const val = feature.properties?.[key];
            return {
              value: val ?? "-",
              td: <P fontSize={"sm"}>{String(val ?? "-")}</P>,
              align: "start" as const,
            };
          }),
        };
      }),

      itemActions: [
        (item: FormattedListItem) => {
          const feat = item.data as unknown as GeoJSON.Feature | undefined;
          return (
            <Menu.Item
              key={"fly-to"}
              value={"fly-to"}
              onClick={() => {
                if (!feat?.geometry || !map) return;
                const geom = feat.geometry;
                let lng = 0;
                let lat = 0;

                if (geom.type === "Point") {
                  [lng, lat] = geom.coordinates as [number, number];
                } else if (
                  geom.type === "Polygon" &&
                  geom.coordinates[0]?.length > 0
                ) {
                  const ring = geom.coordinates[0];
                  const sumLng = ring.reduce(
                    (acc: number, c: number[]) => acc + c[0],
                    0,
                  );
                  const sumLat = ring.reduce(
                    (acc: number, c: number[]) => acc + c[1],
                    0,
                  );
                  lng = sumLng / ring.length;
                  lat = sumLat / ring.length;
                } else if (
                  geom.type === "MultiPolygon" &&
                  geom.coordinates[0]?.[0]?.length > 0
                ) {
                  const ring = geom.coordinates[0][0];
                  const sumLng = ring.reduce(
                    (acc: number, c: number[]) => acc + c[0],
                    0,
                  );
                  const sumLat = ring.reduce(
                    (acc: number, c: number[]) => acc + c[1],
                    0,
                  );
                  lng = sumLng / ring.length;
                  lat = sumLat / ring.length;
                }

                if (lng && lat) {
                  map.flyTo({ center: [lng, lat], zoom: 16 });
                }
              }}
            >
              <AppIcon icon={MapPinIcon} />
              {"Lihat di Peta"}
            </Menu.Item>
          );
        },
      ] as DataListItemActionsGenerator[],
    }),
    [wfsFeatures, map],
  );

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        headers={dataList.headers}
        items={dataList.items}
        itemActions={dataList.itemActions}
        canBatchSelect
        pb={0}
        roundedTop={0}
        roundedBottom={theme.radii.container}
        onSelectedItemChange={({ selectedItems }) => {
          setDataListState((prev) => ({ ...prev, selectedItems }));
        }}
        rounded={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>
    </VStack>
  );
};
