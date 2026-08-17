// src/features/mitra/data-request/types/mitra.data-request.igt-layer-card-list.type.ts

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";

export type MitraDataRequestIgtLayerCardListProps = {
  cqlFilter?: string;
  onSelectIgtLayer: (layer: IgtLayerItem) => void;
  onApplyFilter?: (filters: IgtFilterValues) => void;
  showFilter?: boolean;
};
