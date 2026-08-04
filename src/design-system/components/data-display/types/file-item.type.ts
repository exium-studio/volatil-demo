import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type FileItemProps = StackProps & {
  name: string;
  mimeType: string;
  sizeLabel?: string;
  previewUrl?: string;
};

export type FileIconProps = AppIconProps & {
  mimeType: string;
};
