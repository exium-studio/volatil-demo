// src/design-system/components/navigation/ui/h-navs.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { HScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import type { HNavsProps } from "@/design-system/components/navigation/types/h-navs.type";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";

export const HNavs = <TNavKey extends string>(props: HNavsProps<TNavKey>) => {
  // Props
  const { navs, navKeys, activeKey, onNavClick, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <HScrollContainer
      className={"noScrollbar"}
      align={"center"}
      gap={"xs"}
      w={"full"}
      {...restProps}
    >
      {navKeys.map((key) => {
        const nav = navs[key];
        if (!nav) return null;

        const isActive = activeKey === key;
        const label = nav.titleKey ? t[nav.titleKey]() : "";

        return (
          <NavButton
            key={key}
            colorPalette={isActive ? theme.colorPalette : undefined}
            size={"sm"}
            h={"auto"}
            p={"xs"}
            flex={1}
            minW={"68px"}
            maxW={"110px"}
            flexShrink={0}
            justifyContent={"center"}
            onClick={() => onNavClick?.(key)}
          >
            <VStack
              gap={"2xs"}
              align={"center"}
              justify={"center"}
              w={"full"}
              minW={0}
            >
              {nav.icon && (
                <AppIcon
                  icon={nav.icon}
                  color={isActive ? `${theme.colorPalette}.fg` : "fg.muted"}
                />
              )}

              <ClampedP
                fontSize={"2xs"}
                fontWeight={isActive ? "semibold" : "medium"}
                color={isActive ? `${theme.colorPalette}.fg` : "fg.muted"}
                textAlign={"center"}
                lineHeight={"normal"}
                pb={"1px"}
                w={"full"}
                maxW={"full"}
              >
                {label}
              </ClampedP>
            </VStack>
          </NavButton>
        );
      })}
    </HScrollContainer>
  );
};
