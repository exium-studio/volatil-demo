// src/features/notification/pages/notification.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
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
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { NotificationGroupStackCard } from "@/features/notification/components/notification.item";
import { useNotifications } from "@/features/notification/hooks/use-notifications";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { BellOffIcon, Trash2Icon } from "lucide-react";
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

              {totalNotifications > 0 && (
                <Badge colorPalette={"blue"} variant={"subtle"} size={"sm"}>
                  {`${totalNotifications} Notifikasi`}
                </Badge>
              )}
            </HStack>

            <HStack gap={2}>
              {totalNotifications > 0 && (
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

          {/* Grouped Stack Streams (Ubuntu-like layout) */}
          <VStack flex={1} align={"stretch"} overflowY={"auto"}>
            {!isReady || isPending ? (
              <Center flex={1} py={12}>
                <Loader />
              </Center>
            ) : !hasNotifications ? (
              <NoDataState
                icon={BellOffIcon}
                title={"Tidak Ada Notifikasi"}
                description={"Belum ada riwayat notifikasi baru."}
              />
            ) : (
              <VStack
                flex={1}
                align={"stretch"}
                gap={SPACING.lg}
                p={PADDING.md}
              >
                {categoryGroups.map((group) => {
                  return (
                    <NotificationGroupStackCard
                      key={group.groupName}
                      group={group}
                      onDeleteGroup={deleteGroup}
                      onDeleteNotification={deleteNotification}
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
