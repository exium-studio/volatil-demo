// src/features/settings/components/settings.search.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FocusSearchTrigger } from "@/design-system/components/overlay/ui/focus-search";
import { useModalContext } from "@/design-system/components/overlay/ui/modal";
import { useSettingSearchIndex } from "@/features/settings/hooks/use-settings-search-index";
import type { SettingNavKey } from "@/features/settings/types/settings-navs.type";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SettingsSearchTriggerProps {
  children: ReactNode;
  modalKey: string;
  queryKey: string;
}

export const SettingsSearchTrigger = (props: SettingsSearchTriggerProps) => {
  // Props
  const { children, modalKey, queryKey } = props;

  // Hooks
  const { activeSettingNavKey } = useSearch({ strict: false });
  const navigate = useNavigate();
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
        <AppIcon icon={SearchIcon} />
      </IconButton>
    </SettingsSearchTrigger>
  );
};
