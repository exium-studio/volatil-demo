// src/features/mitra/help-center/components/help-center.item.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { HelpCenterItem as HelpCenterItemType } from "@/features/mitra/help-center/types/help-center.type";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  FileIcon,
  ImageIcon,
  UserIcon,
  VerifiedIcon,
} from "lucide-react";
import { memo, useState } from "react";

export type HelpCenterItemProps = StackProps & {
  ticket: HelpCenterItemType;
};

const formatDate = (isoString: string) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

export const HelpCenterItem = memo((props: HelpCenterItemProps) => {
  // Props
  const { ticket, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [isRepliesExpanded, setIsRepliesExpanded] = useState<boolean>(true);

  // Derived Values
  const hasReplies = ticket.responses && ticket.responses.length > 0;

  return (
    <VStack
      w={"full"}
      p={PADDING.md}
      bg={"bg.body"}
      transition={"all 0.2s ease"}
      align={"stretch"}
      gap={SPACING.sm}
      {...restProps}
    >
      {/* Author Header */}
      <HStack justify={"space-between"} align={"center"} w={"full"}>
        <HStack gap={2} align={"center"}>
          <Circle p={2} bg={"bg.subtle"} color={"fg.muted"}>
            <AppIcon icon={UserIcon} />
          </Circle>

          <P fontWeight={"semibold"}>{ticket.user?.name ?? ""}</P>

          {ticket.status === "in_progress" && (
            <AppIcon icon={ClockIcon} color={"blue.fg"} />
          )}
        </HStack>

        <P color={"fg.muted"}>{formatDate(ticket.createdAt)}</P>
      </HStack>

      {/* Title, Description, Attachments */}
      <VStack align={"start"} gap={SPACING.lg} pl={"44px"}>
        <VStack gap={SPACING.sm}>
          <P fontWeight={"bold"} color={"fg.default"}>
            {ticket.title}
          </P>

          <P color={"fg.muted"}>{ticket.description}</P>
        </VStack>

        <HStack w={"full"} justify={"space-between"} gap={SPACING.md}>
          <HStack wrap={"wrap"}>
            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <HStack gap={2} wrap={"wrap"}>
                {ticket.attachments.map((att, idx) => {
                  const isImage = att.mimeType?.startsWith("image/");

                  return (
                    <Badge
                      key={att.fileName || String(idx)}
                      variant={"outline"}
                      colorPalette={"gray"}
                      p={PADDING.sm}
                    >
                      <AppIcon
                        icon={isImage ? ImageIcon : FileIcon}
                        size={"sm"}
                      />
                      {att.originalName || att.fileName}
                    </Badge>
                  );
                })}
              </HStack>
            )}
          </HStack>

          {/* Reply Toggle Actions */}
          {hasReplies && (
            <HStack justify={"end"} align={"center"} w={"full"} pt={1}>
              <Button
                size={"xs"}
                colorPalette={theme.colorPalette}
                onClick={() => setIsRepliesExpanded(!isRepliesExpanded)}
              >
                {isRepliesExpanded ? "Sembunyikan Balasan" : "Lihat Balasan"}
                <AppIcon
                  icon={isRepliesExpanded ? ChevronUpIcon : ChevronDownIcon}
                />
              </Button>
            </HStack>
          )}
        </HStack>
      </VStack>

      {/* Admin Reply Section */}
      {hasReplies && isRepliesExpanded && (
        <VStack gap={2} align={"stretch"} pt={2}>
          {ticket.responses?.map((resp) => {
            return (
              <Box
                key={resp.id}
                p={PADDING.md}
                bg={"bg.subtle"}
                rounded={theme.radii.component}
              >
                <VStack align={"stretch"} gap={2}>
                  <HStack
                    align={"center"}
                    justify={"space-between"}
                    gap={SPACING.md}
                    w={"full"}
                  >
                    <HStack gap={SPACING.md} align={"center"}>
                      <Box
                        p={1.5}
                        rounded={"full"}
                        bg={`${theme.colorPalette}.subtle`}
                        color={`${theme.colorPalette}.fg`}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <AppIcon icon={UserIcon} />
                      </Box>

                      <P fontWeight={"bold"}>
                        {resp.admin?.name ?? "Internal Admin"}
                      </P>

                      <AppIcon icon={VerifiedIcon} color={"green.500"} />
                    </HStack>

                    <P color={"fg.muted"}>{formatDate(resp.createdAt)}</P>
                  </HStack>

                  <VStack pl={"44px"}>
                    <P color={"fg.default"}>{resp.message}</P>
                  </VStack>
                </VStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
});
