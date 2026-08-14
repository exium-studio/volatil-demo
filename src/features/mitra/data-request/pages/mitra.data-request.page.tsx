// src/features/mitra/data-request/pages/mitra.data-request.page.tsx

import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { DIMENSIONS, PADDING, SPACING } from "@/design-system/constants/styles";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { MitraDataRequestCatalogTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content";
import { MitraDataRequestDrawAoiTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content";
import { MitraDataRequestUploadAoiTabsContent } from "@/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { IconPolygon } from "@tabler/icons-react";
import { FolderArchiveIcon, ListIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getIgtLayers } from "@/design-system/components/map/services/map-layers.api";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import SelectInput from "@/design-system/components/input/ui/select";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";

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

  // Stores
  const { selectedIgtLayer, setSelectedIgtLayer } = useIgtLayerStore();

  // Queries
  const { data: layersData, isLoading: isLoadingLayers } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // States
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    new Set([tab ?? "catalog"]),
  );

  // Set first layer as default when loaded
  useEffect(() => {
    if (layersData?.wfs && layersData.wfs.length > 0 && !selectedIgtLayer) {
      setSelectedIgtLayer(layersData.wfs[0]);
    }
  }, [layersData, selectedIgtLayer, setSelectedIgtLayer]);

  // Set to default tab if query is not satisfied
  useEffect(() => {
    if (!tab || !Object.keys(REQUEST_METHOD_MAP).includes(tab)) {
      setTab("catalog");
    }
  }, [tab, setTab]);

  // Derived Values — Dropdown options for selecting active WFS layer
  const selectOptions = useMemo(() => {
    return (layersData?.wfs ?? []).map((layer) => {
      const displayLabel = layer.wfsTypeName.split(":")[1] || layer.wfsTypeName;
      return {
        value: layer.id,
        label: displayLabel.replace(/_/g, " "),
      };
    });
  }, [layersData]);

  const handleLayerChange = (layerId: string) => {
    const layer = layersData?.wfs.find((l) => l.id === layerId);
    if (layer) {
      setSelectedIgtLayer(layer);
    }
  };

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

            {isLoadingLayers ? (
              <Skeleton width={"220px"} height={"32px"} />
            ) : (
              selectedIgtLayer && (
                <HStack gap={SPACING.xs} align={"center"}>
                  <SelectInput
                    value={selectedIgtLayer.id}
                    onValueChange={handleLayerChange}
                    selectOptions={selectOptions}
                    placeholder={"Pilih Layer Spasial"}
                    size={"xs"}
                    width={"220px"}
                  />
                </HStack>
              )
            )}
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          {!selectedIgtLayer ? (
            <Skeleton flex={1} p={PADDING.md} />
          ) : (
            <Tabs.Root
              value={tab}
              flex={1}
              display={"flex"}
              flexDir={"column"}
              overflowY={"auto"}
              onValueChange={(details) => {
                setTab(details.value);
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

              <>
                {REQUEST_METHOD_OPTIONS.map((method) => {
                  const TabsContent = method.content;
                  const isVisited = visitedTabs.has(method.value);

                  if (!isVisited) return null;

                  return (
                    <TabsContent key={method.value} value={method.value} />
                  );
                })}
              </>
            </Tabs.Root>
          )}
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
