// src/features/mitra/data-request/hooks/use-selected-igt-layer.ts

import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
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
    const list = layersData?.items ?? layersData?.layers;
    if (!layerId || !list) return null;
    return list.find((l) => l.id === layerId) ?? null;
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
