// src/features/shared/types/url.data-view.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type UrlDataViewProps = Omit<StackProps, "children"> & {
  url?: string | null;
  label?: string;
  isExternalLink?: boolean;
  maxW?: StackProps["maxW"];
};
