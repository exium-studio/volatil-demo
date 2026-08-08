// src/features/mitra/data-request/pages/mitra.data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { HEADER_H, PADDING_SM } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { MitraDataRequestCatalogTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content";
import { MitraDataRequestDrawAoiTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content";
import { MitraDataRequestUploadAoiTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";
import { useEffect } from "react";

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

  // Set to default tab if query is not satisfied
  useEffect(() => {
    if (!tab || !Object.keys(REQUEST_METHOD_MAP).includes(tab)) {
      setTab("catalog");
    }
  }, [tab, setTab]);

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING_SM} p={PADDING_SM}>
      <Container.Root flex={1} overflowY={"auto"}>
        <Container.Body flex={1} overflowY={"auto"}>
          <AppNavTitle navsMap={APP_NAVS_MAP} />

          <Separator borderColor={"bg.canvas"} />

          <Tabs.Root
            value={tab}
            flex={1}
            display={"flex"}
            flexDir={"column"}
            overflowY={"auto"}
            onValueChange={(details) => {
              setTab(details.value);
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
                    h={HEADER_H}
                  >
                    <AppIcon icon={method.icon} />
                    {method.label}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <>
              {REQUEST_METHOD_OPTIONS.map((method) => {
                const TabsContent = method.content;
                return <TabsContent key={method.value} value={method.value} />;
              })}
            </>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
