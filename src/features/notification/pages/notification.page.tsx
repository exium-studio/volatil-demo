// src/features/notification/pages/notification.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { NotificationItemCard } from "@/features/notification/components/notification.item";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import type { NotificationFilterType } from "@/features/notification/types/notification.type";
import {
  BellIcon,
  CheckCheckIcon,
  FilterIcon,
  InboxIcon,
  MessageSquareIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, useTransition } from "react";

export const NotificationPage = () => {
  // Transitions & States
  const [_isPending, startTransition] = useTransition();

  // Hooks
  const {
    notifications,
    filter,
    setFilter,
    search,
    setSearch,
    unreadOnly,
    setUnreadOnly,
    unreadCount,
    toastCount,
    systemCount,
    totalCount,
    markItemRead,
    deleteItem,
    markAllRead,
    clearAllHistory,
  } = useNotifications();

  // Local Search state for non-blocking input updates
  const [localSearch, setLocalSearch] = useState<string>(search);

  // Handlers
  const handleSearchValueChange = (val: string) => {
    setLocalSearch(val);
    startTransition(() => {
      setSearch(val);
    });
  };

  const filterTabs: Array<{
    key: NotificationFilterType;
    label: string;
    count: number;
    icon: typeof BellIcon;
  }> = [
    { key: "all", label: "Semua", count: totalCount, icon: BellIcon },
    {
      key: "toast",
      label: "Toast History",
      count: toastCount,
      icon: MessageSquareIcon,
    },
    {
      key: "system",
      label: "System Inbox",
      count: systemCount,
      icon: InboxIcon,
    },
  ];

  const hasNotifications = notifications.length > 0;

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          {/* Header Section */}
          <HeaderContainer pr={3}>
            <HStack gap={2} align={"center"}>
              <AppIcon icon={BellIcon} />

              <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
                {"Riwayat Notifikasi"}
              </ClampedP>

              {unreadCount > 0 && (
                <Badge colorPalette={"red"} variant={"solid"} size={"sm"}>
                  {`${unreadCount} Baru`}
                </Badge>
              )}
            </HStack>

            <HStack gap={SPACING.xs}>
              {unreadCount > 0 && (
                <Button onClick={markAllRead}>
                  <AppIcon icon={CheckCheckIcon} />
                  {"Tandai Semua Dibaca"}
                </Button>
              )}

              {totalCount > 0 && (
                <ConfirmationTrigger
                  title={"Hapus Semua Riwayat Notifikasi?"}
                  description={
                    "Seluruh riwayat toast notification & inbox akan dibersihkan."
                  }
                  confirmLabel={"Hapus Semua"}
                  colorPalette={"red"}
                  onConfirm={clearAllHistory}
                >
                  <Button colorPalette={"red"}>
                    <AppIcon icon={Trash2Icon} />
                    {"Bersihkan Riwayat"}
                  </Button>
                </ConfirmationTrigger>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Controls Section: Tabs & Search Filter */}
          <VStack gap={PADDING.sm} align={"stretch"} p={PADDING.sm}>
            <VStack gap={PADDING.sm}>
              {/* Category Filter Tabs */}
              <HStack flex={1} gap={1} wrap={"wrap"}>
                {filterTabs.map((tab) => {
                  const isActive = filter === tab.key;

                  return (
                    <Button
                      key={tab.key}
                      flex={1}
                      variant={isActive ? "solid" : "ghost"}
                      colorPalette={isActive ? "blue" : "gray"}
                      onClick={() => {
                        startTransition(() => {
                          setFilter(tab.key);
                        });
                      }}
                    >
                      <AppIcon icon={tab.icon} />
                      {tab.label}

                      <Badge
                        size={"xs"}
                        variant={isActive ? "solid" : "subtle"}
                        colorPalette={isActive ? "blue" : "gray"}
                        ml={1}
                      >
                        {tab.count}
                      </Badge>
                    </Button>
                  );
                })}
              </HStack>

              {/* Unread Toggle & Search */}
              <HStack gap={2}>
                <SearchInput
                  placeholder={"Cari notifikasi..."}
                  value={localSearch}
                  onValueChange={handleSearchValueChange}
                  maxW={"260px"}
                />

                <Button
                  variant={unreadOnly ? "solid" : "outline"}
                  colorPalette={unreadOnly ? "amber" : "gray"}
                  onClick={() => {
                    startTransition(() => {
                      setUnreadOnly(!unreadOnly);
                    });
                  }}
                >
                  <AppIcon icon={FilterIcon} />
                  {"Belum Dibaca"}
                </Button>
              </HStack>
            </VStack>

            {/* List Content */}
            {!hasNotifications && (
              <Box
                flex={1}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                w={"full"}
                py={PADDING.xl}
                bg={"bg.body"}
                rounded={"md"}
              >
                <NoDataState
                  icon={InboxIcon}
                  title={"Tidak Ada Notifikasi"}
                  description={
                    search
                      ? "Tidak ditemukan notifikasi sesuai kata kunci pencarian Anda."
                      : "Belum ada riwayat notifikasi baru."
                  }
                />
              </Box>
            )}

            {hasNotifications && (
              <VStack gap={PADDING.sm} align={"stretch"} flex={1}>
                {notifications.map((item) => (
                  <NotificationItemCard
                    key={item.id}
                    item={item}
                    onMarkRead={markItemRead}
                    onDelete={deleteItem}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
