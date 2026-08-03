// src/features/data-request/pages/data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HEADER_H, PADDING_SM } from "@/design-system/constants/styles";
import { DataRequestAoiTabsContent } from "@/features/data-request/components/data-request.aoi.tabs-content";
import { DataRequestCatalogTabsContent } from "@/features/data-request/components/data-request.catalog.tabs-content";
import { DataRequestDrawTabsContent } from "@/features/data-request/components/data-request.draw.tabs-content";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";

export const DataRequestPage = () => {
  const REQUEST_METHOD_MAP = {
    catalog: {
      icon: ListIcon,
      label: "Katalog Data",
      content: <DataRequestCatalogTabsContent value={"catalog"} />,
    },
    aoi: {
      icon: FolderArchiveIcon,
      label: "Upload AOI",
      content: <DataRequestAoiTabsContent value={"aoi"} />,
    },
    draw: {
      icon: IconPolygon,
      label: "Gambar Poligon",
      content: <DataRequestDrawTabsContent value={"draw"} />,
    },
  };
  const REQUEST_METHOD_OPTIONS = Object.keys(REQUEST_METHOD_MAP).map(
    (methodKey) => {
      const item = REQUEST_METHOD_MAP[methodKey];

      return {
        value: methodKey,
        icon: item.icon,
        label: item.label,
        content: item.content,
      };
    },
  );

  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING_SM} pb={PADDING_SM}>
      <Container.Root flex={1} px={PADDING_SM} overflowY={"auto"}>
        <Container.Body flex={1} overflowY={"auto"}>
          <Tabs.Root
            defaultValue={"catalog"}
            flex={1}
            display={"flex"}
            flexDir={"column"}
            overflowY={"auto"}
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
                return method.content;
              })}
            </>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
