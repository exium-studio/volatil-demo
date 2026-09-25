// src\features\design-system-docs\components\design-system-docs.page.tsx

// src\features\design-system-docs\components\design-system-docs.page.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Drawer } from "@/design-system/components/overlay/ui/drawer";
import { P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { ComponentPlayground } from "@/features/design-system-docs/components/component-playground";
import { DsDocsSidebar } from "@/features/design-system-docs/components/ds-docs-sidebar";
import { DemoPage } from "@/features/root/components/demo.page";
import { COMPONENTS_REGISTRY } from "@/features/design-system-docs/config/components-registry";
import type { DsNavKey } from "@/features/design-system-docs/types/ds-docs-navs.type";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { MenuIcon, SparklesIcon } from "lucide-react";
import { useCallback } from "react";

export const DesignSystemDocsPage = () => {
  // Hooks
  const isSmallViewport = useIsSmallViewport();
  const search = useSearch({ from: "/design-system/ui" });
  const navigate = useNavigate({ from: "/design-system/ui" });
  const mobileDrawer = usePopModal({ modalKey: "ds-docs-mobile-nav" });

  // Derived Values
  const activeNavKey: DsNavKey = (search.component as DsNavKey) || "overview";
  const currentSpec = COMPONENTS_REGISTRY[activeNavKey];

  // Callbacks
  const handleSelectNav = useCallback(
    (key: DsNavKey) => {
      // Ignore category container clicks so they only expand/collapse
      if (key.startsWith("cat_")) {
        return;
      }

      // If already active, dismiss mobile drawer if open, otherwise do nothing
      if (key === activeNavKey) {
        if (isSmallViewport && mobileDrawer.isOpen) {
          mobileDrawer.close();
        }
        return;
      }

      navigate({
        search: (prev) => {
          const nextSearch = { ...prev };
          if (key === "overview") {
            delete nextSearch.component;
          } else {
            nextSearch.component = key;
          }
          if (isSmallViewport && mobileDrawer.isOpen) {
            delete nextSearch.activeModalKey;
          }
          return nextSearch;
        },
      });
    },
    [activeNavKey, isSmallViewport, mobileDrawer, navigate],
  );

  return (
    <HStack
      h={"100dvh"}
      w={"full"}
      gap={0}
      // bg={"bg.canvas"}
      align={"stretch"}
      overflow={"hidden"}
    >
      {!isSmallViewport && (
        <DsDocsSidebar
          activeNavKey={activeNavKey}
          onSelectNav={handleSelectNav}
        />
      )}

      {isSmallViewport && (
        <Drawer.Root
          modalKey={"ds-docs-mobile-nav"}
          placement={"start"}
          size={"full"}
          opened={mobileDrawer.isOpen}
          open={mobileDrawer.open}
          close={mobileDrawer.close}
        >
          <Drawer.Content p={0}>
            <DsDocsSidebar
              isMobileDrawer
              activeNavKey={activeNavKey}
              onSelectNav={handleSelectNav}
            />
          </Drawer.Content>
        </Drawer.Root>
      )}

      {/* Main Content Area */}
      <VStack flex={1} h={"full"} overflow={"hidden"} align={"stretch"} gap={0}>
        {/* Header Bar */}
        <HStack
          flexShrink={0}
          align={"center"}
          justify={"space-between"}
          h={"60px"}
          px={"md"}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack align={"center"} gap={"sm"}>
            {isSmallViewport && (
              <IconButton
                size={"sm"}
                variant={"ghost"}
                aria-label={"Open Navigation Menu"}
                onClick={() => mobileDrawer.open()}
              >
                <AppIcon icon={MenuIcon} size={"sm"} />
              </IconButton>
            )}

            <P fontWeight={"bold"} fontSize={["sm", "md"]}>
              Exium Design System Documentation
            </P>
          </HStack>

          <HStack align={"center"} gap={"sm"}>
            <Button asChild>
              <Link to={"/demo"}>
                <AppIcon icon={SparklesIcon} size={"sm"} />
                {!isSmallViewport && " Full Demo Page"}
              </Link>
            </Button>
            <ColorModeToggleButton />
          </HStack>
        </HStack>

        {/* Content Body Scroll Area */}
        <Box flex={1} overflowY={"auto"} p={[4, 8]}>
          {activeNavKey === "overview" || !currentSpec ? (
            <DemoPage />
          ) : (
            <ComponentPlayground key={currentSpec.key} spec={currentSpec} />
          )}
        </Box>
      </VStack>
    </HStack>
  );
};
