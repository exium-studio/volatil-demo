// src/design-system/components/shell/ui/app-nav-title.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { getNavKeyFromPathname } from "@/design-system/components/navigation/utils/v-navs.utils";
import type { AppNavTitleProps } from "@/design-system/components/shell/types/app-nav-title.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { HEADER_H, PADDING_LG } from "@/design-system/constants/styles";
import { t } from "@/shared/libs/i18n";
import { useLocation } from "@tanstack/react-router";

export const AppNavTitle = (props: AppNavTitleProps) => {
  // Props
  const { navsMap, ...restProps } = props;

  // Hooks
  const pathname = useLocation().pathname;

  // Constants
  const navKey = getNavKeyFromPathname(navsMap, pathname);
  const navTitle = navKey ? t[navsMap[navKey].titleKey]() : "";

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      minH={HEADER_H}
      maxH={HEADER_H}
      px={PADDING_LG}
      {...restProps}
    >
      {navTitle && (
        <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
          {navTitle}
        </ClampedP>
      )}
    </HStack>
  );
};
