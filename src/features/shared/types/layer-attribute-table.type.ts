// src/features/shared/types/layer-attribute-table.type.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewBatchActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";

export type LayerAttributeTarget =
  | IgtLayerItem
  | MyDataItem
  | {
      id: string;
      title?: string | null;
      label?: string | null;
      spatialBasis?: "bidang" | "kawasan";
      wfsTypeName?: string;
      wmsLayers?: string;
      wfsUrl?: string | null;
      wmsUrl?: string | null;
      externalWfsUrl?: string | null;
      externalWmsUrl?: string | null;
      bbox?: [number, number, number, number] | null;
      wfs?: {
        wfsTypeName: string;
        wfsUrl?: string;
      };
      wms?: {
        layers: string;
        wmsUrl?: string;
      };
    };

export type LayerAttributeTableViewProps = {
  layer?: LayerAttributeTarget | null;
  cqlFilter?: string;
  showActions?: boolean;
  canBatchSelect?: boolean;
  batchActions?: DataViewBatchActionsGenerator[];
  selectedItems?: FormattedListItem[];
  onSelectedItemChange?: (items: FormattedListItem[]) => void;
  onBack?: () => void;
};
