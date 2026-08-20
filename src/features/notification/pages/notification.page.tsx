// src/features/notification/pages/notification.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { DIMENSIONS, PADDING, SPACING } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { NotificationInboxList } from "@/features/notification/components/notification.inbox-list";
import { NotificationGroupStackCard } from "@/features/notification/components/notification.item";
import { useInboxQuery } from "@/features/notification/hooks/use-inbox.query";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import type {
  NotificationHeaderProps,
  NotificationTabsProps,
  NotificationTabValue,
  NotificationToastHistoryContentProps,
} from "@/features/notification/types/notification.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import { BellIcon, BellOffIcon, InboxIcon, Trash2Icon } from "lucide-react";
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
        <AppNavTitle navsMap={APP_NAVS_MAP} />

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
        <NotificationToastHistoryContent
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

const NotificationToastHistoryContent = memo(
  (props: NotificationToastHistoryContentProps) => {
    // Props
    const {
      categoryGroups,
      hasNotifications,
      isReady,
      isPending,
      onDeleteGroup,
      onDeleteNotification,
      onClearAllHistory,
    } = props;

    return (
      <VStack
        flex={1}
        align={"stretch"}
        gap={SPACING.md}
        p={PADDING.md}
        overflowY={"auto"}
      >
        {!isReady || isPending ? (
          <Center flex={1} py={12}>
            <Loader />
          </Center>
        ) : !hasNotifications ? (
          <NoDataState
            icon={BellOffIcon}
            title={"Belum Ada Riwayat Notifikasi"}
            description={
              "Seluruh notifikasi dan status proses dari sistem akan muncul di sini."
            }
          />
        ) : (
          <>
            <HStack justify={"flex-end"} pb={2}>
              <ConfirmationTrigger
                title={"Hapus Semua Riwayat Notifikasi?"}
                description={
                  "Seluruh riwayat toast notification akan dibersihkan."
                }
                confirmLabel={"Hapus Semua"}
                colorPalette={"red"}
                onConfirm={onClearAllHistory}
              >
                <Button colorPalette={"red"} size={"xs"} variant={"subtle"}>
                  <AppIcon icon={Trash2Icon} />
                  {t["action.clear_all"]()}
                </Button>
              </ConfirmationTrigger>
            </HStack>

            <VStack align={"stretch"} gap={SPACING.lg}>
              {categoryGroups.map((group) => (
                <NotificationGroupStackCard
                  key={group.groupName}
                  group={group}
                  onDeleteGroup={onDeleteGroup}
                  onDeleteNotification={onDeleteNotification}
                />
              ))}
            </VStack>
          </>
        )}
      </VStack>
    );
  },
);
