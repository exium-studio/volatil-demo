// src/features/internal/order-review/pages/internal.order-review.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalOrderReviewApproveTrigger } from "@/features/internal/order-review/components/internal.order-review.approve-modal";
import {
  useInternalOrderDetailQuery,
  useProvisionOrder,
} from "@/features/internal/order-review/hooks/use-order-review";
import type { OrderLayerDataViewProps } from "@/features/internal/order-review/types/order-review.type";
import type { CartOrderItem } from "@/features/mitra/cart/types/mitra.cart.order.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  MapPinIcon,
  MapPlusIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";

export function InternalOrderReviewDetailPage() {
  // Hooks
  const { orderId } = useParams({ strict: false }) as { orderId: string };
  const navigate = useNavigate();

  // Queries
  const { data: order, isLoading } = useInternalOrderDetailQuery(orderId);

  // Mutations
  const provisionMutation = useProvisionOrder();

  if (isLoading || !order) {
    return (
      <PanelContentContainer>
        <Container.Root>
          <Container.Body>
            <VStack gap={"md"} p={"md"}>
              <Skeleton height={"40px"} width={"300px"} />
              <Skeleton height={"200px"} width={"full"} />
              <Skeleton height={"400px"} width={"full"} />
            </VStack>
          </Container.Body>
        </Container.Root>
      </PanelContentContainer>
    );
  }

  return (
    <PanelContentContainer>
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
                      <AppIcon icon={CheckCircle2Icon} />
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
    </PanelContentContainer>
  );
}

const OrderLayerDataView = (props: OrderLayerDataViewProps) => {
  const { order, onDetailAttribute } = props;

  // Stores
  const { enabledLayerIds, setLayerEnabled, setCustomLayerConfig } =
    useMapLayerStore();
  const { map } = useMapInstanceStore();

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
      const previewUrl =
        item.previewWmsUrl ||
        item.wmsUrl ||
        (item.sourceLayerId
          ? buildWmsProxyUrl(`/api/proxy/wms?layerId=${item.sourceLayerId}`)
          : "");

      if (enabled) {
        if (previewUrl) {
          setCustomLayerConfig(item.sourceLayerId, {
            wmsUrl: previewUrl,
            layers: item.sourceLayerId,
            spatialBasis: item.spatialBasis,
          });
        }
        setLayerEnabled(item.sourceLayerId, true);
      } else {
        setLayerEnabled(item.sourceLayerId, false);
        setCustomLayerConfig(item.sourceLayerId, null);
      }
    },
    [setCustomLayerConfig, setLayerEnabled],
  );

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "WMS URL (Volatil)", sortable: false },
      { th: "Jumlah / Luas", sortable: true, align: "center" },
      { th: "Estimasi Biaya", sortable: true, align: "end" },
      { th: "Lihat di Peta", align: "center" },
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
              td: <BasisIgtBadge>{item.spatialBasis}</BasisIgtBadge>,
              align: "start" as const,
            },
            {
              value: previewUrl,
              td: previewUrl ? (
                <HStack gap={"xs"} align={"center"} maxW={"220px"}>
                  <ClampedP
                    fontSize={"xs"}
                    fontFamily={"mono"}
                    color={"fg.muted"}
                    truncate
                  >
                    {previewUrl}
                  </ClampedP>
                  <ClipboardButton
                    value={previewUrl}
                    variant={"ghost"}
                    size={"xs"}
                    aria-label={"Salin WMS URL"}
                  />
                </HStack>
              ) : (
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"-"}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: item.featuresCount,
              td: (
                <P textAlign={"center"}>
                  {item.spatialBasis === "kawasan"
                    ? `${item.areaHa ?? 0} Ha`
                    : `${item.featuresCount} Bidang`}
                </P>
              ),
              align: "center" as const,
            },
            {
              value: item.subtotalPrice ?? 0,
              td: <P>{formatCurrency(item.subtotalPrice ?? 0)}</P>,
              align: "end" as const,
            },
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
        key: "detail-attribute",
        label: "Detail Atribut",
        icon: TablePropertiesIcon,
        onClick: (item: CartOrderItem) => {
          onDetailAttribute(item);
        },
      },
      {
        key: "fly-to-map",
        label: "Lihat di Peta",
        icon: MapPinIcon,
        onClick: (item: CartOrderItem) => {
          if (!map) return;
          const matchedLayer = fetchedLayersList.find(
            (l) => l.id === item.sourceLayerId,
          );
          const previewUrl =
            item.previewWmsUrl ||
            item.wmsUrl ||
            (item.sourceLayerId
              ? buildWmsProxyUrl(`/api/proxy/wms?layerId=${item.sourceLayerId}`)
              : "");

          handleToggleLayer(item, true);
          void flyToIgtLayer(
            map,
            matchedLayer ??
              ({
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
              } as unknown as IgtLayerItem),
            {},
          );
        },
      },
    ];

    return { headers, items, itemActions };
  }, [
    order.items,
    enabledLayerIds,
    handleToggleLayer,
    map,
    onDetailAttribute,
    fetchedLayersList,
  ]);

  return (
    <VStack flex={1} w={"full"}>
      <DataView.Table.Root<CartOrderItem>
        headers={dataList.headers}
        items={dataList.items}
        itemActions={dataList.itemActions}
        withNumbering
        pb={0}
        rounded={0}
      >
        <DataView.Table.Header />
        <DataView.Table.Body />
      </DataView.Table.Root>
    </VStack>
  );
};
