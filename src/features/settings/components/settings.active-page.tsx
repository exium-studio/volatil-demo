// src/features/settings/components/settings.active-page.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import {
  HEADER_H,
  MODAL_CONTROL_CONTAINER_SPACING_R,
  MODAL_CONTROL_CONTAINER_W,
} from "@/design-system/constants/styles";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { SettingsSearchButton } from "@/features/settings/components/settings.search";
import { SETTINGS_PAGES } from "@/features/settings/constants/settings.pages";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import { RootRoute } from "@/routes/-typed";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ChevronLeftIcon } from "lucide-react";

export type SettingsActivePageContextValue = {
  activeSettingNavKey: SettingNavKey | undefined;
  setActiveSettingNavKey: Dispatch<SetStateAction<SettingNavKey | undefined>>;
};

const SettingsActivePageContext =
  createContext<SettingsActivePageContextValue | null>(null);

export const useActivePageContext = () => {
  const context = useContext(SettingsActivePageContext);

  if (!context) {
    throw new Error(
      "useActivePageContext must be used within SettingsActivePage",
    );
  }

  return context;
};

export const SettingsActivePage = () => {
  // Hooks
  const { activeSettingNavKey: activeSettingNavKeySearch } =
    RootRoute.useSearch();

  // States
  const [activeSettingNavKey, setActiveSettingNavKey] = useState<
    SettingNavKey | undefined
  >(activeSettingNavKeySearch);

  return (
    <SettingsActivePageContext.Provider
      value={{ activeSettingNavKey, setActiveSettingNavKey }}
    >
      <VStack
        className={"settings-active-page"}
        flex={1}
        overflowY={"auto"}
        bg={"bg.canvas"}
      >
        <SettingsActivePageHeader />

        <SettingsActivePageBody />
      </VStack>
    </SettingsActivePageContext.Provider>
  );
};

export const SettingsActivePageHeader = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { activeSettingNavKey } = useActivePageContext();

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Resolved Values
  const resolvedTitle = activeSettingNavKey
    ? t[`settings.${activeSettingNavKey}.title`]()
    : "";

  return (
    <HStack
      className={"settings-active-page__header"}
      align={"center"}
      justify={"space-between"}
      h={HEADER_H}
      p={2}
      {...restProps}
    >
      <HStack w={MODAL_CONTROL_CONTAINER_W}>
        {isSmallViewport && (
          <IconButton onClick={() => back()}>
            <AppIcon icon={ChevronLeftIcon} />
          </IconButton>
        )}
      </HStack>

      <P fontWeight={"semibold"} textAlign={"center"}>
        {resolvedTitle}
      </P>

      <HStack
        justify={"end"}
        gap={3}
        w={MODAL_CONTROL_CONTAINER_W}
        pr={[0, null, MODAL_CONTROL_CONTAINER_SPACING_R]}
      >
        {isSmallViewport && <SettingsSearchButton />}

        {!isSmallViewport && (
          <>
            <Dialog.FullscreenButton />

            <Modal.CloseButton
              closeTriggerProps={{
                pos: "static",
              }}
            />
          </>
        )}
      </HStack>
    </HStack>
  );
};

export const ActiveSettingsPageContentIndex = () => {
  return (
    <FeedbackState
      title={t["settings.index.title"]()}
      description={t["settings.index.description"]()}
      pb={HEADER_H}
      m={"auto"}
    />
  );
};

export const SettingsActivePageBody = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { activeSettingNavKey, setActiveSettingNavKey } =
    useActivePageContext();

  // Hooks
  const { activeSettingNavKey: activeSettingsNavKeySearch } =
    RootRoute.useSearch();
  // const isSmallViewport = useIsSmallViewport();

  // Derived Values
  const ActiveSettingPageContent = activeSettingNavKey
    ? SETTINGS_PAGES[activeSettingNavKey]
    : null;

  // Handle key changes
  useEffect(() => {
    if (activeSettingsNavKeySearch) {
      setActiveSettingNavKey(activeSettingsNavKeySearch);
    }
  }, [activeSettingsNavKeySearch, setActiveSettingNavKey]);

  return (
    <VScrollContainer
      className={"settings-active-page__body"}
      flex={1}
      align={"center"}
      p={4}
      {...restProps}
    >
      <VStack flex={1} gap={4} w={"full"} maxW={"600px"}>
        {ActiveSettingPageContent && <ActiveSettingPageContent />}

        {!ActiveSettingPageContent && <ActiveSettingsPageContentIndex />}
      </VStack>
    </VScrollContainer>
  );
};
