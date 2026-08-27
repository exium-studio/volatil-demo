// src/features/mitra/data-request/hooks/use-selected-igt-layer.ts

import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSelectedIgtLayer = () => {
  const { queryValue: layerId, setQueryValue: setLayerId } =
    useSearchParam("layerId");

  const { data: layersData } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
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
