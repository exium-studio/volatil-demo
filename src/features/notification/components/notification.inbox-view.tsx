// src/features/notification/components/notification.inbox-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  useClearAllInbox,
  useDeleteInboxItem,
  useInboxQuery,
  useMarkAllInboxAsRead,
  useMarkInboxAsRead,
} from "@/features/notification/hooks/use-inbox.query";
import type {
  InboxCardItemProps,
  InboxCategory,
} from "@/features/notification/types/inbox.type";
import { t } from "@/shared/libs/i18n";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import {
  BellIcon,
  CheckCheckIcon,
  CreditCardIcon,
  HelpCircleIcon,
  InboxIcon,
  InfoIcon,
  Trash2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { memo, useMemo } from "react";

const CATEGORY_ICON_MAP: Record<InboxCategory, typeof BellIcon> = {
  transaksi: CreditCardIcon,
  sistem: InfoIcon,
  bantuan: HelpCircleIcon,
  akun: UserIcon,
};

const CATEGORY_COLOR_MAP: Record<InboxCategory, string> = {
  transaksi: "blue",
  sistem: "gray",
  bantuan: "green",
  akun: "purple",
};

export const NotificationInboxView = memo(() => {
  // Queries & Mutations
  const {
    items,
    isLoading,
    // total,
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
    return (
      <Center flex={1} py={12}>
        <Loader />
      </Center>
    );
  }

  if (items.length === 0) {
    return (
      <NoDataState
        icon={InboxIcon}
        title={"Inbox Kosong"}
        description={"Belum ada pesan atau pengumuman baru untuk Anda."}
      />
    );
  }

  return (
    <VStack
      flex={1}
      align={"stretch"}
      // gap={"md"}
      overflowY={"auto"}
      p={"md"}
    >
      {/* Inbox Actions Bar */}
      <HStack justify={"end"} align={"center"} mb={"sm"}>
        <HStack gap={2}>
          {unreadCount > 0 && (
            <Button
              size={"xs"}
              loading={markAllAsReadMutation.isPending}
              onClick={() => markAllAsReadMutation.mutate()}
            >
              <AppIcon icon={CheckCheckIcon} />
              {"Tandai Semua Dibaca"}
            </Button>
          )}

          <ConfirmationTrigger
            modalKey={"clear-all-notification-inbox"}
            title={"Hapus Semua Pesan Inbox?"}
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
              <AppIcon icon={Trash2Icon} />
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
        <Center pt={2}>
          <Button
            size={"sm"}
            variant={"subtle"}
            colorPalette={"gray"}
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

  // Stores & Hooks
  const { theme } = useThemeStore();
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Derived Values
  const IconComponent = CATEGORY_ICON_MAP[item.category] ?? BellIcon;
  const colorPalette = CATEGORY_COLOR_MAP[item.category] ?? "blue";

  return (
    <HStack
      align={"start"}
      justify={"space-between"}
      p={"sm"}
      gap={"md"}
      bg={item.isRead ? "bg.body" : "bg.subtle"}
      borderWidth={"1px"}
      borderColor={"border.subtle"}
      shadow={"sm"}
      rounded={theme.radii.container}
    >
      <HStack align={"start"} gap={"md"} flex={1}>
        <Circle
          aspectRatio={1}
          w={"24px"}
          h={"24px"}
          p={1}
          bg={item.isRead ? "bg.muted" : `${colorPalette}.muted`}
          color={item.isRead ? "fg.muted" : `${colorPalette}.fg`}
          flexShrink={0}
        >
          <AppIcon icon={IconComponent} size={"sm"} />
        </Circle>

        <VStack flex={1} gap={"sm"}>
          <HStack justify={"space-between"}>
            <HStack gap={2} align={"center"}>
              <P fontWeight={item.isRead ? "medium" : "bold"}>{item.title}</P>

              {!item.isRead && (
                <Box w={"6px"} h={"6px"} rounded={"full"} bg={"blue.500"} />
              )}

              <Badge
                variant={"subtle"}
                colorPalette={colorPalette}
                textTransform={"capitalize"}
              >
                {item.category}
              </Badge>
            </HStack>

            <HStack gap={"md"} align={"center"}>
              <P fontSize={"sm"} color={"fg.subtle"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.createdAt, preferredTimezone)}
              </P>

              <ConfirmationTrigger
                modalKey={`delete-inbox-item-${item.id}`}
                title={"Hapus Pesan?"}
                description={"Pesan ini akan dihapus dari inbox Anda."}
                confirmLabel={"Hapus"}
                colorPalette={"red"}
                onConfirm={() => onDelete(item.id)}
              >
                <IconButton
                  size={"2xs"}
                  variant={"subtle"}
                  aria-label={"Hapus pesan"}
                  rounded={"full"}
                >
                  <AppIcon icon={XIcon} size={"sm"} />
                </IconButton>
              </ConfirmationTrigger>
            </HStack>
          </HStack>

          <VStack align={"start"} gap={"sm"} flex={1}>
            <P color={"fg.muted"} lineHeight={"tall"}>
              {item.message}
            </P>
          </VStack>

          {!item.isRead && (
            <HStack justify={"flex-end"}>
              <Button
                size={"xs"}
                variant={"ghost"}
                onClick={() => onMarkAsRead(item.id)}
              >
                <AppIcon icon={CheckCheckIcon} size={"xs"} />
                {"Tandai dibaca"}
              </Button>
            </HStack>
          )}
        </VStack>
      </HStack>
    </HStack>
  );
});
