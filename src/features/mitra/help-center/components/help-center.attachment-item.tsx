// src/features/mitra/help-center/components/help-center.attachment-item.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { HelpCenterAttachment } from "@/features/mitra/help-center/types/help-center.type";
import {
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import { memo } from "react";

export type HelpCenterAttachmentItemProps = {
  attachment: HelpCenterAttachment;
  index?: number;
};

export const HelpCenterAttachmentItem = memo(
  (props: HelpCenterAttachmentItemProps) => {
    // Props
    const { attachment, index = 0 } = props;

    // Stores
    const { theme } = useThemeStore();

    // Derived Values
    const fileName =
      attachment.originalFileName ??
      attachment.originalName ??
      attachment.storedFileName ??
      attachment.fileName ??
      `Lampiran-${index + 1}`;
    const fileUrl = attachment.fileUrl ?? attachment.url;
    const isImage =
      attachment.mimeType?.startsWith("image/") ||
      attachment.fileType?.startsWith("image/");
    const isVideo =
      attachment.mimeType?.startsWith("video/") ||
      attachment.fileType?.startsWith("video/");

    return (
      <Box
        asChild={Boolean(fileUrl)}
        p={SPACING.sm}
        border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.component}
        bg={"bg.body"}
        cursor={fileUrl ? "pointer" : "default"}
        transition={"all 0.15s ease"}
        _hover={
          fileUrl
            ? {
                bg: "bg.subtle",
                borderColor: "border.emphasized",
              }
            : undefined
        }
      >
        {fileUrl ? (
          <a
            href={fileUrl}
            target={"_blank"}
            rel={"noopener noreferrer"}
            download={!isImage && !isVideo ? fileName : undefined}
          >
            <HStack gap={SPACING.sm} align={"center"}>
              <AppIcon
                icon={isImage ? ImageIcon : isVideo ? VideoIcon : FileIcon}
                size={"sm"}
                color={"fg.muted"}
              />
              <P
                fontSize={"sm"}
                fontWeight={"medium"}
                maxW={"220px"}
                lineClamp={1}
              >
                {fileName}
              </P>
              <AppIcon
                icon={isImage || isVideo ? ExternalLinkIcon : DownloadIcon}
                size={"xs"}
                color={"fg.subtle"}
              />
            </HStack>
          </a>
        ) : (
          <HStack gap={SPACING.sm} align={"center"}>
            <AppIcon
              icon={isImage ? ImageIcon : isVideo ? VideoIcon : FileIcon}
              size={"sm"}
              color={"fg.muted"}
            />
            <P
              fontSize={"sm"}
              fontWeight={"medium"}
              maxW={"220px"}
              lineClamp={1}
            >
              {fileName}
            </P>
          </HStack>
        )}
      </Box>
    );
  },
);
