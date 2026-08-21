import { getNavKeyFromPathname } from "@/design-system/components/navigation/utils/v-navs.utils";
import type { AppNavTitleProps } from "@/design-system/components/shell/types/app-nav-title.type";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import {
  APP_NAVS_MAP,
  INTERNAL_APP_NAVS_MAP,
} from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import { useLocation } from "@tanstack/react-router";

export const AppNavTitle = (props: AppNavTitleProps) => {
  // Props
  const { navsMap: propNavsMap, ...restProps } = props;

  // Hooks
  const pathname = useLocation().pathname;

  // Derived Values
  const effectiveNavsMap =
    propNavsMap ??
    (pathname.startsWith("/internal")
      ? INTERNAL_APP_NAVS_MAP
      : APP_NAVS_MAP);

  // Constants
  const navKey =
    getNavKeyFromPathname(effectiveNavsMap, pathname) ??
    (effectiveNavsMap !== INTERNAL_APP_NAVS_MAP
      ? getNavKeyFromPathname(INTERNAL_APP_NAVS_MAP, pathname)
      : getNavKeyFromPathname(APP_NAVS_MAP, pathname));

  const resolvedNavsMap =
    navKey && navKey in effectiveNavsMap
      ? effectiveNavsMap
      : INTERNAL_APP_NAVS_MAP;

  const navTitle = navKey ? t[resolvedNavsMap[navKey].titleKey]() : "";

  return (
    <HeaderContainer {...restProps}>
      {navTitle && (
        <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
          {navTitle}
        </ClampedP>
      )}
    </HeaderContainer>
  );
};
