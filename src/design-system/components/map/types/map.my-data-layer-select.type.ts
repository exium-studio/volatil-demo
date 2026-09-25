// src\design-system\components\map\types\map.my-data-layer-select.type.ts

// src\design-system\components\map\types\map.my-data-layer-select.type.ts

import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";

export type MapMyDataLayerItemProps = {
  item: MyDataItem;
  isEnabled: boolean;
  opacity: number;
  onToggle: (item: MyDataItem) => void;
  onOpacityChange: (id: string, opacity: number) => void;
};
