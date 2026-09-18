// src/design-system/components/utilities/ui/offline-alert.tsx

"use client";

import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { toast } from "@/design-system/components/toast";
import { t } from "@/shared/libs/i18n";
import { WifiOffIcon } from "lucide-react";
import { useEffect } from "react";

export const OfflineAlert = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "offlineAlert",
  });

  // Effects
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
    <FocusAlertItem
      modalKey={modalKey}
      variant={"warning"}
      icon={WifiOffIcon}
      title={t["offline_alert.title"]()}
      description={t["offline_alert.description"]()}
      doneLabel={t["action.close"]()}
      onDone={close}
    />
  );
};
