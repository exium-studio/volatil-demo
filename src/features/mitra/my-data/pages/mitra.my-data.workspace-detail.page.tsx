// src/features/mitra/my-data/pages/mitra.my-data.workspace-detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { MitraMyDataEditTrigger } from "@/features/mitra/my-data/components/mitra.my-data.edit-modal";
import { MitraWorkspaceRenewalTrigger } from "@/features/mitra/my-data/components/mitra.my-data.renewal-modal";
import { useMitraWorkspaceDetailQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { LayerAttributeTableView } from "@/features/shared/components/layer-attribute-table.view";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ClockPlusIcon,
  DatabaseIcon,
  Edit3Icon,
  EyeIcon,
  EyeOffIcon,
  FileCheckIcon,
  FileTextIcon,
  FocusIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const MitraMyDataWorkspaceDetailPage = () => {
  // Navigation
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const navigate = useNavigate();

  // Search Params
  const { queryValue: layerId, setQueryValue: setLayerId } =
    useSearchParam("layerId");

  // Stores
  const { theme } = useThemeStore();
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
  const setLayerEnabled = useMapLayerStore((s) => s.setLayerEnabled);
  const setCustomLayerConfig = useMapLayerStore((s) => s.setCustomLayerConfig);

  // Hooks
  const { map, flyTo } = useFlyToLayer();

  // Queries
  const {
    data: workspace,
    isLoading,
    isError,
    error,
    refetch,
  } = useMitraWorkspaceDetailQuery(workspaceId);

  // Refs
  const hasFlownWorkspaceRef = useRef<string | null>(null);

  // Effects — Auto fly camera to workspace bounding box on load
  useEffect(() => {
    if (!map || !workspace || hasFlownWorkspaceRef.current === workspace.id) {
      return;
    }

    let targetBbox = workspace.bbox;
    if (!targetBbox && workspace.layers?.length) {
      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;
      for (const layer of workspace.layers) {
        if (layer.bbox && layer.bbox.length === 4) {
          if (layer.bbox[0] < minLng) minLng = layer.bbox[0];
          if (layer.bbox[1] < minLat) minLat = layer.bbox[1];
          if (layer.bbox[2] > maxLng) maxLng = layer.bbox[2];
          if (layer.bbox[3] > maxLat) maxLat = layer.bbox[3];
        }
      }
      if (
        minLng !== Infinity &&
        minLat !== Infinity &&
        maxLng !== -Infinity &&
        maxLat !== -Infinity
      ) {
        targetBbox = [minLng, minLat, maxLng, maxLat];
      }
    }

    if (targetBbox) {
      hasFlownWorkspaceRef.current = workspace.id;
      void flyTo({
        id: workspace.id,
        title: workspace.workspaceName,
        bbox: targetBbox,
      });
    }
  }, [map, workspace, flyTo]);

  // Effects — Cleanup loaded workspace layers on unmount / navigation
  useEffect(() => {
    return () => {
      const state = useMapLayerStore.getState();
      if (workspace?.layers) {
        for (const item of workspace.layers) {
          state.setLayerEnabled(item.id, false);
          state.setCustomLayerConfig(item.id, null);
        }
      }
    };
  }, [workspace?.layers]);

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const selectedAttributeLayer = useMemo(() => {
    if (!layerId || !workspace?.layers) return null;
    const found = workspace.layers.find((item) => item.id === layerId);
    if (!found) return null;
    return {
      ...found,
      wfsUrl: workspace.wfsUrl ?? null,
      wmsUrl: workspace.wmsUrl ?? null,
    };
  }, [layerId, workspace]);

  // Handlers
  const handleToggleLayer = useCallback(
    (item: MyDataItem, checked: boolean) => {
      if (checked) {
        if (!workspace?.wmsUrl) return;

        setCustomLayerConfig(item.id, {
          wmsUrl: workspace.wmsUrl,
          layers: item.wmsLayers || item.wfsTypeName || "",
          spatialBasis: item.spatialBasis,
        });
        setLayerEnabled(item.id, true);
      } else {
        setLayerEnabled(item.id, false);
        setCustomLayerConfig(item.id, null);
      }
    },
    [workspace, setCustomLayerConfig, setLayerEnabled],
  );

  // Derived Values — Table headers & items
  const dataList = useMemo(() => {
    const layers = workspace?.layers ?? [];
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT (Label)", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Status Pesanan", sortable: true },
      { th: "Sisa Waktu", sortable: true },
      { th: "Tanggal Kedaluwarsa", sortable: true },
      { th: "Tampilkan di Peta", sortable: false, align: "center" },
    ];

    const items: FormattedListItem<MyDataItem>[] = layers.map(
      (item: MyDataItem) => {
        const layerDisplayName =
          item.label || item.title || item.id.replace(/_/g, " ");
        const isVisibleOnMap = Boolean(enabledLayerIds[item.id]);

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: layerDisplayName,
              td: (
                <VStack align={"start"} gap={"2xs"}>
                  <ClampedP maxW={"220px"}>{layerDisplayName}</ClampedP>

                  <P fontSize={"xs"} color={"fg.subtle"} fontFamily={"mono"}>
                    {`ID: ${item.id}`}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },
            {
              value: item.spatialBasis,
              td: <IgtBasisBadge>{item.spatialBasis}</IgtBasisBadge>,
              align: "start" as const,
            },
            {
              value: item.status,
              td: <OrderStatusBadge>{item.status}</OrderStatusBadge>,
              align: "start" as const,
            },
            {
              value: item.expiresAt,
              td: item.expiresAt ? (
                <Countdown finishedAt={item.expiresAt} />
              ) : (
                <P color={"fg.subtle"}>{"-"}</P>
              ),
              align: "start" as const,
            },
            {
              value: item.expiresAt,
              td: (
                <P whiteSpace={"nowrap"}>
                  {item.expiresAt
                    ? formatUtcDateTime(item.expiresAt, preferredTimezone)
                    : "-"}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: isVisibleOnMap ? "Tampil" : "Sembunyi",
              td: (
                <Center>
                  <Switch
                    checked={isVisibleOnMap}
                    onCheckedChange={({ checked }) => {
                      handleToggleLayer(item, checked);
                    }}
                    tooltip={
                      isVisibleOnMap
                        ? "Sembunyikan dari Peta"
                        : "Tampilkan di Peta"
                    }
                    aria-label={`Toggle visibilitas peta untuk ${layerDisplayName}`}
                    size={"sm"}
                  />
                </Center>
              ),
              align: "center" as const,
            },
          ],
        };
      },
    );

    const itemActions: DataViewItemActionsGenerator<MyDataItem>[] = [
      {
        key: "toggle-map-visibility",
        label: (item: MyDataItem) => {
          const isVisible = Boolean(enabledLayerIds[item.id]);
          return isVisible ? "Sembunyikan dari Peta" : "Tampilkan di Peta";
        },
        icon: (item: MyDataItem) => {
          const isVisible = Boolean(enabledLayerIds[item.id]);
          return isVisible ? EyeOffIcon : EyeIcon;
        },
        onClick: (item: MyDataItem) => {
          const willEnable = !enabledLayerIds[item.id];
          handleToggleLayer(item, willEnable);
        },
      },
      {
        key: "fly-to-map",
        label: "Zoom ke Layer",
        icon: FocusIcon,
        onClick: (item: MyDataItem) => {
          void flyTo({
            id: item.id,
            title: item.title,
            spatialBasis: item.spatialBasis,
            bbox: item.bbox ?? null,
          });
        },
      },
      {
        key: "view-invoice",
        label: "Lihat Faktur",
        icon: FileTextIcon,
        href: (item: MyDataItem) => item.invoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (item: MyDataItem) => !item.invoiceUrl,
      },
      {
        key: "view-tte-invoice",
        label: "Lihat Faktur TTE",
        icon: FileCheckIcon,
        href: (item: MyDataItem) => item.tteInvoiceUrl ?? undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        hidden: (item: MyDataItem) => !item.tteInvoiceUrl,
      },
      {
        key: "edit-label",
        label: "Ubah Label",
        icon: Edit3Icon,
        modal: {
          triggerComponent: (item: MyDataItem) => (
            <MitraMyDataEditTrigger
              modalKey={`my-data-edit-${item.id}`}
              item={item}
            />
          ),
        },
      },
      {
        key: "detail-attribute",
        label: "Detail Atribut",
        icon: TablePropertiesIcon,
        onClick: (item: MyDataItem) => {
          setLayerId(item.id);
        },
      },
    ];

    return { headers, items, itemActions };
  }, [
    workspace?.layers,
    enabledLayerIds,
    preferredTimezone,
    handleToggleLayer,
    flyTo,
    setLayerId,
  ]);

  if (isLoading) {
    return (
      <AppContentContainer flex={1}>
        <Container.Root flex={1}>
          <Container.Body flex={1}>
            <VStack flex={1} gap={"md"} p={"md"}>
              <Skeleton />
            </VStack>
          </Container.Body>
        </Container.Root>
      </AppContentContainer>
    );
  }

  if (isError || !workspace) {
    return (
      <AppContentContainer flex={1}>
        <Container.Root flex={1}>
          <Container.Body flex={1}>
            <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
              <StateRetry
                title={"Gagal Memuat Detail Workspace"}
                description={
                  error?.message ||
                  "Workspace tidak ditemukan atau terjadi kesalahan saat memuat data."
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

  if (layerId) {
    return (
      <AppContentContainer flex={1} overflow={"auto"}>
        <Container.Root withContext={true} flex={1} minH={0} overflow={"auto"}>
          <Container.Body flex={1} minH={0} overflow={"auto"}>
            <LayerAttributeTableView
              layer={selectedAttributeLayer}
              onBack={() => setLayerId(undefined)}
              showActions={false}
            />
          </Container.Body>
        </Container.Root>
      </AppContentContainer>
    );
  }

  return (
    <AppContentContainer>
      <Container.Root withContext={true} flex={1}>
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
                  onClick={() => navigate({ to: "/mitra/my-data" })}
                />

                <ClampedHeading>{`${workspace.workspaceName}`}</ClampedHeading>
                <OrderStatusBadge>{workspace.status}</OrderStatusBadge>
              </HStack>
            </HStack>
          </HeaderContainer>

          {/* Workspace WMS URL & QGIS Guide */}
          <VStack gap={"sm"} p={"md"} align={"stretch"}>
            <P fontSize={"xs"} color={"fg.subtle"}>
              {"WMS URL Workspace (INTEROP Pusdatin)"}
            </P>

            <HStack gap={"2xs"}>
              <Url
                url={workspace.wmsUrl}
                label={"Salin WMS URL Workspace"}
                maxW={"full"}
              />

              <Tooltip content={"Zoom ke Workspace"}>
                <IconButton
                  aria-label={"Zoom ke Workspace"}
                  onClick={() => {
                    let targetBbox = workspace.bbox;
                    if (!targetBbox && workspace.layers?.length) {
                      let minLng = Infinity;
                      let minLat = Infinity;
                      let maxLng = -Infinity;
                      let maxLat = -Infinity;
                      for (const layer of workspace.layers) {
                        if (layer.bbox && layer.bbox.length === 4) {
                          if (layer.bbox[0] < minLng) minLng = layer.bbox[0];
                          if (layer.bbox[1] < minLat) minLat = layer.bbox[1];
                          if (layer.bbox[2] > maxLng) maxLng = layer.bbox[2];
                          if (layer.bbox[3] > maxLat) maxLat = layer.bbox[3];
                        }
                      }
                      if (
                        minLng !== Infinity &&
                        minLat !== Infinity &&
                        maxLng !== -Infinity &&
                        maxLat !== -Infinity
                      ) {
                        targetBbox = [minLng, minLat, maxLng, maxLat];
                      }
                    }

                    if (targetBbox) {
                      void flyTo({
                        id: workspace.id,
                        title: workspace.workspaceName,
                        bbox: targetBbox,
                      });
                    }
                  }}
                >
                  <AppIcon icon={FocusIcon} />
                </IconButton>
              </Tooltip>

              <MitraWorkspaceRenewalTrigger workspace={workspace}>
                <Tooltip content={"Perpanjang Workspace"}>
                  <IconButton aria-label={"Perpanjang Workspace"}>
                    <AppIcon icon={ClockPlusIcon} />
                  </IconButton>
                </Tooltip>
              </MitraWorkspaceRenewalTrigger>
            </HStack>

            <Box
              p={"sm"}
              bg={"bg.subtle"}
              rounded={theme.radii.component}
              mt={"xs"}
            >
              <P color={"fg.muted"}>
                {
                  "Gunakan URL WMS Workspace di atas untuk menambahkan seluruh layer dalam pesanan ini ke QGIS melalui menu Layer → Add Layer → Add WMS/WMTS Layer..."
                }
              </P>
            </Box>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          {/* Layer List Table */}
          <VStack flex={1} w={"full"}>
            {isEmptyArray(workspace.layers) ? (
              <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
                <StateNoData
                  icon={DatabaseIcon}
                  title={"Belum Ada Layer di Workspace Ini"}
                  description={
                    "Tidak ada data layer IGT yang terdaftar pada workspace ini."
                  }
                />
              </Center>
            ) : (
              <DataViewTable.Root<MyDataItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                withNumbering={true}
                pb={0}
                rounded={0}
              >
                <DataViewTable.Header />
                <DataViewTable.Body />
              </DataViewTable.Root>
            )}
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
