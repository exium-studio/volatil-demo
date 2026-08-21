import { getNavKeyFromPathname } from "@/design-system/components/navigation/utils/v-navs.utils";
import type { AppNavTitleProps } from "@/design-system/components/shell/types/app-nav-title.type";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import {
  APP_NAVS_MAP,
  INTERNAL_APP_NAVS_MAP,
} from "@/shared/constants/app.navs";
import { t } from "@/shared/libs/i18n";
import type { ParameterlessTranslationKey } from "@/shared/libs/i18n/translation.type";
import type { NavItem } from "@/shared/types/nav.type";
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

  const resolvedNavsMap: Record<string, NavItem> =
    navKey && navKey in effectiveNavsMap
      ? (effectiveNavsMap as Record<string, NavItem>)
      : (INTERNAL_APP_NAVS_MAP as Record<string, NavItem>);

  const navItem = navKey ? resolvedNavsMap[navKey] : undefined;
  const navTitle = navItem
    ? (t[navItem.titleKey as ParameterlessTranslationKey] as () => string)()
    : "";

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
