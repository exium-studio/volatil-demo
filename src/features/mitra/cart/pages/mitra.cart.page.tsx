// src/features/mitra/cart/pages/mitra.cart.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { MitraCartOrderItem } from "@/features/mitra/cart/components/mitra.cart.order-item";
import { MitraCartOrderSummary } from "@/features/mitra/cart/components/mitra.cart.order-summary";
import {
  flyToCartGeometry,
  removeCartMapLayers,
  useCartAoiCoverageMap,
} from "@/features/mitra/cart/hooks/use-cart-aoi-coverage-map";
import {
  useCancelActiveCartOrder,
  useCartOrderDetailQuery,
  useCartOrdersQuery,
  useCartOrdersStream,
  useClearAllCartOrders,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import type {
  MitraCartOrderDetailProps,
  MitraCartOrderListProps,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useBidangAoiFeatures } from "@/features/mitra/data-request/hooks/use-bidang-aoi-features";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const MitraCartPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <MitraCartContent />
    </Container.Root>
  );
};

const MitraCartContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Search Params
  const { queryValue: orderIdParam, setQueryValue: setOrderIdParam } =
    useSearchParam("orderId");

  // Stores
  const map = useMapInstanceStore((state) => state.map);

  // SSE Stream: Listen to real-time cart order calculations and status updates
  useCartOrdersStream();

  // Queries (for derived index between orders and selected order)
  const { orders } = useCartOrdersQuery();

  // States
  const [isAoiVisible, setIsAoiVisible] = useState<boolean>(true);
  const [isCoverageVisible, setIsCoverageVisible] = useState<boolean>(true);
  const [isBidangVisible, setIsBidangVisible] = useState<boolean>(true);

  // Derived Values — Validate selectedOrderId against current orders list
  const effectiveSelectedOrderId =
    orderIdParam && orders.some((o) => o.orderId === orderIdParam)
      ? orderIdParam
      : null;

  // Queries — detail of selected order
  const {
    orderDetail: selectedOrder,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useCartOrderDetailQuery(effectiveSelectedOrderId || undefined);

  // Queries — master IGT layers for fallback WFS resolution
  const { data: masterLayersData } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
  });

  // Derived Values
  const isOrderSelected = Boolean(effectiveSelectedOrderId && selectedOrder);

  const selectedOrderItems = selectedOrder?.items;
  const bidangTargetLayers = useMemo(() => {
    if (!selectedOrderItems) return [];

    const masterItems = masterLayersData?.items ?? [];
    const masterMap = new Map<string, (typeof masterItems)[0]>();
    for (const l of masterItems) {
      if (l.id) masterMap.set(l.id.toLowerCase(), l);
      if (l.typeName) masterMap.set(l.typeName.toLowerCase(), l);
      if (l.wfs?.wfsTypeName) masterMap.set(l.wfs.wfsTypeName.toLowerCase(), l);
      if (l.title) masterMap.set(l.title.toLowerCase(), l);
      if (l.layerName) masterMap.set(l.layerName.toLowerCase(), l);
    }

    return selectedOrderItems
      .filter((it) => (it.spatialBasis ?? it.igtBasis) === "bidang")
      .map((it) => {
        const keyId = (it.sourceLayerId || it.id || "").toLowerCase();
        const keyTitle = (it.sourceLayerTitle || "").toLowerCase();
        const matchedMaster =
          masterMap.get(keyId) ||
          masterMap.get(keyTitle) ||
          masterItems.find(
            (l) =>
              (l.igtBasis ?? l.spatialBasis) === "bidang" &&
              (l.id?.toLowerCase().includes(keyId) ||
                l.title?.toLowerCase().includes(keyTitle) ||
                keyTitle.includes(l.title?.toLowerCase() || "")),
          );

        const typeName =
          matchedMaster?.typeName ||
          matchedMaster?.wfs?.wfsTypeName ||
          it.sourceLayerId ||
          it.id;

        const wfsUrl =
          matchedMaster?.wfs?.url ||
          matchedMaster?.wfs?.wfsUrl ||
          matchedMaster?.wfs?.baseUrl ||
          it.wfsUrl ||
          it.previewWfsUrl ||
          "";

        return {
          id: it.id || it.sourceLayerId,
          typeName,
          wfsUrl,
          title: it.sourceLayerTitle || matchedMaster?.title,
        };
      })
      .filter((it) => Boolean(it.typeName));
  }, [selectedOrderItems, masterLayersData?.items]);

  const bidangQueryResult = useBidangAoiFeatures({
    aoiPolygon: isOrderSelected ? selectedOrder?.aoiPolygon : null,
    bidangLayers: bidangTargetLayers,
    enabled:
      isOrderSelected &&
      isBidangVisible &&
      Boolean(selectedOrder?.aoiPolygon) &&
      bidangTargetLayers.length > 0,
  });

  // Map layer synchronization hook for Cart AOI & Coverage Polygon
  useCartAoiCoverageMap(map, {
    aoiPolygon: isOrderSelected ? selectedOrder?.aoiPolygon : null,
    coveragePolygon: isOrderSelected ? selectedOrder?.coveragePolygon : null,
    bidangFeatures: isOrderSelected ? bidangQueryResult.features : null,
    selectionType: selectedOrder?.selectionType,
    isAoiVisible,
    isCoverageVisible,
    isBidangVisible,
    isActive: isOrderSelected,
    exclusive: true,
  });

  // Effects — Clean up all cart map layers when entering or leaving Cart page
  useEffect(() => {
    if (!map) return;
    return () => {
      removeCartMapLayers(map);
    };
  }, [map]);

  // Effects — Auto zoom on order selection change
  useEffect(() => {
    if (isOrderSelected && selectedOrder) {
      const targetGeom =
        selectedOrder.aoiPolygon ?? selectedOrder.coveragePolygon;
      if (targetGeom && map) {
        flyToCartGeometry(map, targetGeom);
      }
    }
  }, [isOrderSelected, selectedOrder, map]);

  // Handlers
  const handleSelectOrder = useCallback(
    (orderId: string | null) => {
      setOrderIdParam(orderId ?? undefined, { replace: true });
      setIsAoiVisible(true);
      setIsCoverageVisible(true);
      setIsBidangVisible(true);
    },
    [setOrderIdParam],
  );

  const handleToggleAoi = useCallback(() => {
    setIsAoiVisible((prev) => !prev);
  }, []);

  const handleToggleCoverage = useCallback(() => {
    setIsCoverageVisible((prev) => !prev);
  }, []);

  const handleToggleBidang = useCallback(() => {
    setIsBidangVisible((prev) => !prev);
  }, []);

  const handleFlyToAoi = useCallback(() => {
    if (selectedOrder?.aoiPolygon && map) {
      flyToCartGeometry(map, selectedOrder.aoiPolygon);
    }
  }, [selectedOrder, map]);

  const handleFlyToCoverage = useCallback(() => {
    if (selectedOrder?.coveragePolygon && map) {
      flyToCartGeometry(map, selectedOrder.coveragePolygon);
    }
  }, [selectedOrder, map]);

  // Derived Values
  const selectedOrderIndex = orders.findIndex(
    (b) => b.orderId === effectiveSelectedOrderId,
  );

  const isOrderLoadingOrSwitching =
    Boolean(effectiveSelectedOrderId) &&
    (isDetailLoading ||
      (isDetailFetching &&
        selectedOrder?.orderId !== effectiveSelectedOrderId));

  return (
    <AppContentContainer
      overflowY={isSmContainer ? "auto" : undefined}
      position={"relative"}
    >
      <HStack
        flex={1}
        flexDir={isSmContainer ? "column" : "row"}
        align={"start"}
        gap={"sm"}
        minH={isSmContainer ? undefined : 0}
        w={"full"}
      >
        <MitraCartOrderList
          selectedOrderId={effectiveSelectedOrderId}
          onSelectOrder={handleSelectOrder}
          isAoiVisible={isAoiVisible}
          isCoverageVisible={isCoverageVisible}
          isBidangVisible={isBidangVisible}
          onToggleAoiVisible={handleToggleAoi}
          onToggleCoverageVisible={handleToggleCoverage}
          onToggleBidangVisible={handleToggleBidang}
          onFlyToAoi={handleFlyToAoi}
          onFlyToCoverage={handleFlyToCoverage}
        />

        <MitraCartOrderDetail
          selectedOrderId={effectiveSelectedOrderId}
          selectedOrderIndex={selectedOrderIndex}
          selectedOrder={selectedOrder}
          isLoading={isOrderLoadingOrSwitching}
          isFetching={isDetailFetching}
          isError={isDetailError}
          error={detailError}
          onRetry={() => {
            void refetchDetail();
          }}
        />
      </HStack>
    </AppContentContainer>
  );
};

export const MitraCartOrderList = (props: MitraCartOrderListProps) => {
  // Props
  const {
    selectedOrderId,
    onSelectOrder,
    isAoiVisible,
    isCoverageVisible,
    isBidangVisible,
    onToggleAoiVisible,
    onToggleCoverageVisible,
    onToggleBidangVisible,
    onFlyToAoi,
    onFlyToCoverage,
  } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries & Mutations
  const {
    orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    error: ordersError,
    refetch: refetchOrders,
  } = useCartOrdersQuery();
  const clearAllOrdersMutation = useClearAllCartOrders();
  const deleteOrderMutation = useCancelActiveCartOrder();

  // Handlers
  const handleDeleteOrder = (orderId: string) => {
    deleteOrderMutation.mutate(orderId, {
      onSuccess: () => {
        if (selectedOrderId === orderId) {
          onSelectOrder(null);
        }
      },
    });
  };

  // Derived Values
  const hasOrders = orders.length > 0;

  return (
    <Container.Body
      flex={isSmContainer ? 1 : 3}
      minH={isSmContainer ? undefined : 0}
      overflowY={isSmContainer ? undefined : "auto"}
      w={"full"}
      h={"full"}
    >
      <HeaderContainer pr={"xs"}>
        <Heading>{"Keranjang Pesanan"}</Heading>

        {hasOrders && !isOrdersError && (
          <ConfirmationTrigger
            modalKey={"clear-cart-confirmation"}
            title={"Kosongkan Keranjang"}
            description={
              "Semua daftar pesanan layer spasial di keranjang akan dihapus."
            }
            confirmLabel={"Kosongkan keranjang"}
            colorPalette={"red"}
            onConfirm={() => {
              const allOrderIds = orders.map((b) => b.orderId);
              clearAllOrdersMutation.mutate(allOrderIds, {
                onSuccess: () => {
                  onSelectOrder(null);
                },
              });
            }}
          >
            <Button
              colorPalette={"red"}
              size={"xs"}
              loading={clearAllOrdersMutation.isPending}
            >
              <AppIcon icon={Trash2Icon} />
              {"Kosongkan keranjang"}
            </Button>
          </ConfirmationTrigger>
        )}
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <VStack
        flex={1}
        overflowY={isSmContainer ? undefined : "auto"}
        w={"full"}
        h={"full"}
        p={hasOrders && !isOrdersLoading && !isOrdersError ? "xs" : 0}
      >
        {isOrdersLoading && (
          <Skeleton
            flex={1}
            w={"full"}
            h={"full"}
            minH={"368px"}
            p={"md"}
            rounded={0}
          />
        )}

        {!isOrdersLoading && isOrdersError && (
          <Center flex={1} w={"full"} h={"full"} py={"xl"}>
            <StateRetry
              title={"Gagal Memuat Keranjang Pesanan"}
              description={
                ordersError?.message ||
                "Terjadi kesalahan saat memuat daftar pesanan di keranjang Anda. Silakan coba lagi."
              }
              onRetry={() => {
                void refetchOrders();
              }}
            />
          </Center>
        )}

        {!isOrdersLoading && !isOrdersError && (
          <>
            {!hasOrders && (
              <Center flex={1} w={"full"} h={"full"} py={"xl"}>
                <StateNoData
                  icon={ShoppingCartIcon}
                  title={"Keranjang Kosong"}
                  description={
                    "Silakan pilih layer IGT dan masukkan ke keranjang di menu Permintaan Data."
                  }
                  minH={"304px"}
                />
              </Center>
            )}

            {hasOrders && (
              <VStack gap={"xs"} align={"stretch"} w={"full"}>
                {!selectedOrderId && (
                  <Alert.Root status={"info"} mb={1}>
                    <AppIcon icon={InfoIcon} />

                    <Alert.Description>
                      {
                        "Silakan pilih salah satu pesanan untuk melihat rincian layer atau melanjutkan ke pembayaran."
                      }
                    </Alert.Description>
                  </Alert.Root>
                )}

                {orders.map((order, index) => {
                  const orderNumber = orders.length - index;

                  return (
                    <MitraCartOrderItem
                      key={order.orderId}
                      order={order}
                      index={orderNumber - 1}
                      isSelected={order.orderId === selectedOrderId}
                      onSelect={onSelectOrder}
                      onDelete={handleDeleteOrder}
                      isDeleting={
                        deleteOrderMutation.isPending &&
                        deleteOrderMutation.variables === order.orderId
                      }
                      isAoiVisible={isAoiVisible}
                      isCoverageVisible={isCoverageVisible}
                      isBidangVisible={isBidangVisible}
                      onToggleAoiVisible={onToggleAoiVisible}
                      onToggleCoverageVisible={onToggleCoverageVisible}
                      onToggleBidangVisible={onToggleBidangVisible}
                      onFlyToAoi={onFlyToAoi}
                      onFlyToCoverage={onFlyToCoverage}
                    />
                  );
                })}
              </VStack>
            )}
          </>
        )}
      </VStack>
    </Container.Body>
  );
};

export const MitraCartOrderDetail = (props: MitraCartOrderDetailProps) => {
  // Props
  const {
    selectedOrderId: _selectedOrderId,
    selectedOrderIndex,
    selectedOrder,
    isLoading = false,
    isFetching = false,
    isError = false,
    error,
    onRetry,
  } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries (for total orders count to reverse order number)
  const { orders } = useCartOrdersQuery();

  // Derived Values — reverse order number (index 0 is latest, so it gets the highest order number)
  const displayOrderNumber =
    selectedOrderIndex !== -1 && selectedOrderIndex != null
      ? orders.length - selectedOrderIndex
      : null;

  return (
    <Container.Body
      flex={isSmContainer ? undefined : 2}
      alignSelf={isSmContainer ? undefined : "start"}
      minW={isSmContainer ? "full" : "320px"}
      maxH={isSmContainer ? undefined : "full"}
      minH={isSmContainer ? undefined : 0}
      overflowY={isSmContainer ? undefined : "auto"}
      w={"full"}
    >
      <HeaderContainer>
        <HStack align={"center"} justify={"space-between"} w={"full"}>
          <HStack align={"center"} gap={"sm"}>
            <Heading>{"Rincian Pesanan"}</Heading>

            {displayOrderNumber !== null && (
              <Badge>{`Pesanan #${displayOrderNumber}`}</Badge>
            )}
          </HStack>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <MitraCartOrderSummary
        activeOrder={selectedOrder ?? null}
        orderIndex={displayOrderNumber}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        onRetry={onRetry}
      />
    </Container.Body>
  );
};
