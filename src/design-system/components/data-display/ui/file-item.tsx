// src/design-system/components/data-display/ui/file-item.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type {
  FileIconProps,
  FileItemProps,
} from "@/design-system/components/data-display/types/file-item.type";
import { getFileIcon } from "@/design-system/components/data-display/utils/file-item.utils";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import { isImageFile } from "@/shared/utils/data/file";
import { ImageOffIcon, XIcon } from "lucide-react";
import { useMemo } from "react";

export const FileItem = (props: FileItemProps) => {
  // Props
  const {
    name,
    mimeType,
    previewUrl,
    sizeLabel,
    disabled,
    onDelete,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      gap={4}
      w={"full"}
      p={3}
      pl={4}
      bg={"bg.body"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={theme.radii.component}
      {...restProps}
    >
      {previewUrl && isImageFile(mimeType) ? (
        <Image
          src={previewUrl}
          alt={name}
          fallback={<AppIcon icon={ImageOffIcon} />}
          w={"20px"}
          h={"20px"}
          objectFit={"cover"}
        />
      ) : (
        <FileIcon mimeType={mimeType} />
      )}

      <ClampedP>{name}</ClampedP>

      <HStack align={"center"} gap={4} ml={"auto"}>
        <P fontSize={"sm"} whiteSpace={"nowrap"} color={"fg.subtle"}>
          {sizeLabel}
        </P>
      </HStack>

      {onDelete && (
        <Tooltip content={t["common.remove_file"]()}>
          <IconButton
            size={"xs"}
            h={"32px"}
            disabled={disabled}
            aria-label={t["common.remove_file"]()}
            onClick={onDelete}
          >
            <AppIcon icon={XIcon} />
          </IconButton>
        </Tooltip>
      )}
    </HStack>
  );
};

export const FileIcon = (props: FileIconProps) => {
  // Props
  const { mimeType, ...restProps } = props;

  // Resolved Values
  const icon = useMemo(() => getFileIcon(mimeType), [mimeType]);

  return <AppIcon icon={icon} {...restProps} />;
};
