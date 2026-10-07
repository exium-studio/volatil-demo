// src/features/shared/types/ordered-igt-layers-preview.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.order.type";

export type OrderedIgtLayerPreviewItem = {
  id?: string;
  sourceLayerId?: string;
  sourceLayerTitle?: string;
  title?: string;
  igtBasis?: IgtBasisType | string;
  spatialBasis?: IgtBasisType | string;
  featuresCount?: number;
  areaHa?: number;
  unitPrice?: number;
  subtotalPrice?: number;
};

export type OrderedIgtLayersPreviewCellProps = StackProps & {
  items: OrderedIgtLayerPreviewItem[];
  orderNumber?: string;
  coverageHa?: number;
  maxVisible?: number;
  modalKey?: string;
};

export type OrderedIgtLayersPreviewModalContentProps = {
  items: OrderedIgtLayerPreviewItem[];
  orderNumber?: string;
  coverageHa?: number;
  close: () => void;
};
