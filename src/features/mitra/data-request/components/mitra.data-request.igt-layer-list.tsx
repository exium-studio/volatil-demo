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
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { getLayerCountSummary } from "@/features/mitra/data-request/api/mitra.data-request-wfs-summary.api";
import { useAddToCartAll } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useIgtFilterStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { MitraDataRequestIgtLayerCardListProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-list.type";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { IgtFilterTrigger } from "@/features/shared/components/igt-filter";
import type { IgtFilterValues } from "@/features/shared/types/filter-igt-trigger.type";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MapPinIcon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
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
    const { map } = useMapInstanceStore();
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
      // Administrative filter from useIgtFilterStore is only applied when showFilter is true (Catalog tab)
      const activeStoreCql = showFilter ? storeCqlFilter : undefined;

      if (baseCqlFilter && activeStoreCql) {
        return `${baseCqlFilter} AND ${activeStoreCql}`;
      }
      return baseCqlFilter ?? activeStoreCql ?? undefined;
    }, [baseCqlFilter, storeCqlFilter, showFilter]);

    // Queries — list of all active IGT layers
    const isLoadingLayers = false;
    const {
      data: layersData,
      // isLoading: isLoadingLayers
    } = useQuery({
      queryKey: ["igt-layers-list"],
      queryFn: () => getIgtLayers(),
      staleTime: Infinity,
    });

    const activeLayers = useMemo(() => layersData?.layers ?? [], [layersData]);

    const filteredLayers = useMemo(() => {
      if (!debouncedSearch) return activeLayers;
      const lower = debouncedSearch.toLowerCase();
      return activeLayers.filter(
        (l) =>
          l.id.toLowerCase().includes(lower) ||
          l.wfs?.wfsTypeName?.toLowerCase().includes(lower) ||
          l.title?.toLowerCase().includes(lower),
      );
    }, [activeLayers, debouncedSearch]);

    // Handlers
    const handleApplyFilters = (filters: IgtFilterValues) => {
      setAppliedWfsFilters(filters);
      onApplyFilter?.(filters);
    };

    // Derived Values - DataList headers, items, itemActions
    const dataList = useMemo(() => {
      const headers: FormattedTableHeader[] = [
        { th: "Layer IGT", sortable: true, align: "start" },
        { th: "Basis IGT", sortable: true, align: "start" },
        { th: "Jumlah / Luas", sortable: false, align: "start" },
        {
          th: "",
          sortable: false,
          align: "center",
          headerCellProps: {
            pos: "sticky",
            right: "48px",
            zIndex: 11,
            justify: "center",
          },
        },
      ];

      const items: FormattedListItem<IgtLayerItem>[] = filteredLayers.map(
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
                align: "start",
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
                value: layer.id,
                td: (
                  <Tooltip content={"Masukkan ke keranjang"}>
                    <IconButton
                      primary
                      variant={"outline"}
                      aria-label={"Masukkan ke keranjang"}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (layer?.wfs?.wfsTypeName) {
                          addToCartAllMutation.mutate({
                            cqlFilter: combinedCqlFilter,
                            typeName: layer.wfs.wfsTypeName,
                            wfsUrl: layer.wfs.wfsUrl ?? "",
                          });
                        }
                      }}
                    >
                      <AppIcon icon={IconShoppingCartPlus} />
                    </IconButton>
                  </Tooltip>
                ),
                align: "center",
                bodyCellProps: {
                  pos: "sticky",
                  right: "56px",
                  zIndex: 2,
                  w: "56px",
                  px: "10px",
                  justify: "center",
                  ml: "auto",
                  onClick: (e: React.MouseEvent) => e.stopPropagation(),
                },
              },
            ],
          };
        },
      );

      const itemActions = [
        {
          key: "fly-to-map",
          label: "Lihat di Peta",
          icon: MapPinIcon,
          onClick: (layer: IgtLayerItem) => {
            void flyToIgtLayer(map, layer, {
              cqlFilter: combinedCqlFilter,
            });
          },
        },
        {
          key: "detail-attribute",
          label: "Detail Atribut",
          icon: TablePropertiesIcon,
          onClick: (layer: IgtLayerItem) => {
            onSelectIgtLayer(layer);
          },
        },
      ];

      return {
        headers,
        items,
        batchActions: [],
        itemActions,
      };
    }, [
      filteredLayers,
      combinedCqlFilter,
      addToCartAllMutation,
      map,
      onSelectIgtLayer,
    ]);

    return (
      <VStack
        flex={1}
        position={"relative"}
        overflowY={"auto"}
        w={"full"}
        // bg={"bg.canvas"}
      >
        {/* Header Action Bar */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.sm}
          w={"full"}
          p={SPACING.md}
          bg={"bg.body"}
        >
          <HStack gap={SPACING.sm}>
            <SearchInput
              placeholder={"Cari nama / layer IGT"}
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
            {`Menampilkan ${debouncedSearch ? filteredLayers.length : activeLayers.length} dari ${activeLayers.length} Layer IGT`}
          </P>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* DataList Table */}
        <VStack
          flex={1}
          bg={"bg.body"}
          overflow={"clip"}
          roundedBottom={theme.radii.container}
        >
          {isLoadingLayers && <Skeleton flex={1} p={SPACING.md} rounded={0} />}

          {!isLoadingLayers && (
            <DataListTable.Root<IgtLayerItem>
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              canBatchSelect={true}
              selectedItems={selectedItems as FormattedListItem<IgtLayerItem>[]}
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
        </VStack>

        {/* Add to Cart Bar */}
        <Box mt={"auto"}>
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={SPACING.sm}
            w={"full"}
            p={SPACING.md}
            mt={SPACING.sm}
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
