// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { MitraDataRequestIgtLayerList } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer-list";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { IgtFilterTrigger } from "@/features/mitra/data-request/components/igt-filter";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { LocateFixedIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

export const MitraDataRequestCatalogTabsContent = (props: TabsContentProps) => {
  // Stores
  const { selectedIgtLayer, setSelectedIgtLayer } = useIgtLayerStore();
  const { setQueryValue: setLayerId } = useSearchParam("layerId");

  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      {!selectedIgtLayer ? (
        <MitraDataRequestIgtLayerList
          onSelectIgtLayer={(layer) => {
            setSelectedIgtLayer(layer);
            setLayerId(layer.id);
          }}
        />
      ) : (
        <CatalogDataList />
      )}
    </Tabs.Content>
  );
};

// -------------------------------------------------------------------------------------

const CatalogDataList = () => {
  // Stores
  const { theme } = useThemeStore();
  const {
    selectedIgtLayer,
    appliedWfsFilters,
    setAppliedWfsFilters,
    cqlFilter,
  } = useIgtLayerStore();

  // States
  const [pageState, setPageState] = useState({
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    page: 1,
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Hooks (Mutations)
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // Queries
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
    cqlFilter,
    typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
  });

  const layerDisplayName =
    selectedIgtLayer?.title ||
    selectedIgtLayer?.id.split(":")[1] ||
    selectedIgtLayer?.wfs.wfsTypeName.split(":")[1] ||
    selectedIgtLayer?.wfs.wfsTypeName ||
    "";

  // Handlers
  const handleFlyToLayer = () => {
    if (!selectedIgtLayer) return;
    const map = useMapInstanceStore.getState().map;
    if (!map) return;

    const bbox = (selectedIgtLayer.bbox as [number, number, number, number] | undefined) ?? [
      115.083839, -8.850038, 115.251388, -8.23944,
    ];
    map.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      {
        padding: 80,
        maxZoom: 16,
        duration: 1500,
      },
    );
  };

  return (
    <VStack
      flex={1}
      gap={0}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      position={"relative"}
    >
      {/* Action Header — Back button, Layer Name, FlyTo & WFS Filter */}
      <VStack gap={SPACING.sm} w={"full"} p={PADDING.md} bg={"bg.body"}>
        <HStack justify={"space-between"} align={"center"} w={"full"}>
          <HStack gap={SPACING.sm} align={"center"}>
            <BackButton />

            <P fontWeight={"semibold"}>
              {`${layerDisplayName.replace(/_/g, " ")}`}
            </P>
          </HStack>

          <HStack gap={SPACING.sm} align={"center"}>
            <IconButton
              variant={"outline"}
              aria-label={"Terbang ke layer"}
              title={"Terbang ke layer"}
              onClick={handleFlyToLayer}
            >
              <AppIcon icon={LocateFixedIcon} />
            </IconButton>

            <IgtFilterTrigger
              modalKey={"mitra-data-request-igt-detail-filter-modal"}
              value={appliedWfsFilters}
              onApply={(filters) => setAppliedWfsFilters(filters)}
            >
              <IconButton variant={"outline"}>
                <AppIcon icon={SlidersHorizontalIcon} />
              </IconButton>
            </IgtFilterTrigger>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {isLoading ? (
        <Skeleton p={PADDING.md} rounded={0} />
      ) : isEmptyArray(features) ? (
        <VStack
          flex={1}
          align={"center"}
          justify={"center"}
          p={PADDING.md}
          bg={"bg.body"}
        >
          <NoResultState query={selectedIgtLayer?.wfs.wfsTypeName || ""} />
        </VStack>
      ) : (
        <VStack
          flex={1}
          gap={1}
          overflowY={"auto"}
          roundedBottom={theme.radii.container}
        >
          <TopBarLoader isFetching={isFetching} />

          <WfsIgtDataList
            wfsFeatures={features}
            totalFeatures={totalFeatures}
            page={pageState.page}
            pageSize={pageState.pageSize}
            setPage={(page: number) =>
              setPageState((prev) => ({ ...prev, page }))
            }
            setPageSize={(pageSize: number) =>
              setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
            }
            selectedItems={selectedItems}
            onSelectedItemChange={({ selectedItems: items }) =>
              setSelectedItems(items)
            }
          />

          <MitraDataRequestAddToCartButtons
            selectedItems={selectedItems}
            totalBidangCount={bidangCount}
            totalKawasanCount={kawasanCount}
            onAddSelectedClick={() => {
              if (!selectedIgtLayer) return;
              addToCartSelectedMutation.mutate(
                selectedItems.map((item) => String(item.id)),
              );
            }}
            onAddAllBothClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedIgtLayer.wfs.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfs.wfsUrl ?? "",
              });
            }}
          />
        </VStack>
      )}
    </VStack>
  );
};
