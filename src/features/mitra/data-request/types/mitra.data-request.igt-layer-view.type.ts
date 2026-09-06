// src/features/mitra/data-request/types/mitra.data-request.igt-layer-card-list.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import type { SelectionType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

export type MitraDataRequestIgtLayerDataViewProps = {
  cqlFilter?: string;
  selectionType?: SelectionType;
  onSelectIgtLayer: (layer: IgtLayerItem) => void;
  onApplyFilter?: (filters: FilterAdministrativeAreaValues) => void;
  showFilter?: boolean;
};

export type MitraDataRequestDetailAttributeHeaderProps = {
  layer: IgtLayerItem | null;
  cqlFilter?: string;
  onBack?: () => void;
  showActions?: boolean;
};

export type MitraDataRequestDetailAttributeViewProps = {
  layer: IgtLayerItem | null;
  cqlFilter?: string;
  features: GeoJSON.Feature[];
  totalFeatures: number;
  isLoading: boolean;
  isFetching: boolean;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  selectedItems: FormattedListItem[];
  setSelectedItems: (items: FormattedListItem[]) => void;
  showActions?: boolean;
  onBack?: () => void;
};

