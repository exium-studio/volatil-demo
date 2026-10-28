// src/design-system/components/navigation/ui/h-navs.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { HScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import type { HNavsProps } from "@/design-system/components/navigation/types/h-navs.type";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { findActivePath } from "@/design-system/components/navigation/utils/navs.utils";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { t } from "@/shared/libs/i18n";
import type { NavNode } from "@/shared/types/nav.type";
import { useMemo } from "react";

export const HNavs = <TNavKey extends string>(props: HNavsProps<TNavKey>) => {
  // Props
  const { navs, navKeys, items, activeKey, onNavClick, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values - Build normalized nodes array
  const nodes = useMemo<NavNode<TNavKey>[]>(() => {
    if (items && items.length > 0) return items;
    if (navKeys && navKeys.length > 0) {
      return navKeys.map((key) => ({ key }));
    }
    return [];
  }, [items, navKeys]);

  const activePathKeys = useMemo(() => {
    if (!activeKey) return new Set<TNavKey>();
    const path = findActivePath(nodes, activeKey);
    return path ? new Set(path) : new Set<TNavKey>();
  }, [nodes, activeKey]);

  return (
    <HScrollContainer
      className={"noScrollbar"}
      align={"center"}
      gap={"xs"}
      w={"full"}
      {...restProps}
    >
      {nodes.map((node) => {
        const nav = navs[node.key];
        if (!nav) return null;

        const hasChildren = !!node.children?.length;
        const isActive = activeKey === node.key;
        const isAncestorActive = activePathKeys.has(node.key);
        const isHighlighted = isActive || isAncestorActive;
        const label = nav.title || (nav.titleKey ? t[nav.titleKey]() : "");

        if (hasChildren) {
          return (
            <Menu.Root
              key={node.key}
              positioning={{
                placement: "top-start",
                gutter: 8,
              }}
            >
              <Menu.Trigger asChild>
                <NavButton
                  colorPalette={isHighlighted ? theme.colorPalette : undefined}
                  size={"sm"}
                  h={"auto"}
                  p={"xs"}
                  flex={1}
                  minW={"68px"}
                  maxW={"110px"}
                  flexShrink={0}
                  justifyContent={"center"}
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
                        color={
                          isHighlighted
                            ? `${theme.colorPalette}.fg`
                            : "fg.muted"
                        }
                      />
                    )}

                    <ClampedP
                      fontSize={"2xs"}
                      fontWeight={isHighlighted ? "semibold" : "medium"}
                      color={
                        isHighlighted
                          ? `${theme.colorPalette}.fg`
                          : "fg.muted"
                      }
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
              </Menu.Trigger>

              <Menu.Content minW={"200px"}>
                <Menu.ItemGroup>
                  <Menu.ItemGroupLabel
                    px={3}
                    py={1.5}
                    fontSize={"xs"}
                    fontWeight={"semibold"}
                    color={"fg.muted"}
                    textTransform={"uppercase"}
                    letterSpacing={"wider"}
                  >
                    {label}
                  </Menu.ItemGroupLabel>

                  {node.children!.map((child) => {
                    const childNav = navs[child.key];
                    if (!childNav) return null;
                    const isChildActive = activeKey === child.key;
                    const childLabel =
                      childNav.title ||
                      (childNav.titleKey ? t[childNav.titleKey]() : "");

                    return (
                      <Menu.Item
                        key={child.key}
                        value={child.key}
                        onClick={() => onNavClick?.(child.key)}
                        color={
                          isChildActive ? `${theme.colorPalette}.fg` : undefined
                        }
                      >
                        {childNav.icon && (
                          <AppIcon
                            icon={childNav.icon}
                            color={
                              isChildActive
                                ? `${theme.colorPalette}.fg`
                                : "fg.muted"
                            }
                          />
                        )}

                        {childLabel}
                      </Menu.Item>
                    );
                  })}
                </Menu.ItemGroup>
              </Menu.Content>
            </Menu.Root>
          );
        }

        return (
          <NavButton
            key={node.key}
            colorPalette={isActive ? theme.colorPalette : undefined}
            size={"sm"}
            h={"auto"}
            p={"xs"}
            flex={1}
            minW={"68px"}
            maxW={"110px"}
            flexShrink={0}
            justifyContent={"center"}
            onClick={() => onNavClick?.(node.key)}
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
