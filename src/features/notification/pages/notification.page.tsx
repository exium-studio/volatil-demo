// src/features/notification/pages/notification.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { DIMENSIONS, PADDING, SPACING } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { NotificationInboxList } from "@/features/notification/components/notification.inbox-list";
import { NotificationToastHistoryList } from "@/features/notification/components/notification.toast-list";
import { useInboxQuery } from "@/features/notification/hooks/use-inbox.query";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import type {
  NotificationHeaderProps,
  NotificationTabsProps,
  NotificationTabValue,
} from "@/features/notification/types/notification.type";
import { BellIcon, InboxIcon } from "lucide-react";
import { memo, useCallback, useEffect, useState, useTransition } from "react";

export const NotificationPage = () => {
  // Hooks
  const {
    categoryGroups,
    totalNotifications,
    deleteNotification,
    deleteGroup,
    clearAllHistory,
  } = useNotifications();

  const { unreadCount } = useInboxQuery();
  const [_isPendingTab, startTransitionTab] = useTransition();
  const { queryValue: tabQuery, setQueryValue: setTab } = useSearchParam("tab");

  // Transitions & Delayed rendering for smooth animation
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsReady(true);
      });
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  // Derived Values
  const activeTab: NotificationTabValue =
    tabQuery === "notifications" ? "notifications" : "inbox";
  const hasNotifications = totalNotifications > 0;

  // Handlers
  const handleTabChange = useCallback(
    (value: NotificationTabValue) => {
      startTransitionTab(() => {
        setTab(value, { replace: true });
      });
    },
    [setTab, startTransitionTab],
  );

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          <NotificationHeader
            activeTab={activeTab}
            totalNotifications={totalNotifications}
            unreadCount={unreadCount ?? 0}
          />

          <Separator borderColor={"bg.canvas"} />

          <NotificationTabs
            activeTab={activeTab}
            unreadCount={unreadCount ?? 0}
            totalNotifications={totalNotifications}
            onTabChange={handleTabChange}
            categoryGroups={categoryGroups}
            hasNotifications={hasNotifications}
            isReady={isReady}
            isPending={isPending}
            onDeleteGroup={deleteGroup}
            onDeleteNotification={deleteNotification}
            onClearAllHistory={clearAllHistory}
          />
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};

const NotificationHeader = memo((props: NotificationHeaderProps) => {
  // Props
  const { activeTab, totalNotifications, unreadCount } = props;

  return (
    <HStack align={"center"} justify={"space-between"} gap={SPACING.md} pr={2}>
      <HStack align={"center"}>
        <AppNavTitle />

        {activeTab === "notifications" && totalNotifications > 0 && (
          <Badge colorPalette={"blue"} variant={"subtle"} size={"sm"}>
            {`${totalNotifications} Notifikasi`}
          </Badge>
        )}

        {activeTab === "inbox" && unreadCount > 0 && (
          <Badge colorPalette={"blue"} variant={"subtle"} size={"sm"}>
            {`${unreadCount} Baru`}
          </Badge>
        )}
      </HStack>
    </HStack>
  );
});

const NotificationTabs = memo((props: NotificationTabsProps) => {
  // Props
  const {
    activeTab,
    unreadCount,
    totalNotifications,
    onTabChange,
    categoryGroups,
    hasNotifications,
    isReady,
    isPending,
    onDeleteGroup,
    onDeleteNotification,
    onClearAllHistory,
  } = props;

  return (
    <Tabs.Root
      value={activeTab}
      flex={1}
      display={"flex"}
      flexDir={"column"}
      overflowY={"auto"}
      onValueChange={(details) =>
        onTabChange(details.value as NotificationTabValue)
      }
    >
      <Tabs.List borderColor={"bg.canvas"}>
        <Tabs.Trigger
          value={"inbox"}
          flex={1}
          justifyContent={"center"}
          h={DIMENSIONS.headerH}
        >
          <AppIcon icon={InboxIcon} />
          {"Inbox"}
          {unreadCount > 0 && (
            <Badge colorPalette={"blue"} ml={1}>
              {String(unreadCount)}
            </Badge>
          )}
        </Tabs.Trigger>

        <Tabs.Trigger
          value={"notifications"}
          flex={1}
          justifyContent={"center"}
          h={DIMENSIONS.headerH}
        >
          <AppIcon icon={BellIcon} />
          {"Notifikasi"}
          {totalNotifications > 0 && (
            <Badge colorPalette={"gray"} ml={1}>
              {String(totalNotifications)}
            </Badge>
          )}
        </Tabs.Trigger>
      </Tabs.List>

      {/* Tab 1: Inbox Content */}
      <Tabs.Content
        value={"inbox"}
        flex={1}
        display={"flex"}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
      >
        <NotificationInboxList />
      </Tabs.Content>

      {/* Tab 2: Notifikasi Toast History Content */}
      <Tabs.Content
        value={"notifications"}
        flex={1}
        display={"flex"}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
      >
        <NotificationToastHistoryList
          categoryGroups={categoryGroups}
          hasNotifications={hasNotifications}
          isReady={isReady}
          isPending={isPending}
          onDeleteGroup={onDeleteGroup}
          onDeleteNotification={onDeleteNotification}
          onClearAllHistory={onClearAllHistory}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
});
