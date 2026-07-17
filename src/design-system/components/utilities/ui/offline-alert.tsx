// src/design-system/components/utilities/ui/offline-alert.tsx

"use client";

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { toast } from "@/design-system/components/toast";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { WifiOffIcon } from "lucide-react";
import { useEffect } from "react";

export const OfflineAlert = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "offlineAlert",
  });

  useEffect(() => {
    const handleOffline = () => {
      if (!isOpen) open();
    };

    const handleOnline = () => {
      if (isOpen) close();
      toast.create({
        variant: "success",
        title: "You're back online",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOpen, open, close]);

  return (
    <Dialog.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Dialog.Content>
        <Dialog.Body>
          <VStack align={"center"} gap={4} py={4}>
            <AppIcon icon={WifiOffIcon} size={"xl"} color={"fg.muted"} />

            <P textAlign={"center"}>{t["offline_alert.title"]()}</P>

            <P textAlign={"center"} color={"fg.muted"}>
              {t["offline_alert.description"]()}
            </P>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button onClick={close} flex={1}>
            {t["action.close"]()}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
