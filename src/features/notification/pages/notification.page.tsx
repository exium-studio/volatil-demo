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
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import { BellIcon, BellOffIcon, InboxIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

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

  // Derived active tab (default to "inbox")
  const activeTab = tabQuery === "notifications" ? "notifications" : "inbox";

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

  const hasNotifications = totalNotifications > 0;

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          {/* Header Section */}
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={SPACING.md}
            pr={2}
          >
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

            <HStack gap={2}>
              {activeTab === "notifications" && totalNotifications > 0 && (
                <ConfirmationTrigger
                  title={"Hapus Semua Riwayat Notifikasi?"}
                  description={
                    "Seluruh riwayat toast notification akan dibersihkan."
                  }
                  confirmLabel={"Hapus Semua"}
                  colorPalette={"red"}
                  onConfirm={clearAllHistory}
                >
                  <Button colorPalette={"red"}>
                    <AppIcon icon={Trash2Icon} />
                    {t["action.clear_all"]()}
                  </Button>
                </ConfirmationTrigger>
              )}
            </HStack>
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          {/* Tabs: Inbox (Default) & Notifikasi */}
          <Tabs.Root
            value={activeTab}
            flex={1}
            display={"flex"}
            flexDir={"column"}
            overflowY={"auto"}
            onValueChange={(details) => {
              startTransitionTab(() => {
                setTab(details.value, { replace: true });
              });
            }}
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
              p={PADDING.md}
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
              <VStack
                flex={1}
                align={"stretch"}
                gap={SPACING.lg}
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
                  categoryGroups.map((group) => (
                    <NotificationGroupStackCard
                      key={group.groupName}
                      group={group}
                      onDeleteGroup={deleteGroup}
                      onDeleteNotification={deleteNotification}
                    />
                  ))
                )}
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
