// src/features/mitra/data-request/types/mitra.data-request.igt-layer-card-list.type.ts

import type { WfsLayerConfig } from "@/design-system/components/map/types/map.type";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";

export type MitraDataRequestIgtLayerCardListProps = {
  cqlFilter?: string;
  onSelectIgtLayer: (layer: WfsLayerConfig) => void;
  onApplyFilter?: (filters: WfsIgtFilterValues) => void;
};
