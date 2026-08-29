// src/features/mitra/data-request/types/mitra.data-request.igt-layer-card-list.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

export type MitraDataRequestIgtLayerDataViewProps = {
  cqlFilter?: string;
  onSelectIgtLayer: (layer: IgtLayerItem) => void;
  onApplyFilter?: (filters: FilterAdministrativeAreaValues) => void;
  showFilter?: boolean;
};

export type IgtLayerItemProps = StackProps & {
  layer: IgtLayerItem;
  cqlFilter?: string;
  onSelectIgtLayer: (layer: IgtLayerItem) => void;
};
