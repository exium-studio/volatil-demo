// src/features/design-system-docs/components/design-system-docs.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { ComponentPlayground } from "@/features/design-system-docs/components/component-playground";
import { DsDocsSidebar } from "@/features/design-system-docs/components/ds-docs-sidebar";
import { OverviewDocs } from "@/features/design-system-docs/components/overview-docs";
import { COMPONENTS_REGISTRY } from "@/features/design-system-docs/config/components-registry";
import type { DsNavKey } from "@/features/design-system-docs/types/ds-docs-navs.type";
import { Link } from "@tanstack/react-router";
import { SparklesIcon } from "lucide-react";
import { useState } from "react";

export const DesignSystemDocsPage = () => {
  const [activeNavKey, setActiveNavKey] = useState<DsNavKey>("overview");

  const currentSpec = COMPONENTS_REGISTRY[activeNavKey];

  return (
    <HStack h={"100dvh"} w={"full"} gap={0} bg={"bg.canvas"} align={"stretch"}>
      {/* Sidebar Navigation */}
      <DsDocsSidebar
        activeNavKey={activeNavKey}
        onSelectNav={(key) => setActiveNavKey(key)}
      />

      {/* Main Content Area */}
      <VStack flex={1} h={"full"} overflow={"hidden"} align={"stretch"} gap={0}>
        {/* Header Bar */}
        <HStack
          h={"60px"}
          px={6}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
          bg={"bg.panel"}
          justify={"space-between"}
          align={"center"}
        >
          <HStack gap={2}>
            <P fontWeight={"bold"} fontSize={"md"}>
              Design System Interactive Documentation
            </P>
          </HStack>

          <HStack gap={3}>
            <Button asChild size={"sm"} variant={"ghost"}>
              <Link to={"/demo"}>
                <SparklesIcon size={14} /> Full Demo Page
              </Link>
            </Button>
            <ColorModeToggleButton />
          </HStack>
        </HStack>

        {/* Content Body Scroll Area */}
        <Box flex={1} overflowY={"auto"} p={8}>
          {activeNavKey === "overview" || !currentSpec ? (
            <OverviewDocs
              onSelectComponent={(key) => setActiveNavKey(key as DsNavKey)}
            />
          ) : (
            <ComponentPlayground spec={currentSpec} />
          )}
        </Box>
      </VStack>
    </HStack>
  );
};
