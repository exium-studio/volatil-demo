// src/features/mitra/data-request/components/mitra.data-request.igt-layer-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { IgtFilterTrigger } from "@/features/mitra/data-request/components/igt-filter";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useAddToCartAll } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import type { MitraDataRequestIgtLayerCardListProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-card-list.type";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { t } from "@/shared/libs/i18n";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { IconCurrentLocation, IconShoppingCartPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  Layers2Icon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
  TreesIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

export const MitraDataRequestIgtLayerList = memo(
  (props: MitraDataRequestIgtLayerCardListProps) => {
    // Props
    const {
      cqlFilter: baseCqlFilter,
      onSelectIgtLayer,
      onApplyFilter,
      showFilter = true,
    } = props;

    // Stores
    const { theme } = useThemeStore();
    const {
      enabledLayerIds,
      appliedWfsFilters,
      setAppliedWfsFilters,
      cqlFilter: storeCqlFilter,
    } = useIgtLayerStore();

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");

    // Derived Values
    const debouncedSearch = useDebouncedValue(searchRaw);
    const combinedCqlFilter = useMemo(() => {
      if (baseCqlFilter && storeCqlFilter) {
        return `${baseCqlFilter} AND ${storeCqlFilter}`;
      }
      return baseCqlFilter ?? storeCqlFilter ?? undefined;
    }, [baseCqlFilter, storeCqlFilter]);

    // Queries — list of all active IGT layers
    const { data: layersData, isLoading: isLoadingLayers } = useQuery({
      queryKey: ["igt-layers-list"],
      queryFn: () => getIgtLayers(),
      staleTime: Infinity,
    });

    const activeLayers = useMemo(() => layersData?.layers ?? [], [layersData]);

    // Only show layers that are toggled on via MapIgtLayerSelect
    const enabledLayers = useMemo(() => {
      return activeLayers.filter((l) => enabledLayerIds[l.id] !== false);
    }, [activeLayers, enabledLayerIds]);

    const filteredLayers = useMemo(() => {
      if (!debouncedSearch) return enabledLayers;
      const lower = debouncedSearch.toLowerCase();
      return enabledLayers.filter(
        (l) =>
          l.id.toLowerCase().includes(lower) ||
          l.wfs?.wfsTypeName?.toLowerCase().includes(lower) ||
          l.title?.toLowerCase().includes(lower),
      );
    }, [enabledLayers, debouncedSearch]);

    // Handlers
    const handleApplyFilters = (filters: IgtFilterValues) => {
      setAppliedWfsFilters(filters);
      onApplyFilter?.(filters);
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
        {/* Header Action Bar */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.sm}
          w={"full"}
          p={PADDING.md}
          bg={"bg.body"}
        >
          <HStack gap={SPACING.sm}>
            <SearchInput
              placeholder={t["action.search"]()}
              value={searchRaw}
              onValueChange={(val) => setSearchRaw(val)}
            />

            {showFilter && (
              <IgtFilterTrigger
                modalKey={"mitra-data-request-igt-card-filter-modal"}
                value={appliedWfsFilters}
                onApply={handleApplyFilters}
              >
                <IconButton variant={"outline"}>
                  <AppIcon icon={SlidersHorizontalIcon} />
                </IconButton>
              </IgtFilterTrigger>
            )}
          </HStack>

          <P fontSize={"sm"} color={"fg.muted"}>
            {`Menampilkan ${debouncedSearch ? filteredLayers.length : enabledLayers.length} dari ${activeLayers.length} Layer IGT`}
          </P>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        <VStack
          flex={1}
          gap={1}
          overflowY={"auto"}
          roundedBottom={theme.radii.container}
        >
          {isLoadingLayers ? (
            <Skeleton flex={1} p={PADDING.md} rounded={0} />
          ) : (
            <>
              {filteredLayers.map((layer, index) => {
                const isLastIndex = index === filteredLayers.length - 1;

                return (
                  <IgtLayerCardItem
                    key={layer.id}
                    layer={layer}
                    cqlFilter={combinedCqlFilter}
                    onSelectIgtLayer={onSelectIgtLayer}
                    roundedBottom={isLastIndex ? theme.radii.container : 0}
                  />
                );
              })}
            </>
          )}
        </VStack>
      </VStack>
    );
  },
);

// -------------------------------------------------------------------------------------

type IgtLayerCardItemProps = StackProps & {
  layer: IgtLayerItem;
  cqlFilter?: string;
  onSelectIgtLayer: (layer: IgtLayerItem) => void;
};

const IgtLayerCardItem = memo((props: IgtLayerCardItemProps) => {
  // Props
  const { layer, cqlFilter, onSelectIgtLayer, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Handlers
  const handleFlyToLayer = (l: IgtLayerItem) => {
    void flyToIgtLayer(l, { cqlFilter });
  };

  // Hooks (Mutations)
  const addToCartAllMutation = useAddToCartAll();

  const isWfs = Boolean(layer.wfs?.wfsTypeName);

  // Queries — WFS Feature Count for this specific IGT Layer
  const { totalFeatures, isLoading, isFetching } = useIgtWfsCatalog({
    page: 1,
    pageSize: 1,
    cqlFilter: isWfs ? cqlFilter : undefined,
    typeName: isWfs ? layer.wfs.wfsTypeName : "",
    wfsUrl: isWfs ? (layer.wfs.wfsUrl ?? "") : "",
  });

  const layerDisplayName =
    layer.title ||
    layer.id.split(":")[1] ||
    layer.wfs?.wfsTypeName?.split(":")[1] ||
    layer.wfs?.wfsTypeName ||
    layer.id;

  const isBidang = layer.spatialBasis === "bidang";
  const layerIcon = isBidang ? Layers2Icon : TreesIcon;

  return (
    <>
      <TopBarLoader isFetching={isFetching} />

      <HStack
        wrap={"wrap"}
        justify={"space-between"}
        bg={"bg.body"}
        {...restProps}
      >
        <HStack
          flex={"1 0 300px"}
          align={"start"}
          gap={SPACING.md}
          p={PADDING.md}
          colorPalette={isBidang ? "blue" : "orange"}
        >
          <Center
            p={2}
            bg={"colorPalette.subtle"}
            rounded={theme.radii.component}
            color={"fg.emphasized"}
          >
            <AppIcon icon={layerIcon} color={"colorPalette.fg"} />
          </Center>

          <VStack align={"start"} gap={SPACING.md}>
            <VStack>
              <P fontWeight={"semibold"} fontSize={"md"}>
                {layerDisplayName.replace(/_/g, " ")}
              </P>

              <P fontSize={"xs"} color={"fg.muted"}>
                {layer.wfs.wfsTypeName}
              </P>
            </VStack>

            <HStack wrap={"wrap"} align={"center"} gap={SPACING.sm}>
              <HStack gap={SPACING.xs} align={"center"}>
                <P fontSize={"sm"} color={"fg.muted"}>
                  {"Total Fitur Ketersediaan:"}
                </P>
                <P fontSize={"sm"} fontWeight={"bold"}>
                  {formatNumber(totalFeatures)}
                </P>
              </HStack>

              {isBidang ? (
                <Badge colorPalette={"blue"}>{`Bidang`}</Badge>
              ) : (
                <Badge colorPalette={"orange"}>{`Kawasan`}</Badge>
              )}
            </HStack>
          </VStack>
        </HStack>

        {/* Action Row */}
        <HStack
          flex={"0 0 auto"}
          wrap={"wrap"}
          align={"center"}
          gap={SPACING.sm}
          p={PADDING.md}
        >
          <Tooltip content={"Lihat ke layer IGT di peta"}>
            <IconButton
              variant={"outline"}
              aria-label={"Lihat ke layer IGT di peta"}
              onClick={() => handleFlyToLayer(layer)}
            >
              <AppIcon icon={IconCurrentLocation} />
            </IconButton>
          </Tooltip>

          <Tooltip content={"Lihat detail tabel atribut"}>
            <IconButton
              variant={"outline"}
              aria-label={"Lihat detail IGT"}
              onClick={() => onSelectIgtLayer(layer)}
            >
              <AppIcon icon={TablePropertiesIcon} />
            </IconButton>
          </Tooltip>

          <Button
            primary
            disabled={isLoading || totalFeatures === 0}
            onClick={() =>
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: layer.wfs.wfsTypeName,
                wfsUrl: layer.wfs.wfsUrl ?? "",
              })
            }
          >
            <AppIcon icon={IconShoppingCartPlus} />
            {"Tambah IGT"}
          </Button>
        </HStack>
      </HStack>
    </>
  );
});
