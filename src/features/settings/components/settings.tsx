// src/features/settings/components/settings.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import type { PopModalTriggerProps } from "@/design-system/components/overlay/types/modal.type";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { SettingsActivePage } from "@/features/settings/components/settings.active-page";
import { SettingsMenu } from "@/features/settings/components/settings.menu";
import { useSearch } from "@tanstack/react-router";

export const SettingsTrigger = (props: PopModalTriggerProps) => {
  // Props
  const { children, modalKey, ...restProps } = props;

  // Hooks
  const { activeSettingNavKey } = useSearch({
    strict: false,
  });
  const { isOpen, open, close } = usePopModal({
    modalKey,
    depth: activeSettingNavKey ? 2 : 1,
  });
  const isSmallViewport = useIsSmallViewport();

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={isSmallViewport ? "full" : "5xl"}
      dialogClickOriginAnimation
      drawerPlacement={"end"}
      drawerSwipeToDismiss={false}
    >
      <Modal.Trigger {...restProps}>{children}</Modal.Trigger>

      <Modal.Content
        display={"flex"}
        flexDir={"column"}
        overflowY={"auto"}
        h={!isSmallViewport ? "600px" : "full"}
      >
        <Modal.Body
          display={"flex"}
          flexDir={"column"}
          overflowY={"auto"}
          p={0}
        >
          <SettingsView />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

const SettingsView = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();
  const { activeSettingNavKey } = useSearch({
    strict: false,
  });

  // Derived Values
  const shouldRenderMenu = !isSmallViewport || !activeSettingNavKey;
  const shouldRenderActivePage = !isSmallViewport || !!activeSettingNavKey;

  return (
    <HStack className={"settings-view"} flex={1} overflowY={"auto"}>
      {shouldRenderMenu && <SettingsMenu />}

      {shouldRenderActivePage && <SettingsActivePage />}
    </HStack>
  );
};

export const Settings = {
  Trigger: SettingsTrigger,
  View: SettingsView,
};
