// src/features/internal/master-igt-layer/pages/internal.master-igt-layer.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { InternalMasterIgtLayerAttributeList } from "@/features/internal/master-igt-layer/components/internal.master-igt-layer.attribute-list";
import { InternalMasterIgtLayerConfigForm } from "@/features/internal/master-igt-layer/components/internal.master-igt-layer.config-form";
import { useMasterIgtLayerDetailQuery } from "@/features/internal/master-igt-layer/hooks/use-master-igt-layer";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { normalizeApiUrl } from "@/shared/utils/url/url.utils";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  SettingsIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback } from "react";

export const InternalMasterIgtLayerDetailPage = () => {
  // Navigation & Params
  const { layerId } = useParams({
    from: "/_private/internal/master-igt-layer/$layerId",
  });
  const navigate = useNavigate();
  const search = useSearch({
    from: "/_private/internal/master-igt-layer/$layerId",
  });

  // Stores
  const { theme } = useThemeStore();
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
  const setLayerEnabled = useMapLayerStore((s) => s.setLayerEnabled);
  const setCustomLayerConfig = useMapLayerStore((s) => s.setCustomLayerConfig);

  // Hooks
  const { flyTo } = useFlyToLayer();
  const { layer, isLoading, isError, error, refetch } =
    useMasterIgtLayerDetailQuery(layerId);

  // Derived Values
  const activeTab = search.tab ?? "config";
  const isVisibleOnMap = Boolean(layer && enabledLayerIds[layer.id]);

  const rawWmsUrl = layer ? layer.wms.url || layer.wms.baseUrl : "";
  const rawWfsUrl = layer ? layer.wfs.url || layer.wfs.baseUrl : "";
  const normalizedWmsUrl = normalizeApiUrl(rawWmsUrl);
  const normalizedWfsUrl = normalizeApiUrl(rawWfsUrl);

  // Handlers
  const handleTabChange = (nextTab: string) => {
    void navigate({
      to: "/internal/master-igt-layer/$layerId",
      params: { layerId },
      search: { tab: nextTab as "config" | "attribute" },
      replace: true,
    });
  };

  const handleToggleMapVisibility = useCallback(
    (checked: boolean) => {
      if (!layer) return;

      if (!checked) {
        setLayerEnabled(layer.id, false);
        setCustomLayerConfig(layer.id, null);
      } else {
        setCustomLayerConfig(layer.id, {
          wmsUrl: normalizedWmsUrl || "",
          layers: layer.typeName || "",
          spatialBasis: layer.igtBasis,
          minZoom: layer.minZoom ?? 12,
        });
        setLayerEnabled(layer.id, true);

        if (layer.bbox || normalizedWfsUrl) {
          void flyTo({
            id: layer.id,
            title: layer.title,
            spatialBasis: layer.igtBasis,
            bbox: layer.bbox,
            wfs: normalizedWfsUrl
              ? {
                  wfsTypeName: layer.typeName || "",
                  wfsUrl: normalizedWfsUrl,
                }
              : undefined,
          });
        }
      }
    },
    [
      layer,
      normalizedWmsUrl,
      normalizedWfsUrl,
      flyTo,
      setCustomLayerConfig,
      setLayerEnabled,
    ],
  );

  const handleFlyToLayer = useCallback(() => {
    if (!layer) return;

    void flyTo({
      id: layer.id,
      title: layer.title,
      spatialBasis: layer.igtBasis,
      bbox: layer.bbox,
      wfs: normalizedWfsUrl
        ? {
            wfsTypeName: layer.typeName || "",
            wfsUrl: normalizedWfsUrl,
          }
        : undefined,
    });
  }, [layer, normalizedWfsUrl, flyTo]);

  // Loading State
  if (isLoading) {
    return (
      <AppContentContainer flex={1}>
        <Container.Root flex={1}>
          <Container.Body flex={1}>
            <VStack flex={1} gap={"md"} p={"md"}>
              <Skeleton h={"60px"} w={"full"} />
              <Skeleton h={"120px"} w={"full"} />
              <Skeleton minH={"400px"} w={"full"} />
            </VStack>
          </Container.Body>
        </Container.Root>
      </AppContentContainer>
    );
  }

  // Error State
  if (isError || !layer) {
    return (
      <AppContentContainer flex={1}>
        <Container.Root flex={1}>
          <Container.Body flex={1}>
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              <StateRetry
                title={"Gagal Memuat Detail Layer IGT"}
                description={
                  error?.message ||
                  "Layer IGT tidak ditemukan atau terjadi kesalahan saat memuat data."
                }
                onRetry={() => {
                  void refetch();
                }}
              />
            </Center>
          </Container.Body>
        </Container.Root>
      </AppContentContainer>
    );
  }

  return (
    <AppContentContainer overflowY={"auto"}>
      <Container.Root withContext={true} flex={1} overflowY={"auto"}>
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer px={"xs"}>
            <HStack
              justify={"space-between"}
              align={"center"}
              gap={"md"}
              w={"full"}
            >
              <HStack align={"center"} gap={"sm"}>
                <BackButton
                  onClick={() => navigate({ to: "/internal/master-igt-layer" })}
                />

                <ClampedHeading>{layer.title}</ClampedHeading>

                <IgtBasisBadge>{layer.igtBasis}</IgtBasisBadge>

                <Badge colorPalette={layer.isActive ? "green" : "gray"}>
                  {layer.isActive ? "Publik" : "Draft"}
                </Badge>
              </HStack>

              <HStack gap={"xs"} align={"center"}>
                <Tooltip
                  content={
                    isVisibleOnMap
                      ? "Sembunyikan dari Peta"
                      : "Tampilkan di Peta"
                  }
                >
                  <IconButton
                    aria-label={"Toggle visibilitas peta"}
                    onClick={() => handleToggleMapVisibility(!isVisibleOnMap)}
                  >
                    <AppIcon icon={isVisibleOnMap ? EyeOffIcon : EyeIcon} />
                  </IconButton>
                </Tooltip>

                <Tooltip content={"Zoom ke Layer"}>
                  <IconButton
                    aria-label={"Zoom ke Layer"}
                    onClick={handleFlyToLayer}
                  >
                    <AppIcon icon={FocusIcon} />
                  </IconButton>
                </Tooltip>
              </HStack>
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <VStack gap={"sm"} overflowY={"auto"}>
            {/* Metadata Overview Cards */}
            <SimpleGrid minChildWidth={"260px"} gap={"sm"} w={"full"} p={"md"}>
              {/* Card 1: WMS Endpoint */}
              <VStack
                align={"start"}
                justify={"space-between"}
                gap={"md"}
                p={"md"}
                rounded={theme.radii.container}
                border={"1px solid"}
                borderColor={"border.subtle"}
                bg={"bg.body"}
                minH={"100px"}
              >
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"WMS Endpoint"}
                </P>

                <Url
                  url={layer.wms.url}
                  label={"Salin URL WMS"}
                  maxW={"full"}
                />
              </VStack>

              {/* Card 2: GeoServer & Workspace */}
              <VStack
                align={"start"}
                justify={"space-between"}
                gap={"md"}
                p={"md"}
                rounded={theme.radii.container}
                border={"1px solid"}
                borderColor={"border.subtle"}
                bg={"bg.body"}
                minH={"100px"}
              >
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"GeoServer & Workspace"}
                </P>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    {layer.geoserver?.name || layer.geoserverId}
                  </P>

                  <P fontSize={"xs"} color={"fg.subtle"} fontFamily={"mono"}>
                    {`Typename: ${layer.typeName || "-"}`}
                  </P>
                </VStack>
              </VStack>

              {/* Card 3: Display Settings */}
              <VStack
                align={"start"}
                justify={"space-between"}
                gap={"md"}
                p={"md"}
                rounded={theme.radii.container}
                border={"1px solid"}
                borderColor={"border.subtle"}
                bg={"bg.body"}
                minH={"100px"}
              >
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Pengaturan Tampilan Peta"}
                </P>

                <HStack align={"end"} justify={"space-between"} w={"full"}>
                  <VStack align={"start"} gap={0}>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {`Z-Index: ${layer.zIndex ?? 1} | Min Zoom: ${layer.minZoom ?? 12}`}
                    </P>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {`Default Tampil: ${layer.defaultVisible ? "Ya" : "Tidak"}`}
                    </P>
                  </VStack>

                  <HStack align={"center"} gap={"xs"}>
                    <Switch
                      checked={isVisibleOnMap}
                      onCheckedChange={({ checked }) =>
                        handleToggleMapVisibility(checked)
                      }
                    />
                  </HStack>
                </HStack>
              </VStack>
            </SimpleGrid>

            {/* Tabs: Konfigurasi (Edit Form) vs Data Atribut */}
            <Tabs.Root
              value={activeTab}
              display={"flex"}
              flexDir={"column"}
              fitted
              onValueChange={({ value }) => handleTabChange(value)}
            >
              <Tabs.List borderColor={"border.subtle"}>
                <Tabs.Trigger value={"config"} gap={"xs"}>
                  <AppIcon icon={SettingsIcon} />
                  {"Konfigurasi Spasial"}
                </Tabs.Trigger>

                <Tabs.Trigger value={"attribute"} gap={"xs"}>
                  <AppIcon icon={TablePropertiesIcon} />
                  {"Filter Atribut"}
                </Tabs.Trigger>
              </Tabs.List>

              {/* Tab 1: Form Edit Konfigurasi */}
              <Tabs.Content value={"config"} p={"md"}>
                <InternalMasterIgtLayerConfigForm
                  item={layer}
                  onSuccess={() => void refetch()}
                />
              </Tabs.Content>

              {/* Tab 2: Whitelist Atribut Layer */}
              <Tabs.Content value={"attribute"} pt={"md"}>
                <InternalMasterIgtLayerAttributeList
                  item={layer}
                  onSuccess={() => void refetch()}
                />
              </Tabs.Content>
            </Tabs.Root>
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};

export const InternalDataManagementDetailPage = InternalMasterIgtLayerDetailPage;
