// src/features/notification/components/notification.item.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import type { NotificationItem } from "@/features/notification/types/notification.type";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  CheckIcon,
  InfoIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { memo, useMemo } from "react";

export type NotificationItemCardProps = {
  item: NotificationItem;
  onMarkRead: (id: string, sourceType: "toast" | "system") => void;
  onDelete: (id: string, sourceType: "toast" | "system") => void;
};

export const NotificationItemCard = memo((props: NotificationItemCardProps) => {
  // Props
  const { item, onMarkRead, onDelete } = props;

  // Derived Values: Icons & Colors per variant
  const variantConfig = useMemo(() => {
    switch (item.variant) {
      case "success":
        return {
          icon: CheckCircle2Icon,
          color: "green.500",
          bgColor: "green.500/10",
        };
      case "error":
        return {
          icon: AlertCircleIcon,
          color: "red.500",
          bgColor: "red.500/10",
        };
      case "warning":
        return {
          icon: AlertTriangleIcon,
          color: "amber.500",
          bgColor: "amber.500/10",
        };
      case "loading":
        return {
          icon: Loader2Icon,
          color: "blue.500",
          bgColor: "blue.500/10",
        };
      case "info":
      default:
        return {
          icon: InfoIcon,
          color: "blue.400",
          bgColor: "blue.400/10",
        };
    }
  }, [item.variant]);

  // Formatted Time Ago
  const formattedTime = useMemo(() => {
    const diff = Math.floor((Date.now() - item.timestamp) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return new Date(item.timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [item.timestamp]);

  return (
    <Box
      p={PADDING.sm}
      bg={item.read ? "bg.panel" : "bg.muted/30"}
      borderWidth={"1px"}
      borderColor={item.read ? "border.subtle" : "border.emphasized"}
      rounded={"md"}
      transition={"all 0.2s ease"}
      _hover={{
        borderColor: "border.emphasized",
        shadow: "xs",
      }}
    >
      <HStack align={"center"} gap={PADDING.sm} w={"full"}>
        {/* Variant Icon */}
        <Box
          p={2}
          rounded={"full"}
          bg={variantConfig.bgColor}
          color={variantConfig.color}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <AppIcon icon={variantConfig.icon} size={"sm"} />
        </Box>

        {/* Content Details */}
        <HStack
          flex={1}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.md}
        >
          <VStack flex={1} align={"start"} gap={1}>
            <HStack wrap={"wrap"} gap={SPACING.sm} w={"full"}>
              {/* Source Tag Badge */}
              <Badge
                size={"xs"}
                colorPalette={item.sourceType === "toast" ? "purple" : "blue"}
                variant={"subtle"}
              >
                {item.sourceType === "toast"
                  ? "Toast Notification"
                  : "System Inbox"}
              </Badge>

              {item.category && (
                <Badge size={"xs"} variant={"outline"}>
                  {item.category}
                </Badge>
              )}
            </HStack>

            <ClampedP
              fontWeight={item.read ? "medium" : "semibold"}
              color={"fg.default"}
              fontSize={"sm"}
            >
              {item.title}
            </ClampedP>

            {item.description && (
              <ClampedP fontSize={"xs"} color={"fg.muted"} maxLines={2}>
                {item.description}
              </ClampedP>
            )}
          </VStack>

          <ClampedP fontSize={"xs"} color={"fg.muted"}>
            {formattedTime}
          </ClampedP>
        </HStack>

        {/* Action Buttons */}
        <HStack align={"center"} gap={1}>
          {!item.read && (
            <IconButton
              size={"xs"}
              variant={"ghost"}
              onClick={() => onMarkRead(item.id, item.sourceType)}
              title={"Tandai dibaca"}
            >
              <AppIcon icon={CheckIcon} />
            </IconButton>
          )}

          <IconButton
            size={"xs"}
            variant={"ghost"}
            colorPalette={"red"}
            onClick={() => onDelete(item.id, item.sourceType)}
            title={"Hapus notifikasi"}
          >
            <AppIcon icon={Trash2Icon} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  );
});
