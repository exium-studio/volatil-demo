// src/features/mitra/data-request/pages/mitra.data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { DIMENSIONS, PADDING } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

const MitraDataRequestCatalogTabsContent = lazy(() =>
  import(
    "@/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content"
  ).then((m) => ({ default: m.MitraDataRequestCatalogTabsContent })),
);

const MitraDataRequestUploadAoiTabsContent = lazy(() =>
  import(
    "@/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content"
  ).then((m) => ({ default: m.MitraDataRequestUploadAoiTabsContent })),
);

const MitraDataRequestDrawAoiTabsContent = lazy(() =>
  import(
    "@/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content"
  ).then((m) => ({ default: m.MitraDataRequestDrawAoiTabsContent })),
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
  const { queryValue: tab, setQueryValue: setTab } = useSearchParam("tab");
  const { setQueryValue: setLayerId } = useSearchParam("layerId");

  // States
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([tab ?? "catalog"]),
  );

  // Set to default tab if query is not satisfied
  useEffect(() => {
    if (!tab || !Object.keys(REQUEST_METHOD_MAP).includes(tab)) {
      setTab("catalog");
    }
  }, [tab, setTab]);

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING.sm} p={PADDING.sm}>
      <Container.Root flex={1} overflowY={"auto"}>
        <Container.Body flex={1} overflowY={"auto"}>
          <HStack
            wrap={"wrap"}
            justify={"space-between"}
            align={"center"}
            pr={3}
          >
            <AppNavTitle navsMap={APP_NAVS_MAP} />
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          <Tabs.Root
            value={tab}
            flex={1}
            display={"flex"}
            flexDir={"column"}
            overflowY={"auto"}
            onValueChange={(details) => {
              setTab(details.value);
              setLayerId(undefined);
              setVisitedTabs((prev) => {
                const next = new Set(prev);
                next.add(details.value);
                return next;
              });
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
                    h={DIMENSIONS.headerH}
                  >
                    <AppIcon icon={method.icon} />
                    {method.label}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <Suspense fallback={<Skeleton h={"full"} w={"full"} flex={1} rounded={0} />}>
              {REQUEST_METHOD_OPTIONS.map((method) => {
                const TabsContent = method.content;
                const isVisited = visitedTabs.has(method.value);

                if (!isVisited) return null;

                return (
                  <TabsContent
                    key={method.value}
                    value={method.value}
                    overflowY={"auto"}
                  />
                );
              })}
            </Suspense>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
