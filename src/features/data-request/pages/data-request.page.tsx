// src/features/data-request/pages/data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HEADER_H, PADDING_SM } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { DataRequestAoiTabsContent } from "@/features/data-request/components/data-request.aoi.tabs-content";
import { DataRequestCatalogTabsContent } from "@/features/data-request/components/data-request.catalog.tabs-content";
import { DataRequestDrawTabsContent } from "@/features/data-request/components/data-request.draw.tabs-content";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";
import { useEffect } from "react";

const REQUEST_METHOD_MAP = {
  catalog: {
    icon: ListIcon,
    label: "Katalog Data",
    content: DataRequestCatalogTabsContent,
  },
  aoi: {
    icon: FolderArchiveIcon,
    label: "Upload AOI",
    content: DataRequestAoiTabsContent,
  },
  draw: {
    icon: IconPolygon,
    label: "Gambar Poligon",
    content: DataRequestDrawTabsContent,
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

export const DataRequestPage = () => {
  // Hooks
  const { queryValue: tab, setQueryValue: setTab } = useSearchParam("tab");

  // Set to default tab if query is not satisfied
  useEffect(() => {
    if (!tab || !Object.keys(REQUEST_METHOD_MAP).includes(tab)) {
      setTab("catalog");
    }
  }, [tab, setTab]);

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING_SM} pb={PADDING_SM}>
      <Container.Root flex={1} px={PADDING_SM} overflowY={"auto"}>
        <Container.Body flex={1} overflowY={"auto"}>
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
            <Tabs.List>
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
