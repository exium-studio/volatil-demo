// src/features/notification/components/notification.item.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import type { ToastRecord } from "@/design-system/components/toast/types/toast.types";
import { ToastIcon } from "@/design-system/components/toast/ui/toast.icon";
import { TOAST_VARIANT_MAP } from "@/design-system/components/toast/ui/toast.item";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type {
  NotificationItem,
  NotificationStackGroup,
} from "@/features/notification/types/notification.type";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";

export type NotificationStackCardProps = StackProps & {
  stack: NotificationStackGroup;
  onMarkStackRead: (toastId: string) => void;
  onDeleteStack: (toastId: string) => void;
};

export type NotificationItemCardProps = StackProps & {
  item?: NotificationItem;
  stack?: NotificationStackGroup;
  onMarkRead?: (id: string, sourceType: "toast" | "system") => void;
  onMarkStackRead?: (toastId: string) => void;
  onDelete?: (id: string, sourceType: "toast" | "system") => void;
  onDeleteStack?: (toastId: string) => void;
};

const formatTimeAgo = (timestamp: number) => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const NotificationStackCard = memo(
  (props: NotificationStackCardProps) => {
    // Props
    const { stack, onMarkStackRead, onDeleteStack, ...restProps } = props;

    // Stores
    const { theme } = useThemeStore();

    // States
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Derived Values
    const latestItem = stack.latest;
    const historyEntries = useMemo(
      () => stack.entries.slice(1),
      [stack.entries],
    );

    const hasHistoryUpdates = historyEntries.length > 0;
    const isRead = stack.entries.every((e) => e.read);
    const variantInfo =
      TOAST_VARIANT_MAP[latestItem.variant] ?? TOAST_VARIANT_MAP.info;

    // ToastRecord mock payload for ToastIcon compatibility
    const mockRecord = useMemo<ToastRecord>(
      () => ({
        id: latestItem.id,
        group: latestItem.category ?? "default",
        variant: latestItem.variant,
        title: latestItem.title,
        description: latestItem.description,
        status: "visible",
        createdAt: latestItem.timestamp,
        updatedAt: latestItem.timestamp,
        duration: null,
        remainingDuration: null,
        paused: false,
        isDeletedFromHistory: false,
      }),
      [latestItem],
    );

    return (
      <VStack
        p={PADDING.md}
        bg={isRead ? "bg.body" : `${theme.colorPalette}.subtle`}
        transition={"all 0.2s ease"}
        _hover={{
          borderColor: "border.emphasized",
          shadow: "xs",
        }}
        {...restProps}
      >
        <VStack align={"stretch"} gap={SPACING.xs}>
          {/* Primary Latest Entry Header */}
          <HStack align={"start"} gap={PADDING.sm} w={"full"}>
            {/* Toast Icon - Exact Toast Design Language */}
            <ToastIcon
              record={mockRecord}
              icon={variantInfo.icon}
              bg={variantInfo.bg}
              color={variantInfo.color}
            />

            {/* Main Details */}
            <VStack flex={1} align={"start"} gap={1}>
              <HStack justify={"space-between"} w={"full"} wrap={"wrap"}>
                <HStack gap={2}>
                  {/* Source Tag Badge */}
                  <Badge
                    colorPalette={
                      latestItem.sourceType === "toast" ? "purple" : "blue"
                    }
                    variant={"subtle"}
                  >
                    {latestItem.sourceType === "toast"
                      ? "Toast Stack"
                      : "System Inbox"}
                  </Badge>

                  {latestItem.category && (
                    <Badge variant={"outline"}>{latestItem.category}</Badge>
                  )}

                  {hasHistoryUpdates && (
                    <Badge colorPalette={"amber"} variant={"subtle"}>
                      {`${stack.entries.length} Riwayat Status`}
                    </Badge>
                  )}
                </HStack>

                <P color={"fg.muted"}>{formatTimeAgo(latestItem.timestamp)}</P>
              </HStack>

              <ClampedP
                fontWeight={isRead ? "medium" : "semibold"}
                color={variantInfo.color}
              >
                {latestItem.title}
              </ClampedP>

              {latestItem.description && (
                <ClampedP color={"fg.muted"} lineClamp={2}>
                  {latestItem.description}
                </ClampedP>
              )}
            </VStack>

            {/* Quick Action Buttons */}
            <HStack gap={1} align={"center"}>
              {hasHistoryUpdates && (
                <Button
                  variant={"ghost"}
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={"Tampilkan riwayat pembaruan status"}
                >
                  <AppIcon
                    icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                  />
                </Button>
              )}

              {!isRead && (
                <IconButton
                  variant={"ghost"}
                  onClick={() => onMarkStackRead(stack.toastId)}
                  title={"Tandai stack dibaca"}
                >
                  <AppIcon icon={CheckIcon} />
                </IconButton>
              )}

              <IconButton
                variant={"ghost"}
                onClick={() => onDeleteStack(stack.toastId)}
                title={"Hapus stack notifikasi"}
              >
                <AppIcon icon={XIcon} />
              </IconButton>
            </HStack>
          </HStack>

          {/* Expandable Historical Toast Updates Stack (e.g. Loading -> Success) */}
          {hasHistoryUpdates && isExpanded && (
            <VStack
              pl={10}
              pt={2}
              gap={2}
              align={"stretch"}
              borderTopWidth={"1px"}
              borderColor={"border.subtle"}
              mt={1}
            >
              <P fontWeight={"medium"} color={"fg.muted"}>
                {"Riwayat Perubahan Status Toast:"}
              </P>

              {historyEntries.map((prevEntry) => {
                const prevVariantInfo =
                  TOAST_VARIANT_MAP[prevEntry.variant] ??
                  TOAST_VARIANT_MAP.info;

                const prevRecord: ToastRecord = {
                  id: prevEntry.id,
                  group: prevEntry.category ?? "default",
                  variant: prevEntry.variant,
                  title: prevEntry.title,
                  description: prevEntry.description,
                  status: "visible",
                  createdAt: prevEntry.timestamp,
                  updatedAt: prevEntry.timestamp,
                  duration: null,
                  remainingDuration: null,
                  paused: false,
                  isDeletedFromHistory: false,
                };

                return (
                  <HStack
                    key={prevEntry.id}
                    p={2}
                    bg={"bg.subtle"}
                    rounded={"sm"}
                    gap={2}
                    align={"center"}
                  >
                    <ToastIcon
                      record={prevRecord}
                      icon={prevVariantInfo.icon}
                      bg={prevVariantInfo.bg}
                      color={prevVariantInfo.color}
                    />

                    <VStack flex={1} gap={0} align={"start"}>
                      <ClampedP fontWeight={"medium"}>
                        {prevEntry.title}
                      </ClampedP>
                      {prevEntry.description && (
                        <ClampedP color={"fg.muted"}>
                          {prevEntry.description}
                        </ClampedP>
                      )}
                    </VStack>

                    <P color={"fg.muted"}>
                      {formatTimeAgo(prevEntry.timestamp)}
                    </P>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </VStack>
      </VStack>
    );
  },
);

// Alias for compatibility
export const NotificationItemCard = NotificationStackCard;
