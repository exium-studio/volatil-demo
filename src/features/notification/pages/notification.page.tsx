// src/features/notification/pages/notification.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { NotificationStackCard } from "@/features/notification/components/notification.item";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { BellOffIcon, CheckCheckIcon, Trash2Icon } from "lucide-react";

export const NotificationPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const {
    notificationStacks,
    totalStacks,
    unreadCount,
    markStackRead,
    deleteStack,
    markAllRead,
    clearAllHistory,
  } = useNotifications();

  const hasNotifications = totalStacks > 0;
  // const hasNotifications = false;

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          {/* Header Section */}
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={SPACING.md}
            pr={3}
          >
            <HStack align={"center"}>
              <AppNavTitle navsMap={APP_NAVS_MAP} />

              {unreadCount > 0 && (
                <Badge colorPalette={"red"} variant={"solid"} size={"sm"}>
                  {`${unreadCount} Baru`}
                </Badge>
              )}
            </HStack>

            <HStack gap={2}>
              {unreadCount > 0 && (
                <Button onClick={markAllRead}>
                  <AppIcon icon={CheckCheckIcon} />
                  {"Tandai Semua Dibaca"}
                </Button>
              )}

              {totalStacks > 0 && (
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
                    {"Bersihkan"}
                  </Button>
                </ConfirmationTrigger>
              )}
            </HStack>
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          {/* Single Mixed Stack Stream List */}
          <VStack flex={1} align={"stretch"} overflowY={"auto"}>
            {!hasNotifications && (
              <NoDataState
                icon={BellOffIcon}
                title={"Tidak Ada Notifikasi"}
                description={"Belum ada riwayat notifikasi baru."}
              />
            )}

            {hasNotifications && (
              <VStack flex={1} gap={SPACING.xs} bg={"bg.canvas"}>
                {notificationStacks.map((stack, index) => {
                  const isLastIndex = notificationStacks.length - 1 === index;

                  return (
                    <NotificationStackCard
                      key={stack.toastId}
                      stack={stack}
                      onMarkStackRead={markStackRead}
                      onDeleteStack={deleteStack}
                      roundedBottom={isLastIndex ? theme.radii.container : 0}
                    />
                  );
                })}
              </VStack>
            )}
          </VStack>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
