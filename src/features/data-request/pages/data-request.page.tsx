// src/features/data-request/pages/data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HEADER_H, PADDING_SM } from "@/design-system/constants/styles";
import { DataRequestAoiTabsContent } from "@/features/data-request/components/data-request.aoi.tabs-content";
import { DataRequestCatalogTabsContent } from "@/features/data-request/components/data-request.catalog.tabs-content";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";

export const DataRequestPage = () => {
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
              <Tabs.Trigger
                value={"catalog"}
                flex={1}
                justifyContent={"center"}
                h={HEADER_H}
              >
                <AppIcon icon={ListIcon} />
                Katalog Data
              </Tabs.Trigger>

              <Tabs.Trigger
                value={"aoi"}
                flex={1}
                justifyContent={"center"}
                h={HEADER_H}
              >
                <AppIcon icon={FolderArchiveIcon} />
                Upload AOI
              </Tabs.Trigger>

              <Tabs.Trigger
                value={"polygon"}
                flex={1}
                justifyContent={"center"}
                h={HEADER_H}
              >
                <AppIcon icon={IconPolygon} />
                Gambar Poligon
              </Tabs.Trigger>
            </Tabs.List>

            <>
              <DataRequestCatalogTabsContent value={"catalog"} />

              <DataRequestAoiTabsContent value={"aoi"} />

              <Tabs.Content value={"polygon"}>
                Manage your tasks for freelancers
              </Tabs.Content>
            </>
          </Tabs.Root>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
