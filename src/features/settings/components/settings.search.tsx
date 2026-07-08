// src/features/settings/components/settings.search.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import { FocusSearchTrigger } from "@/design-system/components/overlay/ui/focus-search";
import { useModalContext } from "@/design-system/components/overlay/ui/modal";
import { useSettingSearchIndex } from "@/features/settings/hooks/use-settings-search-index";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import { RootRoute } from "@/routes/-typed";
import { IconSearch } from "@tabler/icons-react";

interface SettingsSearchTriggerProps {
  children: React.ReactNode;
  modalKey: string;
  queryKey: string;
}

export const SettingsSearchTrigger = (props: SettingsSearchTriggerProps) => {
  // Props
  const { children, modalKey, queryKey } = props;

  // Hooks
  const { activeSettingNavKey } = RootRoute.useSearch();
  const navigate = RootRoute.useNavigate();
  const searchIndex = useSettingSearchIndex();

  return (
    <FocusSearchTrigger
      modalKey={modalKey}
      queryKey={queryKey}
      searchIndex={searchIndex}
      onResultSelect={(result) => {
        setTimeout(() => {
          navigate({
            to: ".",
            search: (prev) => ({
              ...prev,
              activeSettingNavKey: result.id as SettingNavKey,
            }),
            replace: !!activeSettingNavKey,
          });
        }, 200);
      }}
    >
      {children}
    </FocusSearchTrigger>
  );
};

export const SettingsSearchButton = (props: IconButtonProps) => {
  // Contexts
  const { modalKey } = useModalContext();

  return (
    <SettingsSearchTrigger
      modalKey={modalKey + ".search"}
      queryKey={"settingsSearch"}
    >
      <IconButton {...props}>
        <AppTablerIcon icon={IconSearch} />
      </IconButton>
    </SettingsSearchTrigger>
  );
};
