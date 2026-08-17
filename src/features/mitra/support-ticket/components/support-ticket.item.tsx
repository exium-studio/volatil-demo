// src/features/mitra/support-ticket/components/support-ticket.item.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { TicketItem } from "@/features/mitra/support-ticket/types/support-ticket.type";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  FileIcon,
  ImageIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import { memo, useState } from "react";

export type SupportTicketItemProps = StackProps & {
  ticket: TicketItem;
};

export const SupportTicketItem = memo((props: SupportTicketItemProps) => {
  // Props
  const { ticket, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [isRepliesExpanded, setIsRepliesExpanded] = useState<boolean>(true);

  // Derived Values
  const hasReplies = ticket.replies && ticket.replies.length > 0;

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
          <Box
            p={2}
            rounded={theme.radii.component}
            bg={"bg.subtle"}
            color={"fg.muted"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <AppIcon icon={UserIcon} size={"sm"} />
          </Box>

          <P fontWeight={"semibold"}>{ticket.authorName}</P>

          {ticket.status === "pending" && (
            <AppIcon icon={ClockIcon} size={"xs"} color={"amber.500"} />
          )}
        </HStack>

        <P color={"fg.muted"}>{ticket.createdAt}</P>
      </HStack>

      {/* Title & Body Description */}
      <VStack align={"start"} gap={1}>
        <P fontWeight={"bold"} color={"fg.default"}>
          {ticket.title}
        </P>
        <P color={"fg.muted"}>{ticket.description}</P>
      </VStack>

      {/* Attachments */}
      {ticket.attachments && ticket.attachments.length > 0 && (
        <HStack gap={2} wrap={"wrap"}>
          {ticket.attachments.map((att) => {
            const IconComp =
              att.fileType === "image"
                ? ImageIcon
                : att.fileType === "video"
                  ? VideoIcon
                  : FileIcon;

            return (
              <Badge
                key={att.id}
                variant={"outline"}
                colorPalette={"gray"}
                p={1.5}
              >
                <AppIcon icon={IconComp} size={"xs"} mr={1} />
                {att.fileName}
              </Badge>
            );
          })}
        </HStack>
      )}

      {/* Reply Toggle Actions */}
      {hasReplies && (
        <HStack justify={"end"} align={"center"} w={"full"} pt={1}>
          <Button
            size={"xs"}
            variant={"ghost"}
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

      {/* Admin Reply Section */}
      {hasReplies && isRepliesExpanded && (
        <VStack gap={2} align={"stretch"} pt={2}>
          {ticket.replies?.map((reply) => {
            return (
              <Box
                key={reply.id}
                p={PADDING.sm}
                bg={"bg.subtle"}
                rounded={theme.radii.component}
              >
                <VStack align={"stretch"} gap={2}>
                  <HStack justify={"space-between"} align={"center"} w={"full"}>
                    <HStack gap={2} align={"center"}>
                      <Box
                        p={1.5}
                        rounded={"full"}
                        bg={`${theme.colorPalette}.subtle`}
                        color={`${theme.colorPalette}.fg`}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        <AppIcon icon={UserIcon} size={"xs"} />
                      </Box>

                      <P fontWeight={"bold"}>{reply.authorName}</P>

                      {reply.isVerified && (
                        <AppIcon
                          icon={CheckCircle2Icon}
                          size={"xs"}
                          color={"green.500"}
                        />
                      )}
                    </HStack>

                    <P color={"fg.muted"}>{reply.createdAt}</P>
                  </HStack>

                  <P color={"fg.default"}>{reply.content}</P>
                </VStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
});
