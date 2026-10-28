// src/features/notification/components/notification.inbox.data-view.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { resolveInboxUI } from "@/features/notification/constants/inbox-code-resolver";
import {
  useClearAllInbox,
  useDeleteInboxItem,
  useInboxQuery,
  useMarkAllInboxAsRead,
  useMarkInboxAsRead,
} from "@/features/notification/hooks/use-inbox.query";
import type { InboxCardItemProps } from "@/features/notification/types/inbox.type";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatRelativeTime } from "@/shared/utils/formatter/date.formatter";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, CheckCheckIcon, InboxIcon, XIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

export const NotificationInboxDataView = memo(() => {
  // Queries & Mutations
  const {
    items,
    isLoading,
    isError,
    error,
    refetch,
    unreadCount = 0,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInboxQuery();

  const markAllAsReadMutation = useMarkAllInboxAsRead();
  const clearAllInboxMutation = useClearAllInbox();
  const markAsReadMutation = useMarkInboxAsRead();
  const deleteInboxMutation = useDeleteInboxItem();

  if (isLoading) {
    return <Skeleton p={"md"} />;
  }

  if (isError) {
    return (
      <Center flex={1} py={"xl"}>
        <StateRetry
          title={"Gagal Memuat Inbox"}
          description={
            error?.message || "Terjadi kesalahan saat memuat pesan inbox."
          }
          onRetry={() => {
            void refetch();
          }}
        />
      </Center>
    );
  }

  if (isEmptyArray(items)) {
    return (
      <StateNoData
        icon={InboxIcon}
        title={"Inbox Kosong"}
        description={"Belum ada pesan atau pengumuman baru untuk Anda."}
      />
    );
  }

  return (
    <VStack flex={1} align={"stretch"} overflowY={"auto"} p={"md"}>
      {/* Inbox Actions Bar */}
      <HStack
        justify={"space-between"}
        align={"center"}
        wrap={"wrap"}
        gap={"xs"}
        mb={"md"}
        w={"full"}
      >
        <P fontSize={"xs"} color={"fg.subtle"}>
          {unreadCount > 0
            ? `${unreadCount} pesan belum dibaca`
            : "Semua pesan telah dibaca"}
        </P>

        <HStack gap={2} wrap={"wrap"}>
          {unreadCount > 0 && (
            <Button
              size={"xs"}
              loading={markAllAsReadMutation.isPending}
              onClick={() => markAllAsReadMutation.mutate()}
            >
              {/* <AppIcon icon={CheckCheckIcon} /> */}
              {"Tandai Semua Dibaca"}
            </Button>
          )}

          <ConfirmationTrigger
            modalKey={"clear-all-notification-inbox"}
            title={"Hapus Semua Pesan Inbox"}
            description={
              "Seluruh pesan inbox akan dihapus dan tidak dapat dikembalikan."
            }
            confirmLabel={"Hapus Semua"}
            colorPalette={"red"}
            onConfirm={() => clearAllInboxMutation.mutate()}
          >
            <Button
              size={"xs"}
              colorPalette={"red"}
              loading={clearAllInboxMutation.isPending}
            >
              {/* <AppIcon icon={Trash2Icon} /> */}
              {t["action.clear_all"]()}
            </Button>
          </ConfirmationTrigger>
        </HStack>
      </HStack>

      {/* Inbox Items List */}
      <VStack align={"stretch"} gap={"sm"}>
        {items.map((item) => (
          <InboxCardItem
            key={item.id}
            item={item}
            onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
            onDelete={(id) => deleteInboxMutation.mutate(id)}
          />
        ))}
      </VStack>

      {/* Load More Button if hasNextPage */}
      {hasNextPage && (
        <Center mt={"md"}>
          <Button
            size={"sm"}
            loading={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {"Muat Lebih Banyak"}
          </Button>
        </Center>
      )}
    </VStack>
  );
});

const InboxCardItem = memo((props: InboxCardItemProps) => {
  // Props
  const { item, onMarkAsRead, onDelete } = props;

  // Navigation
  const navigate = useNavigate();

  // Stores & Hooks
  const { theme } = useThemeStore();

  // Derived Values
  const resolved = useMemo(() => resolveInboxUI(item), [item]);
  const IconComponent = resolved.icon;
  const colorPalette = resolved.colorPalette;
  const hasAction = Boolean(resolved.actionUrl);

  // Handlers
  const handleNavigate = useCallback(async () => {
    if (!resolved.actionUrl) return;

    if (resolved.actionUrl.startsWith("/")) {
      const [pathname, searchStr] = resolved.actionUrl.split("?");

      // If URL contains activeModalKey, push the base page first so closing the modal goes back to the page
      if (searchStr && searchStr.includes("activeModalKey=")) {
        await navigate({ href: pathname });
      }

      await navigate({ href: resolved.actionUrl });
    } else {
      window.location.href = resolved.actionUrl;
    }
  }, [resolved.actionUrl, navigate]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    void handleNavigate();
  };

  return (
    <HStack
      align={"start"}
      justify={"space-between"}
      p={"sm"}
      gap={["sm", null, "md"]}
      bg={item.isRead ? "bg.body" : "bg.subtle"}
      shadow={"xs"}
      rounded={theme.radii.container}
      w={"full"}
    >
      <Circle
        aspectRatio={1}
        w={"24px"}
        h={"24px"}
        p={1}
        bg={item.isRead ? "bg.muted" : `${colorPalette}.muted`}
        color={item.isRead ? "fg.muted" : `${colorPalette}.fg`}
        flexShrink={0}
        mt={"2px"}
      >
        <AppIcon icon={IconComponent} size={"sm"} />
      </Circle>

      <VStack flex={1} minW={0} gap={"xs"} align={"stretch"}>
        {/* Header*/}
        <VStack gap={"sm"} w={"full"}>
          {/* Title + Dot + Badge */}
          <HStack align={"center"} gap={"sm"}>
            <ClampedP
              fontWeight={item.isRead ? "medium" : "semibold"}
              wordBreak={"break-word"}
            >
              {resolved.title}
            </ClampedP>

            <Badge
              variant={"subtle"}
              colorPalette={colorPalette}
              textTransform={"capitalize"}
              size={"xs"}
              flexShrink={0}
            >
              {item.category}
            </Badge>

            <ConfirmationTrigger
              modalKey={`delete-inbox-item-${item.id}`}
              title={"Hapus Pesan"}
              description={"Pesan ini akan dihapus dari inbox Anda."}
              confirmLabel={"Hapus"}
              colorPalette={"red"}
              onConfirm={() => onDelete(item.id)}
            >
              <IconButton
                size={"2xs"}
                variant={"subtle"}
                aria-label={"Hapus pesan"}
                ml={"auto"}
                rounded={"full"}
                onClick={(e) => e.stopPropagation()}
              >
                <AppIcon icon={XIcon} size={"sm"} />
              </IconButton>
            </ConfirmationTrigger>
          </HStack>

          {/* Date */}
          <P fontSize={"sm"} color={"fg.subtle"} whiteSpace={"nowrap"}>
            {formatRelativeTime(item.createdAt)}
          </P>
        </VStack>

        {/* Message Content */}
        <Box w={"full"} pt={"2xs"}>
          <P
            color={"fg.muted"}
            lineHeight={"tall"}
            fontSize={"sm"}
            wordBreak={"break-word"}
            whiteSpace={"pre-line"}
          >
            {resolved.message}
          </P>
        </Box>

        {/* Action Footer: Navigation Button / Mark As Read */}
        <HStack align={"center"} wrap={"wrap"} gap={"xs"} mt={"xs"}>
          {hasAction && (
            <Button
              variant={"outline"}
              size={"xs"}
              pr={"6px"}
              onClick={handleActionClick}
            >
              {resolved.actionLabel || "Buka"}
              <AppIcon icon={ArrowRightIcon} />
            </Button>
          )}

          {!item.isRead && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(item.id);
              }}
              size={"xs"}
              pr={"6px"}
              color={"fg.muted"}
            >
              {"Tandai dibaca"}
              <AppIcon icon={CheckCheckIcon} />
            </Button>
          )}
        </HStack>
      </VStack>
    </HStack>
  );
});
