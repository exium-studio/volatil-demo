// src\features\mitra\data-request\pages\mitra.data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { useAdministrativeFilterStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { useMitraDataRequestCalculationStore } from "@/features/mitra/data-request/stores/mitra.data-request-calculation.store";
import type { MitraDataRequestTab } from "@/features/mitra/data-request/types/mitra.data-request.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { IconPolygon } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FolderArchiveIcon, ListIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useTransition } from "react";

const MitraDataRequestCatalogTabsContent = lazy(() =>
  import("@/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content").then(
    (m) => ({ default: m.MitraDataRequestCatalogTabsContent }),
  ),
);

const MitraDataRequestUploadAoiTabsContent = lazy(() =>
  import("@/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content").then(
    (m) => ({ default: m.MitraDataRequestUploadAoiTabsContent }),
  ),
);

const MitraDataRequestDrawAoiTabsContent = lazy(() =>
  import("@/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content").then(
    (m) => ({ default: m.MitraDataRequestDrawAoiTabsContent }),
  ),
);

const REQUEST_METHOD_MAP = {
  catalog: {
    icon: ListIcon,
    label: "Katalog Data",
    content: MitraDataRequestCatalogTabsContent,
  },
  uploadAoi: {
    icon: FolderArchiveIcon,
    label: "Upload AOI",
    content: MitraDataRequestUploadAoiTabsContent,
  },
  drawAoi: {
    icon: IconPolygon,
    label: "Gambar AOI",
    content: MitraDataRequestDrawAoiTabsContent,
  },
};

const REQUEST_METHOD_OPTIONS = (
  Object.keys(REQUEST_METHOD_MAP) as Array<keyof typeof REQUEST_METHOD_MAP>
).map((methodKey) => {
  const item = REQUEST_METHOD_MAP[methodKey];

  return {
    value: methodKey,
    icon: item.icon,
    label: item.label,
    content: item.content,
  };
});

export const MitraDataRequestPage = () => {
  // Hooks
  const [_isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const search = useSearch({ from: "/_private/mitra/data-request" });

  // Derived Values
  const activeTab: MitraDataRequestTab = search.tab ?? "catalog";

  // Effects — Reset data request states only when navigating away from the route
  useEffect(() => {
    return () => {
      useAdministrativeFilterStore
        .getState()
        .setAppliedAdministrativeFilters({});
      useMitraDataRequestCalculationStore.getState().reset();
    };
  }, []);

  // Handlers
  const handleTabChange = (nextTab: string) => {
    startTransition(() => {
      navigate({
        to: "/mitra/data-request",
        search: (prev) => {
          const updated = { ...prev } as Record<string, unknown>;
          updated.tab = nextTab;
          delete updated.layerId;
          return updated;
        },
      });
    });
  };

  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root flex={1} overflowY={"auto"}>
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
              {REQUEST_METHOD_OPTIONS.map((method) => {
                return (
                  <Tabs.Trigger
                    key={method.value}
                    value={method.value}
                    flex={1}
                    justifyContent={"center"}
                    h={"headerH"}
                  >
                    <AppIcon icon={method.icon} />
                    {method.label}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <Suspense
              fallback={
                <Skeleton h={"full"} w={"full"} flex={1} p={"md"} rounded={0} />
              }
            >
              {REQUEST_METHOD_OPTIONS.map((method) => {
                const TabsContent = method.content;
                const isActive = activeTab === method.value;

                return (
                  <TabsContent
                    key={method.value}
                    value={method.value}
                    isActive={isActive}
                    overflowY={"auto"}
                  />
                );
              })}
            </Suspense>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
