// src/features/notification/components/notification.inbox-list.tsx

import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useInboxQuery } from "@/features/notification/hooks/use-inbox.query";
import type {
  InboxCategory,
  InboxItem,
} from "@/features/notification/types/inbox.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import {
  BellIcon,
  CreditCardIcon,
  HelpCircleIcon,
  InboxIcon,
  InfoIcon,
  UserIcon,
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

export const NotificationInboxList = memo(() => {
  // Queries
  const { items, isLoading } = useInboxQuery();

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
      gap={SPACING.sm}
      overflowY={"auto"}
      p={PADDING.md}
    >
      {items.map((item) => (
        <InboxCardItem key={item.id} item={item} />
      ))}
    </VStack>
  );
});

type InboxCardItemProps = {
  item: InboxItem;
};

const InboxCardItem = memo((props: InboxCardItemProps) => {
  // Props
  const { item } = props;

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
      p={PADDING.md}
      gap={SPACING.md}
      bg={item.isRead ? "bg.panel" : "bg.subtle"}
      borderWidth={"1px"}
      borderColor={item.isRead ? "border.subtle" : "border.default"}
      rounded={theme.radii.container}
    >
      <HStack align={"start"} gap={SPACING.md} flex={1}>
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

        <VStack flex={1} gap={SPACING.sm}>
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

            <P fontSize={"sm"} color={"fg.subtle"} whiteSpace={"nowrap"}>
              {formatUtcDateTime(item.createdAt, preferredTimezone)}
            </P>
          </HStack>

          <VStack align={"start"} gap={1} flex={1}>
            <P color={"fg.muted"} fontSize={"sm"} lineHeight={"tall"}>
              {item.message}
            </P>
          </VStack>
        </VStack>
      </HStack>
    </HStack>
  );
});
