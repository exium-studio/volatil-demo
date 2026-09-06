// src/design-system/components/typography/types/url.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type UrlProps = Omit<StackProps, "children"> & {
  url?: string | null;
  label?: string;
  isExternalLink?: boolean;
  maxW?: StackProps["maxW"];
};
