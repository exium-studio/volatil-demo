// src/features/internal/order-review/pages/internal.order-review.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useOrderReviewLayerStore } from "@/features/internal/order-review/stores/order-review-layer.store";
import type { CartOrderItem } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import {
  useInternalOrderDetailQuery,
  useProvisionOrder,
} from "@/features/internal/order-review/hooks/use-order-review";
import type { OrderLayerDataViewProps } from "@/features/internal/order-review/types/order-review.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { Url } from "@/design-system/components/typography/ui/url";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import {
  formatCurrency,
  formatNumber,
} from "@/shared/utils/formatter/number.formatter";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  MapPlusIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

export function InternalOrderReviewDetailPage() {
  // Hooks
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();

  // Effects — cleanup review preview layers on unmount
  useEffect(() => {
    return () => {
      useOrderReviewLayerStore.getState().resetLayers();
    };
  }, []);

  // Queries
  const { data: order, isLoading } = useInternalOrderDetailQuery(orderId);

  // Mutations
  const provisionMutation = useProvisionOrder();

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

  return (
    <AppContentContainer>
      <Container.Root withContext={true} flex={1}>
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer px={"xs"}>
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack align={"center"} gap={"sm"}>
                <BackButton
                  onClick={() => navigate({ to: "/internal/order-review" })}
                />

                <ClampedHeading>{"Review Permohonan Detail"}</ClampedHeading>
              </HStack>

              <HStack gap={2}>
                {order.status === "paid" && (
                  <Button
                    primary={true}
                    colorPalette={"blue"}
                    loading={provisionMutation.isPending}
                    onClick={() => {
                      provisionMutation.mutate({
                        orderId: order.orderId,
                      });
                    }}
                  >
                    <AppIcon icon={MapPlusIcon} />
                    {"Create Service WMS"}
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
                      {"Setujui Permohonan"}
                    </Button>
                  </InternalOrderReviewApproveTrigger>
                )}
              </HStack>
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Metadata Detail */}
          <VStack gap={"md"} p={"md"} align={"stretch"}>
            <VStack gap={"xs"} align={"start"}>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Pemohon / Mitra"}
              </P>

              <VStack gap={"2xs"} align={"start"}>
                <P fontWeight={"semibold"}>{order.mitraName}</P>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {order.mitraId}
                </P>
              </VStack>
            </VStack>

            <HStack gap={"lg"} wrap={"wrap"}>
              <VStack gap={"xs"} align={"start"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Metode Pengajuan"}
                </P>

                <SelectionTypeBadge size={"sm"}>
                  {order.selectionType}
                </SelectionTypeBadge>
              </VStack>

              <VStack gap={"xs"} align={"start"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Status"}
                </P>

                <OrderStatusBadge>{order.status}</OrderStatusBadge>
              </VStack>

              <VStack gap={"xs"} align={"start"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Total Estimasi PNBP"}
                </P>

                <P fontWeight={"semibold"}>
                  {formatCurrency(order.totalPrice ?? 0)}
                </P>
              </VStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          {/* Layer List */}
          <OrderLayerDataView
            order={order}
            onDetailAttribute={(item) => {
              void navigate({
                to: "/internal/order-review/$orderId/layer/$layerId",
                params: {
                  orderId: order.orderId,
                  layerId: encodeURIComponent(item.sourceLayerId || item.id),
                },
              });
            }}
          />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
}

const OrderLayerDataView = (props: OrderLayerDataViewProps) => {
  const { order, onDetailAttribute } = props;

  // Stores
  const { enabledLayerIds, setLayerEnabled } = useOrderReviewLayerStore();
  const { flyTo } = useFlyToLayer();

  // Queries — master IGT layers from catalog
  const { data: layersData } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
  });

  // Derived Values
  const fetchedLayersList = useMemo(() => {
    return layersData?.items ?? layersData?.layers ?? [];
  }, [layersData]);

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
        const previewUrl =
          item.previewWmsUrl ||
          item.wmsUrl ||
          (item.sourceLayerId
            ? buildWmsProxyUrl(`/api/proxy/wms?layerId=${item.sourceLayerId}`)
            : "");

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.sourceLayerTitle,
              td: (
                <VStack align={"start"}>
                  <P fontWeight={"medium"}>{item.sourceLayerTitle}</P>
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
                  maxW={"240px"}
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
          const matchedLayer = fetchedLayersList.find(
            (l) => l.id === item.sourceLayerId,
          );
          const previewUrl =
            item.previewWmsUrl ||
            item.wmsUrl ||
            (item.sourceLayerId
              ? buildWmsProxyUrl(`/api/proxy/wms?layerId=${item.sourceLayerId}`)
              : "");

          void flyTo(
            matchedLayer ?? {
              id: item.sourceLayerId,
              title: item.sourceLayerTitle,
              spatialBasis: item.spatialBasis,
              bbox: undefined,
              wms: {
                layers: item.sourceLayerId,
                wmsUrl: previewUrl,
              },
              wfs: {
                wfsTypeName: item.sourceLayerId,
                wfsUrl: item.previewWfsUrl || item.wfsUrl || "",
              },
            },
            {},
          );
        },
      },
      {
        key: "detail-attribute",
        label: "Detail Atribut",
        icon: TablePropertiesIcon,
        onClick: (item: CartOrderItem) => {
          onDetailAttribute(item);
        },
      },
    ];

    return { headers, items, itemActions };
  }, [
    order.items,
    enabledLayerIds,
    handleToggleLayer,
    flyTo,
    onDetailAttribute,
    fetchedLayersList,
  ]);

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
