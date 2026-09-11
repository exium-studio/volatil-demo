// src/features/design-system-docs/components/ds-docs-sidebar.tsx

import { Input } from "@/design-system/components/input/ui/input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { VNavs } from "@/design-system/components/navigation/ui/v-navs";
import { P } from "@/design-system/components/typography/ui/p";
import { DS_NAV_GROUPS_LIST } from "@/features/design-system-docs/constants/ds.nav-groups";
import { DS_NAVS_MAP } from "@/features/design-system-docs/constants/ds.navs";
import type { DsNavKey } from "@/features/design-system-docs/types/ds-docs-navs.type";
import type { NavItem } from "@/shared/types/nav.type";
import { useMemo, useState } from "react";

export const DsDocsSidebar = ({
  activeNavKey,
  onSelectNav,
}: {
  activeNavKey: DsNavKey;
  onSelectNav: (key: DsNavKey) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

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
    <VStack
      w={"280px"}
      h={"full"}
      borderRight={"1px solid"}
      borderColor={"border.subtle"}
      bg={"bg.subtle"}
      p={3}
      align={"stretch"}
      gap={3}
    >
      <VStack align={"stretch"} gap={2}>
        <HStack justify={"space-between"}>
          <P fontWeight={"bold"} fontSize={"sm"}>
            Design System Docs
          </P>
        </HStack>

        <Box pos={"relative"}>
          <Input
            size={"sm"}
            placeholder={"Filter components..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      </VStack>

      <VNavs<DsNavKey>
        groups={filteredGroups}
        navs={DS_NAVS_MAP as unknown as Record<DsNavKey, NavItem>}
        activeKey={activeNavKey}
        onNavClick={onSelectNav}
        flex={1}
        overflowY={"auto"}
        w={"full"}
      />
    </VStack>
  );
};
