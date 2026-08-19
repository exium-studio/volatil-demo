// src/design-system/components/data-display/types/file-item.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type FileItemProps = StackProps & {
  name: string;
  mimeType: string;
  sizeLabel?: string;
  previewUrl?: string;
  disabled?: boolean;
  onDelete?: () => void;
  actionButtons?: React.ReactNode;
};

export type FileIconProps = AppIconProps & {
  mimeType: string;
};
