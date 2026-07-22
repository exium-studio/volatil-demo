// src/design-system/components/navigation/ui/v-navs.tsx

import { Fragment, useMemo } from "react";

import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type {
  VNavIconProps,
  VNavNodeProps,
  VNavsProps,
} from "@/design-system/components/navigation/types/v-navs.type";
import { NavButton } from "@/design-system/components/navigation/ui/nav";
import { findActivePath } from "@/design-system/components/navigation/utils/v-navs.utils";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const NAV_CHILD_ITEM_HEIGHT = 46;
const NAV_INDICATOR_HEIGHT = 16;
const NAV_INDICATOR_OFFSET = (NAV_CHILD_ITEM_HEIGHT - NAV_INDICATOR_HEIGHT) / 2;

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

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Derived Values — jalur ancestor menuju activeKey, dihitung sekali per render.
  const activePathKeys = useMemo(() => {
    for (const group of groups) {
      const path = findActivePath(group.items, activeKey);
      if (path) return new Set(path);
    }
    return new Set<TNavKey>();
  }, [groups, activeKey]);

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

              <VStack gap={1} align={expanded ? "stretch" : "center"}>
                {group.items.map((node, nodeIndex) => (
                  <VNavNode
                    key={nodeIndex}
                    node={node}
                    navs={navs}
                    activeKey={activeKey}
                    activePathKeys={activePathKeys}
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
  // Props
  const {
    node,
    navs,
    activeKey,
    activePathKeys,
    expanded,
    onNavClick,
    depth = 0,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Constants
  const nav = navs[node.key];
  const navTitle = t[nav.titleKey]();
  const hasChildren = !!node.children?.length;

  // Derived Values
  const isActive = activeKey === node.key;
  const isAncestorActive = activePathKeys.has(node.key) && !isActive;

  // States
  const [internalOpen, setInternalOpen] = useState(isAncestorActive);
  // const opened = internalOpen || isAncestorActive;
  const opened = internalOpen;

  // Rail mode, no children → icon-only button
  if (!expanded && !hasChildren) {
    return (
      <NavButton
        aria-label={navTitle}
        variant={isActive ? "subtle" : "ghost"}
        // color={isActive ? `${theme.colorPalette}.fg` : undefined}
        onClick={() => onNavClick?.(node.key)}
      >
        <NavIcon nav={nav} />
      </NavButton>
    );
  }

  // Rail mode + has children → icon-only trigger + Chakra Menu popup
  if (!expanded && hasChildren) {
    return (
      <Menu.Root>
        <Menu.Trigger asChild>
          <NavButton
            aria-label={navTitle}
            variant={isActive || isAncestorActive ? "subtle" : "ghost"}
            // color={isActive ? `${theme.colorPalette}.fg` : undefined}
          >
            <NavIcon nav={nav} />
          </NavButton>
        </Menu.Trigger>

        <Menu.Content>
          {node.children!.map((child) => {
            const childNav = navs[child.key];
            const isChildActive = activeKey === child.key;

            return (
              <Menu.Item
                key={child.key}
                value={child.key}
                onClick={() => onNavClick?.(child.key)}
                bg={isChildActive ? "neutral.subtle" : undefined}
                // color={isChildActive ? `${theme.colorPalette}.fg` : undefined}
              >
                {childNav.icon && <AppIcon icon={childNav.icon} />}

                {t[childNav.titleKey]()}
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Root>
    );
  }

  // Expanded, no children → icon + label button
  if (!hasChildren) {
    return (
      <NavButton
        aria-label={navTitle}
        variant={isActive && depth === 0 ? "subtle" : "ghost"}
        // color={isActive ? `${theme.colorPalette}.fg` : undefined}
        h={"40px"}
        w={"full"}
        rounded={isSmallViewport ? 0 : theme.radii.component}
        onClick={() => onNavClick?.(node.key)}
      >
        <NavIcon nav={nav} />

        <ClampedP>{navTitle}</ClampedP>
      </NavButton>
    );
  }

  // Expanded + children → Collapsible, children container with vertical line + sliding indicator
  const activeChildIndex = node.children!.findIndex(
    (child) => child.key === activeKey || activePathKeys.has(child.key),
  );
  return (
    <Collapsible.Root
      opened={opened}
      onOpenChange={(e) => setInternalOpen(e.open)}
    >
      <Collapsible.Trigger
        _open={{
          bg: isActive || isAncestorActive ? "bg.muted" : "transparent",
        }}
      >
        <NavButton
          aria-expanded={opened}
          size={"md"}
          variant={isActive || isAncestorActive ? "subtle" : "ghost"}
          h={"40px"}
          w={"full"}
          rounded={isSmallViewport ? 0 : theme.radii.component}
          _hover={{
            bg: "bg.subtle",
          }}
        >
          <NavIcon nav={nav} />

          <ClampedP>{navTitle}</ClampedP>

          <AppIcon
            icon={ChevronDownIcon}
            size={"sm"}
            ml={"auto"}
            transform={opened ? "rotate(180deg)" : undefined}
            transition={"transform 150ms ease"}
          />
        </NavButton>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <VStack
          pos={"relative"}
          pl={"13px"}
          py={1}
          ml={`calc(18px * ${depth + 1})`}
          borderLeft={"1px solid"}
          borderColor={"border.subtle"}
        >
          {/* Sliding active indicator */}
          {activeChildIndex !== -1 && (
            <Box
              pos={"absolute"}
              left={"-1px"}
              top={0}
              w={"2px"}
              h={`${NAV_INDICATOR_HEIGHT}px`}
              bg={"colorPalette.solid"}
              transform={`translateY(${activeChildIndex * NAV_CHILD_ITEM_HEIGHT + NAV_INDICATOR_OFFSET}px)`}
              transition={"transform 200ms ease"}
            />
          )}

          <VStack gap={1} align={"stretch"}>
            {node.children!.map((child) => (
              <VNavNode
                key={child.key}
                node={child}
                navs={navs}
                activeKey={activeKey}
                activePathKeys={activePathKeys}
                expanded={expanded}
                onNavClick={onNavClick}
                depth={depth + 1}
              />
            ))}
          </VStack>
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const NavIcon = (props: VNavIconProps) => {
  // Props
  const { nav, ...restProps } = props;

  return (
    nav.icon && <AppIcon icon={nav.icon} color={"fg.muted"} {...restProps} />
  );
};
