// src/features/design-system-docs/components/ds-docs-sidebar.tsx

import { Logo } from "@/design-system/components/branding/ui/logo";
import { Input } from "@/design-system/components/input/ui/input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Sidebar } from "@/design-system/components/navigation/ui/sidebar";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import { Drawer } from "@/design-system/components/overlay/ui/drawer";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useSidebarStore } from "@/design-system/stores/sidebar-store";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { DS_NAV_GROUPS_LIST } from "@/features/design-system-docs/constants/ds.nav-groups";
import { DS_NAVS_MAP } from "@/features/design-system-docs/constants/ds.navs";
import type {
  DsDocsSidebarProps,
  DsNavKey,
} from "@/features/design-system-docs/types/ds-docs-navs.type";
import type { NavItem } from "@/shared/types/nav.type";
import { useMemo, useState } from "react";

const DS_SIDEBAR_KEY = "ds-docs";
const DEFAULT_SIDEBAR_EXPANDED = true;

export const DsDocsSidebar = (props: DsDocsSidebarProps) => {
  // Props
  const { activeNavKey, onSelectNav, isMobileDrawer = false } = props;

  // Stores
  const storedExpanded = useSidebarStore(
    (s) => s.expandedByKey[DS_SIDEBAR_KEY] ?? DEFAULT_SIDEBAR_EXPANDED,
  );
  const expanded = isMobileDrawer ? true : storedExpanded;

  // States
  const [searchQuery, setSearchQuery] = useState("");

  // Derived Values
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return DS_NAV_GROUPS_LIST;
    const query = searchQuery.toLowerCase();

    return DS_NAV_GROUPS_LIST.map((group) => ({
      ...group,
      items: group.items
        .map((item) => {
          if (item.children) {
            const filteredChildren = item.children.filter((child) => {
              const nav = DS_NAVS_MAP[child.key as keyof typeof DS_NAVS_MAP];
              return nav?.title?.toLowerCase().includes(query);
            });
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
          }
          const nav = DS_NAVS_MAP[item.key as keyof typeof DS_NAVS_MAP];
          return nav?.title?.toLowerCase().includes(query) ? item : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  return (
    <Sidebar.Root
      {...(isMobileDrawer
        ? { expandable: false, w: "full", borderRight: "none" }
        : { expandable: true, sidebarKey: DS_SIDEBAR_KEY })}
      defaultExpanded={DEFAULT_SIDEBAR_EXPANDED}
    >
      <Sidebar.Header>
        <DsDocsSidebarHeader
          expanded={expanded}
          isMobileDrawer={isMobileDrawer}
        />
      </Sidebar.Header>

      <Sidebar.Separator mx={-1} />

      <Sidebar.Body>
        {/* Filter Input (Only when expanded) */}
        {expanded && (
          <Box p={"sm"} flexShrink={0} w={"full"}>
            <Input
              size={"sm"}
              placeholder={"Filter components..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
        )}

        {/* VNavs */}
        <VNavs<DsNavKey>
          flex={1}
          groups={filteredGroups}
          navs={DS_NAVS_MAP as unknown as Record<DsNavKey, NavItem>}
          activeKey={activeNavKey}
          expanded={expanded}
          onNavClick={onSelectNav}
          p={3}
        />
      </Sidebar.Body>
    </Sidebar.Root>
  );
};

const DsDocsSidebarHeader = ({
  expanded,
  isMobileDrawer = false,
}: {
  expanded: boolean;
  isMobileDrawer?: boolean;
}) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack align={"center"} justify={"space-between"} w={"full"}>
      <HStack align={"center"} gap={"sm"}>
        <Logo boxSize={20} ml={1.5} flexShrink={0} />

        <ClampedP
          w={expanded ? "" : 0}
          fontWeight={"semibold"}
          color={`${theme.colorPalette}.fg`}
          lineHeight={1.2}
        >
          Exium System
        </ClampedP>
      </HStack>

      {isMobileDrawer ? (
        <Drawer.CloseButton pos={"relative"} top={"auto"} right={"auto"} />
      ) : (
        <ClampedP
          w={expanded ? "" : 0}
          mr={1}
          fontSize={"sm"}
          transition={"200ms"}
          color={"fg.subtle"}
          lineHeight={1}
        >
          v1.0
        </ClampedP>
      )}
    </HStack>
  );
};
