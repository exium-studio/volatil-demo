import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { getLayerCountSummary } from "@/features/mitra/data-request/api/mitra.data-request-wfs-summary.api";
import { IgtFilterTrigger } from "@/features/shared/components/igt-filter";
import { useAddToCartAll } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useIgtFilterStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { IgtFilterValues } from "@/features/shared/types/filter-igt-trigger.type";
import type { MitraDataRequestIgtLayerCardListProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-list.type";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { t } from "@/shared/libs/i18n";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPinIcon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Box } from "@/design-system/components/layout/ui/box";

const IgtLayerCountCell = memo(
  (props: { layer: IgtLayerItem; cqlFilter?: string }) => {
    const { layer, cqlFilter } = props;

    const { data, isLoading } = useQuery({
      queryKey: [
        "igt-layer-count-summary",
        layer.id,
        layer.wfs?.wfsTypeName,
        layer.spatialBasis,
        cqlFilter,
      ],
      queryFn: ({ signal }) =>
        getLayerCountSummary({
          typeName: layer.wfs?.wfsTypeName ?? "",
          wfsUrl: layer.wfs?.wfsUrl ?? "",
          spatialBasis: layer.spatialBasis,
          cqlFilter,
          signal,
        }),
      staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
      return <Skeleton h={"16px"} w={"64px"} />;
    }

    return (
      <P fontSize={"sm"} fontWeight={"medium"} color={"fg.default"}>
        {data?.label ?? "-"}
      </P>
    );
  },
);

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
    const { map } = useMapInstanceStore();
    const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
    const appliedWfsFilters = useIgtFilterStore((s) => s.appliedWfsFilters);
    const setAppliedWfsFilters = useIgtFilterStore(
      (s) => s.setAppliedWfsFilters,
    );
    const storeCqlFilter = useIgtFilterStore((s) => s.cqlFilter);

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

    // Mutations
    const addToCartAllMutation = useAddToCartAll();

    // Handlers
    const handleAddSelectedToCart = () => {
      selectedItems.forEach((item) => {
        const layer = item.data as IgtLayerItem;
        if (layer?.wfs?.wfsTypeName) {
          addToCartAllMutation.mutate({
            cqlFilter: combinedCqlFilter,
            typeName: layer.wfs.wfsTypeName,
            wfsUrl: layer.wfs.wfsUrl ?? "",
          });
        }
      });
    };

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

    // Derived Values - DataList headers, items, itemActions
    const dataList = useMemo(() => {
      const headers: FormattedTableHeader[] = [
        { th: "Layer IGT", sortable: true, align: "start" },
        { th: "Basis IGT", sortable: true, align: "center" },
        { th: "Jumlah / Luas", sortable: false, align: "start" },
        { th: "WFS TypeName", sortable: true, align: "start" },
      ];

      const items: FormattedListItem[] = filteredLayers.map(
        (layer: IgtLayerItem) => {
          const isBidang = layer.spatialBasis === "bidang";
          const layerDisplayName =
            layer.title ||
            layer.id.split(":")[1] ||
            layer.wfs?.wfsTypeName?.split(":")[1] ||
            layer.wfs?.wfsTypeName ||
            layer.id;
          const formattedTitle = layerDisplayName.replace(/_/g, " ");

          return {
            id: layer.id,
            data: layer,
            columns: [
              {
                value: formattedTitle,
                td: <P>{formattedTitle}</P>,
                align: "start",
              },
              {
                value: layer.spatialBasis,
                td: isBidang ? (
                  <Badge colorPalette={"blue"} variant={"subtle"}>
                    {"Bidang"}
                  </Badge>
                ) : (
                  <Badge colorPalette={"orange"} variant={"subtle"}>
                    {"Kawasan"}
                  </Badge>
                ),
                align: "center",
              },
              {
                value: layer.spatialBasis,
                td: (
                  <IgtLayerCountCell
                    layer={layer}
                    cqlFilter={combinedCqlFilter}
                  />
                ),
                align: "start",
              },
              {
                value: layer.wfs?.wfsTypeName ?? "-",
                td: (
                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {layer.wfs?.wfsTypeName ?? "-"}
                  </P>
                ),
                align: "start",
              },
            ],
          };
        },
      );

      const itemActions = [
        (item: FormattedListItem) => {
          const layer = item.data as IgtLayerItem;

          return (
            <Menu.Item
              key={`fly-to-${layer.id}`}
              value={`fly-to-${layer.id}`}
              onClick={() => {
                void flyToIgtLayer(map, layer, {
                  cqlFilter: combinedCqlFilter,
                });
              }}
            >
              <AppIcon icon={MapPinIcon} />
              {"Lihat di Peta"}
            </Menu.Item>
          );
        },
        (item: FormattedListItem) => {
          const layer = item.data as IgtLayerItem;

          return (
            <Menu.Item
              key={`detail-${layer.id}`}
              value={`detail-${layer.id}`}
              onClick={() => onSelectIgtLayer(layer)}
            >
              <AppIcon icon={TablePropertiesIcon} />
              {"Detail Atribut"}
            </Menu.Item>
          );
        },
      ];

      return {
        headers,
        items,
        batchActions: [],
        itemActions,
      };
    }, [filteredLayers, map, combinedCqlFilter, onSelectIgtLayer]);

    return (
      <VStack
        position={"relative"}
        overflowY={"auto"}
        w={"full"}
        bg={"bg.canvas"}
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

        {/* DataList Table */}
        <VStack bg={"bg.canvas"} overflow={"hidden"}>
          {isLoadingLayers ? (
            <Skeleton flex={1} p={PADDING.md} rounded={0} />
          ) : (
            <DataListTable.Root
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              canBatchSelect={true}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: next }) =>
                setSelectedItems(next as FormattedListItem[])
              }
              virtualized={true}
              withNumbering={true}
              roundedTop={0}
              shadow={"none"}
            >
              <DataListTable.Header />
              <DataListTable.Body />
            </DataListTable.Root>
          )}

          <Box
            w={"full"}
            h={PADDING.md}
            bg={"bg.body"}
            roundedBottom={theme.radii.container}
          />
        </VStack>

        {/* Add to Cart Bar */}
        <Box mt={"auto"}>
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={SPACING.sm}
            w={"full"}
            p={PADDING.md}
            mt={PADDING.sm}
            rounded={theme.radii.container}
            bg={"bg.body"}
          >
            <Button
              primary
              w={"full"}
              disabled={selectedItems.length === 0}
              onClick={handleAddSelectedToCart}
            >
              <AppIcon icon={IconShoppingCartPlus} />
              {"Tambah yang dipilih"}
              {selectedItems.length > 0 && ` (${selectedItems.length} IGT)`}
            </Button>
          </HStack>
        </Box>
      </VStack>
    );
  },
);
