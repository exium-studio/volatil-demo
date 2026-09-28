// src/features/mitra/my-data/pages/mitra.my-data.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { MitraMyDataDataView } from "@/features/mitra/my-data/components/mitra.my-data.data-view";
import { MitraMyDataWorkspaceTabsContent } from "@/features/mitra/my-data/components/mitra.my-data.workspace.tabs-content";
import type { MitraMyDataTab } from "@/features/mitra/my-data/types/my-data.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FolderOpenIcon, LayersIcon } from "lucide-react";
import { Suspense, useTransition } from "react";

const MY_DATA_TAB_MAP = {
  workspace: {
    icon: FolderOpenIcon,
    label: "Workspace",
  },
  layers: {
    icon: LayersIcon,
    label: "Daftar Seluruh Layer",
  },
} as const;

const MY_DATA_TAB_OPTIONS = (
  Object.keys(MY_DATA_TAB_MAP) as Array<keyof typeof MY_DATA_TAB_MAP>
).map((tabKey) => {
  const item = MY_DATA_TAB_MAP[tabKey];
  return {
    value: tabKey,
    icon: item.icon,
    label: item.label,
  };
});

export const MitraMyDataPage = () => {
  // Hooks
  const [_isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const search = useSearch({ from: "/_private/mitra/my-data" });

  // Derived Values
  const activeTab: MitraMyDataTab = search.tab ?? "workspace";

  // Handlers
  const handleTabChange = (nextTab: string) => {
    startTransition(() => {
      navigate({
        to: "/mitra/my-data",
        search: (prev) => {
          const updated = { ...prev } as Record<string, unknown>;
          updated.tab = nextTab;
          return updated;
        },
      });
    });
  };

  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <Container.Body flex={1} overflowY={"auto"}>
          <HStack wrap={"wrap"} justify={"space-between"} align={"center"}>
            <AppNavTitle navsMap={APP_NAVS_MAP} />
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          <Tabs.Root
            value={activeTab}
            flex={1}
            display={"flex"}
            flexDir={"column"}
            overflowY={"auto"}
            onValueChange={(details) => {
              handleTabChange(details.value);
            }}
          >
            <Tabs.List borderColor={"bg.canvas"}>
              {MY_DATA_TAB_OPTIONS.map((tab) => {
                return (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    flex={1}
                    justifyContent={"center"}
                    h={"headerH"}
                  >
                    <AppIcon icon={tab.icon} />
                    {tab.label}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <Suspense
              fallback={
                <Skeleton h={"full"} w={"full"} flex={1} p={"md"} rounded={0} />
              }
            >
              <Tabs.Content
                value={"workspace"}
                flex={1}
                overflowY={"auto"}
                p={0}
              >
                <MitraMyDataWorkspaceTabsContent
                  isActive={activeTab === "workspace"}
                />
              </Tabs.Content>

              <Tabs.Content value={"layers"} flex={1} overflowY={"auto"} p={0}>
                <MitraMyDataDataView />
              </Tabs.Content>
            </Suspense>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
