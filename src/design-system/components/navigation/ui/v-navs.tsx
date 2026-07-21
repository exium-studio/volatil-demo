// src/design-system/components/navigation/ui/v-navs.tsx

import { Fragment, useState } from "react";

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type {
  VNavNodeProps,
  VNavsProps,
} from "@/design-system/components/navigation/types/v-navs.type";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import type { NavItem } from "@/shared/types/nav.type";
import { Menu } from "@chakra-ui/react";

export const VNavs = <TNavKey extends string>(props: VNavsProps<TNavKey>) => {
  // Props
  const {
    groups,
    navs,
    activeKey: controlledActiveKey,
    defaultActiveKey,
    expanded = true,
    onNavClick,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // States
  const [internalActiveKey, setInternalActiveKey] = useState<
    TNavKey | undefined
  >(defaultActiveKey);

  // Derived Values
  const isControlled = controlledActiveKey !== undefined;

  // Resolved Values
  const resolvedActiveKey = isControlled
    ? controlledActiveKey
    : internalActiveKey;

  // Utils
  function handleNavClick(key: TNavKey) {
    if (!isControlled) {
      setInternalActiveKey(key);
    }

    onNavClick?.(key);
  }

  return (
    <VScrollContainer className={"noScroll"} {...restProps}>
      {groups.map((group, groupIndex) => {
        const isFirstGroup = groupIndex === 0;
        const groupTitle = group.titleKey ? t[group.titleKey]() : null;

        return (
          <Fragment key={groupIndex}>
            {!isFirstGroup && !isSmallViewport && <Separator />}

            <VStack align={expanded ? "stretch" : "start"} overflow={"clip"}>
              {expanded && groupTitle && (
                <P fontSize={"sm"} color={"fg.subtle"} px={2} mb={2}>
                  {groupTitle}
                </P>
              )}

              <VStack
                align={expanded ? "stretch" : "center"}
                gap={isSmallViewport ? 0 : 1}
                overflow={"clip"}
                bg={"bg.body"}
                rounded={theme.radii.container}
              >
                {group.items.map((node, nodeIndex) => {
                  const isFirstNode = nodeIndex === 0;

                  return (
                    <Fragment key={nodeIndex}>
                      {!isFirstNode && isSmallViewport && (
                        <Separator ml={"46px"} />
                      )}

                      <VNavNode
                        node={node}
                        navs={navs}
                        activeKey={resolvedActiveKey}
                        expanded={expanded}
                        onNavClick={handleNavClick}
                      />
                    </Fragment>
                  );
                })}
              </VStack>
            </VStack>
          </Fragment>
        );
      })}
    </VScrollContainer>
  );
};

const VNavNode = <TNavKey extends string>(props: VNavNodeProps<TNavKey>) => {
  // Props
  const { node, navs, activeKey, expanded, onNavClick, depth = 0 } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Constants
  const nav = navs[node.key];
  const navTitle = t[nav.titleKey]();

  // Derived Values
  const isActive = activeKey === node.key;
  const hasChildren = !!node.children?.length;

  // Rail mode (!expanded) + has children → icon-only trigger + Chakra Menu popup
  if (!expanded && hasChildren) {
    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <NavButton
            aria-label={navTitle}
            variant={isActive ? "subtle" : "ghost"}
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

  return (
    <VStack gap={1} w={"full"}>
      <NavButton
        aria-label={navTitle}
        variant={isActive ? "subtle" : "ghost"}
        size={"md"}
        rounded={isSmallViewport ? 0 : theme.radii.component}
        onClick={() => onNavClick?.(node.key)}
      >
        <NavIcon nav={nav} title={navTitle} />

        {expanded && navTitle}
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

const NavIcon = ({ nav, title }: { nav: NavItem; title: string }) => {
  if (nav.icon) {
    return <AppIcon icon={nav.icon} />;
  }

  return (
    <Center boxSize={5} fontWeight={"semibold"}>
      {title.charAt(0).toUpperCase()}
    </Center>
  );
};
