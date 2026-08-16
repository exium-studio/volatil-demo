// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { MitraDataRequestIgtLayerCardList } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer-card-list";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { useState } from "react";
import { useSearchParam } from "@/design-system/hooks/use-search-param";

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
        <MitraDataRequestIgtLayerCardList
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
  const { selectedIgtLayer } = useIgtLayerStore();

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
    typeName: selectedIgtLayer?.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfsUrl ?? "",
  });

  const layerDisplayName =
    selectedIgtLayer?.id.split(":")[1] ||
    selectedIgtLayer?.wfsTypeName.split(":")[1] ||
    selectedIgtLayer?.wfsTypeName ||
    "";

  return (
    <VStack
      flex={1}
      gap={0}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      position={"relative"}
    >
      {/* Action Header — Back button & Layer Name */}
      <VStack gap={SPACING.sm} w={"full"} p={PADDING.md} bg={"bg.body"}>
        <HStack justify={"space-between"} align={"center"} w={"full"}>
          <HStack gap={SPACING.sm} align={"center"}>
            <BackButton />

            <P fontWeight={"semibold"}>
              {`${layerDisplayName.replace(/_/g, " ")}`}
            </P>
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
          gap={3}
          py={12}
          bg={"bg.body"}
          w={"full"}
        >
          <NoResultState />
        </VStack>
      ) : (
        <VStack gap={SPACING.sm} overflowY={"auto"}>
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
            onSelectedItemChange={({ selectedItems: sel }) =>
              setSelectedItems(sel)
            }
            roundedBottom={theme.radii.container}
          />

          <MitraDataRequestAddToCartButtons
            selectedItems={selectedItems}
            allItems={features}
            totalBidangCount={bidangCount}
            totalKawasanCount={kawasanCount}
            totalCount={totalFeatures}
            onAddSelectedClick={() => {
              const selectedIds = selectedItems.map((item) => String(item.id));
              addToCartSelectedMutation.mutate(selectedIds);
            }}
            onAddAllBidangClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            onAddAllKawasanClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            onAddAllBothClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            mt={"auto"}
          />
        </VStack>
      )}
    </VStack>
  );
};
