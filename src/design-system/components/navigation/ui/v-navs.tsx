// src/design-system/components/navigation/ui/vnavs.tsx

import { Fragment } from "react";

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type {
  VNavNodeProps,
  VNavsProps,
} from "@/design-system/components/navigation/types/v-navs.type";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import type { NavItem } from "@/shared/types/nav.type";
import { Menu } from "@chakra-ui/react";

export const VNavs = <TNavKey extends string>(props: VNavsProps<TNavKey>) => {
  // Props
  const {
    groups,
    navs,
    activeKey,
    expanded = true,
    onNavClick,
    ...restProps
  } = props;

  return (
    <VScrollContainer gap={expanded ? 2 : 3} {...restProps}>
      {groups.map((group, groupIndex) => {
        const isFirstGroup = groupIndex === 0;
        const groupTitle = group.titleKey ? t[group.titleKey]() : null;

        return (
          <Fragment key={groupIndex}>
            {!isFirstGroup && <Separator />}

            <VStack align={expanded ? "stretch" : "center"}>
              {expanded && groupTitle && (
                <P fontSize={"sm"} color={"fg.subtle"} px={2} mb={2}>
                  {groupTitle}
                </P>
              )}

              <VStack gap={1} align={expanded ? "stretch" : "center"}>
                {group.items.map((node) => (
                  <VNavNode
                    key={node.key}
                    node={node}
                    navs={navs}
                    activeKey={activeKey}
                    expanded={expanded}
                    onNavClick={onNavClick}
                  />
                ))}
              </VStack>
            </VStack>
          </Fragment>
        );
      })}
    </VScrollContainer>
  );
};

const VNavNode = <TNavKey extends string>(props: VNavNodeProps<TNavKey>) => {
  const { node, navs, activeKey, expanded, onNavClick, depth = 0 } = props;

  const nav = navs[node.key];
  const navTitle = t[nav.titleKey]();
  const isActive = activeKey === node.key;
  const hasChildren = !!node.children?.length;

  // Rail mode (!expanded) + punya children → icon-only trigger + Chakra Menu popup
  if (!expanded && hasChildren) {
    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <NavButton
            size={"lg"}
            variant={isActive ? "subtle" : "ghost"}
            aria-label={navTitle}
          >
            <NavIcon nav={nav} title={navTitle} />
          </NavButton>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content>
            {node.children!.map((child) => {
              const childNav = navs[child.key];
              return (
                <Menu.Item
                  key={child.key}
                  value={child.key}
                  onClick={() => onNavClick?.(child.key)}
                >
                  {childNav.icon && <AppIcon icon={childNav.icon} />}
                  {t[childNav.titleKey]()}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  }

  // Rail mode, no children → icon-only button
  if (!expanded) {
    return (
      <NavButton
        size={"lg"}
        variant={isActive ? "subtle" : "ghost"}
        aria-label={navTitle}
        onClick={() => onNavClick?.(node.key)}
      >
        <NavIcon nav={nav} title={navTitle} />
      </NavButton>
    );
  }

  // Expanded mode → icon + title, children dirender indented di bawahnya
  return (
    <VStack gap={1} align={"stretch"} w={"full"}>
      <NavButton
        size={"lg"}
        variant={isActive ? "subtle" : "ghost"}
        pl={3 + depth * 4}
        onClick={() => onNavClick?.(node.key)}
      >
        <NavIcon nav={nav} title={navTitle} />
        {navTitle}
      </NavButton>

      {hasChildren &&
        node.children!.map((child) => (
          <VNavNode
            key={child.key}
            node={child}
            navs={navs}
            activeKey={activeKey}
            expanded={expanded}
            onNavClick={onNavClick}
            depth={depth + 1}
          />
        ))}
    </VStack>
  );
};

/** Render icon nav; fallback ke huruf awal title kalau icon gak ada. */
const NavIcon = ({ nav, title }: { nav: NavItem; title: string }) => {
  if (nav.icon) {
    return <AppIcon icon={nav.icon} />;
  }

  return (
    <HStack
      boxSize={5}
      align={"center"}
      justify={"center"}
      rounded={"full"}
      bg={"bg.subtle"}
      fontSize={"xs"}
      fontWeight={"semibold"}
    >
      {title.charAt(0).toUpperCase()}
    </HStack>
  );
};
