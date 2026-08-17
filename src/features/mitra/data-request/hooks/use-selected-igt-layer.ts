// src/features/mitra/data-request/hooks/use-selected-igt-layer.ts

import { getIgtLayers } from "@/design-system/components/map/services/map-layers.api";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSelectedIgtLayer = () => {
  const { queryValue: layerId, setQueryValue: setLayerId } =
    useSearchParam("layerId");

  const { data: layersData } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  const selectedIgtLayer = useMemo<IgtLayerItem | null>(() => {
    if (!layerId || !layersData?.layers) return null;
    return layersData.layers.find((l) => l.id === layerId) ?? null;
  }, [layerId, layersData]);

  const selectLayer = (id: string | undefined) => {
    setLayerId(id);
  };

  return {
    layerId,
    selectedIgtLayer,
    selectLayer,
  };
};
