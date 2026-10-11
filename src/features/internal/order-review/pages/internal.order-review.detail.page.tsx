// src/features/internal/order-review/pages/internal.order-review.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import {
  useInternalOrderDetailQuery,
  useOrdersProvisionStream,
  useProvisionOrder,
} from "@/features/internal/order-review/hooks/use-order-review";
import { useOrderReviewLayerStore } from "@/features/internal/order-review/stores/order-review-layer.store";
import type {
  OrderLayerDataViewProps,
  OrderSummaryProps,
} from "@/features/internal/order-review/types/order-review.type";
import type { CartOrderItem } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { normalizePolygonFeature } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import {
  highlightFeatureOnMap,
  removeFeatureHighlightFromMap,
} from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { TteBadge } from "@/features/shared/components/tte.badge";
import {
  formatCurrency,
  formatNumber,
} from "@/shared/utils/formatter/number.formatter";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  HandshakeIcon,
  LoaderIcon,
  MapPlusIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
import { DRAW_FILL_LAYER_ID } from "@/design-system/components/map/hooks/use-map-draw";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getSelectionTypeMapColors } from "@/features/shared/constants/volatil.ssot-map";
import type GeoJSON from "geojson";
import type maplibregl from "maplibre-gl";

const ORDER_REVIEW_AOI_SOURCE_ID = "order-review-aoi-source";
const ORDER_REVIEW_AOI_FILL_ID = "order-review-aoi-fill";
const ORDER_REVIEW_AOI_LINE_ID = "order-review-aoi-line";

const removeOrderReviewAoiLayer = (map: maplibregl.Map) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  try {
    if (map.getLayer(ORDER_REVIEW_AOI_FILL_ID)) {
      map.removeLayer(ORDER_REVIEW_AOI_FILL_ID);
    }
    if (map.getLayer(ORDER_REVIEW_AOI_LINE_ID)) {
      map.removeLayer(ORDER_REVIEW_AOI_LINE_ID);
    }
    if (map.getSource(ORDER_REVIEW_AOI_SOURCE_ID)) {
      map.removeSource(ORDER_REVIEW_AOI_SOURCE_ID);
    }
  } catch (err) {
    console.warn("Failed to remove order review AOI layer:", err);
  }
};

const renderOrderReviewAoiLayer = (
  map: maplibregl.Map,
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
  selectionType?: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!map || !(map as any).style) return;

  const { fillColor, lineColor } = getSelectionTypeMapColors(selectionType);

  try {
    const existingSource = map.getSource(ORDER_REVIEW_AOI_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(feature);
    } else {
      map.addSource(ORDER_REVIEW_AOI_SOURCE_ID, {
        type: "geojson",
        data: feature,
      });
    }

    const beforeId = map.getLayer(DRAW_FILL_LAYER_ID)
      ? DRAW_FILL_LAYER_ID
      : undefined;

    if (!map.getLayer(ORDER_REVIEW_AOI_FILL_ID)) {
      map.addLayer(
        {
          id: ORDER_REVIEW_AOI_FILL_ID,
          type: "fill",
          source: ORDER_REVIEW_AOI_SOURCE_ID,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": 0.25,
          },
        } as maplibregl.LayerSpecification,
        beforeId,
      );
    } else {
      map.setPaintProperty(ORDER_REVIEW_AOI_FILL_ID, "fill-color", fillColor);
    }

    if (!map.getLayer(ORDER_REVIEW_AOI_LINE_ID)) {
      map.addLayer(
        {
          id: ORDER_REVIEW_AOI_LINE_ID,
          type: "line",
          source: ORDER_REVIEW_AOI_SOURCE_ID,
          paint: {
            "line-color": lineColor,
            "line-width": 2.5,
            "line-opacity": 1,
          },
        } as maplibregl.LayerSpecification,
        beforeId,
      );
    } else {
      map.setPaintProperty(ORDER_REVIEW_AOI_LINE_ID, "line-color", lineColor);
    }
  } catch (err) {
    console.warn("Failed to render order review AOI layer:", err);
  }
};

export const InternalOrderReviewDetailPage = () => {
  // Hooks
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();
  const map = useMapInstanceStore((state) => state.map);

  // Stores
  const { isAoiVisible, setAoiPolygon, setAoiVisible } =
    useOrderReviewLayerStore();

  // Queries
  const { data: order, isLoading } = useInternalOrderDetailQuery(orderId);

  // Mutations
  const provisionOrderMutation = useProvisionOrder();

  // Background SSE listening if current order is 'processing'
  const processingOrderIds = useMemo(() => {
    return order?.status === "processing" && order.orderId
      ? [order.orderId]
      : [];
  }, [order]);

  useOrdersProvisionStream(processingOrderIds);

  // Sync order AOI Polygon with store on load
  useEffect(() => {
    if (order?.aoiPolygon) {
      setAoiPolygon(order.aoiPolygon, false);
    }
  }, [order?.aoiPolygon, setAoiPolygon]);

  // Effects — Reactive sync for permanent AOI layer (survives style ready)
  useEffect(() => {
    if (!map) return;

    const syncAoiLayer = () => {
      if (isAoiVisible && order?.aoiPolygon) {
        const feature = normalizePolygonFeature(order.aoiPolygon);
        if (feature) {
          renderOrderReviewAoiLayer(map, feature, order.selectionType);
        }
      } else {
        removeOrderReviewAoiLayer(map);
      }
    };

    const handleReady = () => {
      syncAoiLayer();
    };

    map.on(MAP_EVENTS_MAP.styleReady as string, handleReady);
    map.on(MAP_EVENTS_MAP.layersReady as string, handleReady);
    syncAoiLayer();

    return () => {
      map.off(MAP_EVENTS_MAP.styleReady as string, handleReady);
      map.off(MAP_EVENTS_MAP.layersReady as string, handleReady);
      removeOrderReviewAoiLayer(map);
    };
  }, [map, isAoiVisible, order]);

  // Effects — cleanup review preview layers & highlights on unmount / route change
  useEffect(() => {
    return () => {
      useOrderReviewLayerStore.getState().resetLayers();
      if (map) {
        removeFeatureHighlightFromMap(map);
        removeOrderReviewAoiLayer(map);
      }
    };
  }, [map]);

  // Handlers — Toggle AOI layer on/off (purely sets permanent layer visibility)
  const handleToggleAoi = useCallback(
    (checked: boolean) => {
      setAoiVisible(checked);
    },
    [setAoiVisible],
  );

  // Handlers — Zoom/Fly map camera to AOI polygon with temporary 1-second gray highlight
  const handleFlyToAoi = useCallback(() => {
    if (!map || !order?.aoiPolygon) return;
    const feature = normalizePolygonFeature(order.aoiPolygon);
    if (!feature) return;

    // Trigger temporary 1-second gray highlight + camera flyTo without affecting permanent AOI layer toggle
    highlightFeatureOnMap(map, feature, {
      zoom: 15,
      timeoutMs: 1000,
      fitCamera: true,
    });
  }, [map, order]);

  if (isLoading || !order) {
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

  const hasAoi = Boolean(order.aoiPolygon);

  return (
    <AppContentContainer>
      <Container.Root withContext={true} flex={1}>
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer px={"xs"}>
            <HStack
              justify={"space-between"}
              align={"center"}
              w={"full"}
              gap={"md"}
            >
              <HStack align={"center"} gap={"sm"}>
                <BackButton
                  onClick={() => navigate({ to: "/internal/order-review" })}
                />

                <ClampedHeading>{"Review Permintaan Detail"}</ClampedHeading>
              </HStack>

              <HStack gap={2}>
                {order.status === "paid" && (
                  <ConfirmationTrigger
                    modalKey={`provision-wms-${order.orderId}`}
                    icon={MapPlusIcon}
                    colorPalette={"blue"}
                    title={"Buat Layanan WMS"}
                    description={`Apakah Anda yakin ingin memulai pembuatan layanan WMS untuk pesanan "${order.orderNumber || order.orderId}" (Mitra: ${order.mitraName})? Proses ini akan menyiapkan workspace dan service layer di latar belakang.`}
                    confirmLabel={"Buat Layanan WMS"}
                    onConfirm={() => {
                      provisionOrderMutation.mutate({ orderId: order.orderId });
                    }}
                  >
                    <Button
                      primary={true}
                      colorPalette={"blue"}
                      loading={provisionOrderMutation.isPending}
                    >
                      <AppIcon icon={MapPlusIcon} />
                      {"Create Service WMS"}
                    </Button>
                  </ConfirmationTrigger>
                )}

                {order.status === "processing" && (
                  <Button variant={"outline"} disabled={true}>
                    <AppIcon icon={LoaderIcon} className={"animate-spin"} />
                    {"Menyiapkan Layanan WMS..."}
                  </Button>
                )}

                {order.status === "pending_review" && (
                  <InternalOrderReviewApproveTrigger
                    order={order}
                    modalKey={`approve-detail-${order.orderId}`}
                    onSuccessRedirect={() => {
                      void navigate({ to: "/internal/order-review" });
                    }}
                  >
                    <Button primary={true} colorPalette={"green"}>
                      <AppIcon icon={CheckCircleIcon} />
                      {"Setujui Permintaan"}
                    </Button>
                  </InternalOrderReviewApproveTrigger>
                )}
              </HStack>
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Metadata Summary */}
          <OrderSummary
            order={order}
            isAoiVisible={isAoiVisible}
            hasAoi={hasAoi}
            onToggleAoi={handleToggleAoi}
            onFlyToAoi={handleFlyToAoi}
          />

          {/* <Separator borderColor={"bg.canvas"} /> */}

          {/* Layer List */}
          <OrderLayerDataView order={order} />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};

const OrderSummary = (props: OrderSummaryProps) => {
  // Props
  const { order, isAoiVisible, hasAoi, onToggleAoi, onFlyToAoi } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack p={"md"} align={"stretch"} w={"full"}>
      <VStack gap={"md"} rounded={theme.radii.container} w={"full"}>
        {/* Top Header Section: Order Number, Status Badge, Mitra & Draw AOI Method */}
        <VStack align={"stretch"} gap={"xs"}>
          <HStack
            justify={"space-between"}
            align={"flex-start"}
            wrap={"wrap"}
            gap={"sm"}
          >
            <VStack align={"start"} gap={"2xs"}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Nomor pesanan"}
              </P>

              <P fontSize={"xl"} fontWeight={"bold"} lineHeight={"short"}>
                {order.orderNumber || order.orderId}
              </P>
            </VStack>

            <OrderStatusBadge>{order.status}</OrderStatusBadge>
          </HStack>

          <HStack align={"center"} gap={"xs"} wrap={"wrap"}>
            <HStack align={"center"} gap={"2xs"}>
              <AppIcon icon={HandshakeIcon} size={"sm"} color={"fg.subtle"} />

              <P fontSize={"sm"} color={"fg.muted"}>
                {order.mitraName}
              </P>
            </HStack>

            <P color={"fg.subtle"}>{"•"}</P>

            <SelectionTypeBadge>{order.selectionType}</SelectionTypeBadge>
          </HStack>
        </VStack>

        <VStack gap={"sm"}>
          {/* Middle Metric Cards Grid */}
          <SimpleGrid minChildWidth={"200px"} gap={"sm"}>
            {/* Card: Total Estimasi PNBP */}
            <VStack
              align={"start"}
              justify={"space-between"}
              p={"md"}
              rounded={theme.radii.container}
              border={"1px solid"}
              borderColor={"border.subtle"}
              minH={"110px"}
            >
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Total estimasi PNBP"}
              </P>

              <P fontSize={"xl"} fontWeight={"bold"} color={"fg.emphasized"}>
                {formatCurrency(order.totalPrice ?? 0)}
              </P>
            </VStack>

            {/* Card: TTE dan Faktur */}
            <VStack
              align={"start"}
              justify={"space-between"}
              p={"md"}
              rounded={theme.radii.container}
              border={"1px solid"}
              borderColor={"border.subtle"}
              minH={"110px"}
            >
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"TTE dan faktur"}
              </P>

              <TteBadge
                tte={order.tte}
                invoiceUrl={order.invoiceUrl}
                tteInvoiceUrl={order.tteInvoiceUrl}
              />
            </VStack>

            {/* Card: AOI Polygon */}
            {hasAoi && (
              <VStack
                align={"start"}
                justify={"space-between"}
                p={"md"}
                rounded={theme.radii.container}
                border={"1px solid"}
                borderColor={"border.subtle"}
                minH={"110px"}
              >
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"AOI polygon"}
                </P>

                <HStack align={"center"} gap={"xs"} w={"full"}>
                  <Switch
                    checked={isAoiVisible}
                    onCheckedChange={({ checked }) => {
                      onToggleAoi(checked);
                    }}
                    tooltip={
                      isAoiVisible
                        ? "Sembunyikan Polygon AOI"
                        : "Tampilkan Polygon AOI"
                    }
                  />

                  <Tooltip content={"Zoom ke AOI Polygon"}>
                    <IconButton
                      aria-label={"Zoom to AOI polygon"}
                      size={"xs"}
                      onClick={onFlyToAoi}
                    >
                      <AppIcon icon={FocusIcon} />
                    </IconButton>
                  </Tooltip>
                </HStack>
              </VStack>
            )}
          </SimpleGrid>

          {/* Bottom Card: URL Workspace GeoServer Volatil (Internal) */}
          <VStack
            align={"start"}
            p={"md"}
            rounded={theme.radii.container}
            border={"1px solid"}
            borderColor={"border.subtle"}
            gap={"xs"}
            w={"full"}
          >
            <P fontSize={"xs"} color={"fg.subtle"}>
              {"URL workspace GeoServer Volatil (internal)"}
            </P>

            <Url
              url={
                order.internalWorkspaceUrl ||
                `https://geoserver.internal.volatil.atrbpn.go.id/geoserver/${order.workspaceName || `ws_${order.orderId}`}/ows`
              }
              label={"Salin URL Workspace Volatil"}
              isExternalLink={false}
              maxW={"full"}
              p={"2xs"}
              pl={"sm"}
              bg={"bg.subtle"}
              rounded={theme.radii.component}
            />
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

const OrderLayerDataView = (props: OrderLayerDataViewProps) => {
  const { order } = props;

  // Stores
  const { enabledLayerIds, setLayerEnabled } = useOrderReviewLayerStore();

  // Hooks
  const { flyTo } = useFlyToLayer();
  const handleToggleLayer = useCallback(
    (item: CartOrderItem, enabled: boolean) => {
      const previewUrl = item.previewWmsUrl;

      if (enabled) {
        setLayerEnabled(item.sourceLayerId, true, {
          wmsUrl: previewUrl || "",
          layers: item.sourceLayerId,
          spatialBasis: item.spatialBasis,
        });
      } else {
        setLayerEnabled(item.sourceLayerId, false);
      }
    },
    [setLayerEnabled],
  );

  const handleFlyToLayer = useCallback(
    (item: CartOrderItem) => {
      console.log(item);
      void flyTo(
        {
          id: item.sourceLayerId,
          title: item.sourceLayerTitle,
          bbox: item.bbox ?? null,
          spatialBasis: item.spatialBasis,
        },
        {},
      );
    },
    [flyTo],
  );

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "WMS URL (Volatil)", sortable: false },
      { th: "Jumlah / Luas", sortable: true, align: "center" },
      // { th: "Estimasi Biaya", sortable: true, align: "end" },
      { th: "Tampilkan di Peta", align: "center" },
    ];

    const items: FormattedListItem<CartOrderItem>[] = (order.items ?? []).map(
      (item) => {
        const previewUrl = item.previewWmsUrl || item.wmsUrl || "";

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.sourceLayerTitle,
              td: (
                <VStack align={"start"}>
                  <P>{item.sourceLayerTitle}</P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {item.sourceLayerId}
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
              value: previewUrl,
              td: (
                <Url
                  url={previewUrl}
                  label={"Salin WMS URL"}
                  isExternalLink={false}
                  w={"240px"}
                  minW={"240px"}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.featuresCount,
              td: (
                <P textAlign={"center"}>
                  {item.spatialBasis === "kawasan"
                    ? `${formatNumber(item.areaHa ?? 0)} ha`
                    : `${formatNumber(item.featuresCount ?? 0)} bidang`}
                </P>
              ),
              align: "center" as const,
            },
            // {
            //   value: item.subtotalPrice ?? 0,
            //   td: <P>{formatCurrency(item.subtotalPrice ?? 0)}</P>,
            //   align: "end" as const,
            // },
            {
              value: enabledLayerIds[item.sourceLayerId] ?? false,
              td: (
                <Switch
                  checked={enabledLayerIds[item.sourceLayerId] ?? false}
                  onCheckedChange={({ checked }) => {
                    handleToggleLayer(item, checked);
                  }}
                  tooltip={
                    (enabledLayerIds[item.sourceLayerId] ?? false)
                      ? "Sembunyikan dari Peta"
                      : "Tampilkan di Peta"
                  }
                />
              ),
              align: "center" as const,
            },
          ],
        };
      },
    );

    const itemActions = [
      {
        key: "toggle-map-visibility",
        label: (item: CartOrderItem) => {
          const isVisible = enabledLayerIds[item.sourceLayerId] ?? false;
          return isVisible ? "Sembunyikan dari Peta" : "Tampilkan di Peta";
        },
        icon: (item: CartOrderItem) => {
          const isVisible = enabledLayerIds[item.sourceLayerId] ?? false;
          return isVisible ? EyeOffIcon : EyeIcon;
        },
        onClick: (item: CartOrderItem) => {
          const current = enabledLayerIds[item.sourceLayerId] ?? false;
          handleToggleLayer(item, !current);
        },
      },
      {
        key: "fly-to-map",
        label: "Zoom ke Layer",
        icon: FocusIcon,
        onClick: (item: CartOrderItem) => {
          handleFlyToLayer(item);
        },
      },
    ];

    return { headers, items, itemActions };
  }, [order.items, enabledLayerIds, handleToggleLayer, handleFlyToLayer]);

  return (
    <VStack flex={1} w={"full"}>
      <DataViewTable.Root<CartOrderItem>
        headers={dataList.headers}
        items={dataList.items}
        itemActions={dataList.itemActions}
        withNumbering
        pb={0}
        rounded={0}
      >
        <DataViewTable.Header />
        <DataViewTable.Body />
      </DataViewTable.Root>
    </VStack>
  );
};
