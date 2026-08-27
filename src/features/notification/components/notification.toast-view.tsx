// src/features/notification/components/notification.toast-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { NotificationGroupStackCard } from "@/features/notification/components/notification.item";
import type { NotificationToastHistoryContentProps } from "@/features/notification/types/notification.type";
import { t } from "@/shared/libs/i18n";
import { BellIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";

export const NotificationToastHistoryView = memo(
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

    if (!isReady || isPending) {
      return (
        <VStack
          flex={1}
          align={"stretch"}
          gap={"md"}
          p={"md"}
          overflowY={"auto"}
        >
          <Center flex={1} py={12}>
            <Loader />
          </Center>
        </VStack>
      );
    }

    if (!hasNotifications) {
      return (
        <VStack
          flex={1}
          align={"stretch"}
          gap={"md"}
          p={"md"}
          overflowY={"auto"}
        >
          <NoDataState
            icon={BellIcon}
            title={"Belum Ada Riwayat Notifikasi"}
            description={
              "Seluruh notifikasi dan status proses dari sistem akan muncul di sini."
            }
          />
        </VStack>
      );
    }

    return (
      <VStack
        flex={1}
        align={"stretch"}
        // gap={"md"}
        p={"md"}
        overflowY={"auto"}
      >
        <HStack justify={"flex-end"} mb={"md"}>
          <ConfirmationTrigger
            modalKey={"clear-all-notification-toast-history"}
            title={"Hapus Semua Riwayat Notifikasi?"}
            description={"Seluruh riwayat toast notification akan dibersihkan."}
            confirmLabel={"Hapus Semua"}
            colorPalette={"red"}
            onConfirm={onClearAllHistory}
          >
            <Button colorPalette={"red"} size={"xs"}>
              <AppIcon icon={Trash2Icon} />
              {t["action.clear_all"]()}
            </Button>
          </ConfirmationTrigger>
        </HStack>

        <VStack align={"stretch"} gap={"lg"}>
          {categoryGroups.map((group) => (
            <NotificationGroupStackCard
              key={group.groupName}
              group={group}
              onDeleteGroup={onDeleteGroup}
              onDeleteNotification={onDeleteNotification}
            />
          ))}
        </VStack>
      </VStack>
    );
  },
);
