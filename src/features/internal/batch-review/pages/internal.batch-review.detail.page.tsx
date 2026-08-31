// src/features/internal/batch-review/pages/internal.batch-review.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalBatchReviewRejectTrigger } from "@/features/internal/batch-review/components/internal.batch-review.reject-modal";
import {
  useApproveBatch,
  useInternalBatchDetailQuery,
} from "@/features/internal/batch-review/hooks/use-batch-review";
import type { BatchLayerDataViewProps } from "@/features/internal/batch-review/types/batch-review.type";
import type { CartBatchItem } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { BatchStatusBadge } from "@/features/shared/components/batch-status.badge";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  MapPinIcon,
  TablePropertiesIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

export const InternalBatchReviewDetailPage = () => {
  // Hooks
  const { batchId } = useParams({ strict: false }) as { batchId: string };
  const navigate = useNavigate();

  // Queries
  const { data: batch, isLoading } = useInternalBatchDetailQuery(batchId);

  // Mutations
  const approveMutation = useApproveBatch();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <Skeleton h={"200px"} w={"full"} />
        <Skeleton h={"400px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  if (!batch) {
    return (
      <PanelContentContainer h={"auto"}>
        <Center flex={1} p={"xl"}>
          <P color={"fg.muted"}>{"Batch tidak ditemukan."}</P>
        </Center>
      </PanelContentContainer>
    );
  }

  return (
    <PanelContentContainer flex={1} position={"relative"}>
      <Container.Root withContext flex={1}>
        <Container.Body overflowY={"auto"}>
          {/* Header */}
          <HeaderContainer px={"xs"}>
            <HStack
              justify={"space-between"}
              align={"center"}
              w={"full"}
              wrap={"wrap"}
              gap={"sm"}
            >
              <HStack gap={"sm"} align={"center"}>
                <BackButton
                  onClick={() => navigate({ to: "/internal/batch-review" })}
                />

                <Heading>{"Detail Batch Interop"}</Heading>
              </HStack>

              {batch.status === "pending_review" && (
                <HStack gap={"xs"}>
                  <InternalBatchReviewRejectTrigger
                    batch={batch}
                    modalKey={`reject-detail-${batch.batchId}`}
                  >
                    <Box>
                      <IconButton
                        colorPalette={"red"}
                        aria-label={"Tolak Batch"}
                      >
                        <AppIcon icon={XCircleIcon} />
                      </IconButton>
                    </Box>
                  </InternalBatchReviewRejectTrigger>

                  <ConfirmationTrigger
                    modalKey={`approve-detail-${batch.batchId}`}
                    title={"Setujui Permohonan Batch?"}
                    description={`Apakah Anda yakin ingin menyetujui batch "${batch.batchId}" milik ${batch.mitraName}?`}
                    confirmLabel={"Setujui Batch"}
                    colorPalette={"green"}
                    onConfirm={() => {
                      approveMutation.mutate(
                        { batchId: batch.batchId },
                        {
                          onSuccess: () => {
                            void navigate({ to: "/internal/batch-review" });
                          },
                        },
                      );
                    }}
                  >
                    <Box>
                      <IconButton
                        colorPalette={"green"}
                        aria-label={"Setujui Batch"}
                      >
                        <AppIcon icon={CheckCircle2Icon} />
                      </IconButton>
                    </Box>
                  </ConfirmationTrigger>
                </HStack>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Batch Metadata */}
          <VStack gap={"md"} p={"md"}>
            <VStack align={"start"} gap={"xs"}>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {"Pemohon / Mitra"}
              </P>

              <VStack gap={"2xs"}>
                <P fontWeight={"semibold"}>{batch.mitraName}</P>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {batch.mitraId}
                </P>
              </VStack>
            </VStack>

            <HStack gap={"lg"} wrap={"wrap"}>
              <VStack gap={"xs"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Status"}
                </P>

                <BatchStatusBadge>{batch.status}</BatchStatusBadge>
              </VStack>

              <VStack gap={"xs"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Total Estimasi PNBP"}
                </P>

                <P fontWeight={"semibold"}>
                  {formatCurrency(batch.totalPrice ?? 0)}
                </P>
              </VStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          {/* Layer List */}
          <BatchLayerDataView
            batch={batch}
            onDetailAttribute={(item) => {
              void navigate({
                to: "/internal/batch-review/$batchId/layer/$layerId",
                params: {
                  batchId: batch.batchId,
                  layerId: encodeURIComponent(item.sourceLayerId),
                },
              });
            }}
          />
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};

const BatchLayerDataView = (props: BatchLayerDataViewProps) => {
  const { batch, onDetailAttribute } = props;

  // Stores
  const { enabledLayerIds, setLayerEnabled } = useMapLayerStore();
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

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Jumlah / Luas", sortable: true, align: "center" },
      { th: "Estimasi Biaya", sortable: true, align: "end" },
      { th: "Lihat di Peta", align: "center" },
    ];

    const items: FormattedListItem<CartBatchItem>[] = (batch.items ?? []).map(
      (item) => ({
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
                  setLayerEnabled(item.sourceLayerId, checked);
                }}
              />
            ),
            align: "center" as const,
          },
        ],
      }),
    );

    const itemActions = [
      {
        key: "toggle-map-visibility",
        label: (item: CartBatchItem) => {
          const isVisible = enabledLayerIds[item.sourceLayerId] ?? false;
          return isVisible ? "Sembunyikan dari Peta" : "Tampilkan di Peta";
        },
        icon: (item: CartBatchItem) => {
          const isVisible = enabledLayerIds[item.sourceLayerId] ?? false;
          return isVisible ? EyeOffIcon : EyeIcon;
        },
        onClick: (item: CartBatchItem) => {
          const current = enabledLayerIds[item.sourceLayerId] ?? false;
          setLayerEnabled(item.sourceLayerId, !current);
        },
      },
      {
        key: "detail-attribute",
        label: "Detail Atribut",
        icon: TablePropertiesIcon,
        onClick: (item: CartBatchItem) => {
          onDetailAttribute(item);
        },
      },
      {
        key: "fly-to-map",
        label: "Lihat di Peta",
        icon: MapPinIcon,
        onClick: (item: CartBatchItem) => {
          if (!map) return;
          const matchedLayer = fetchedLayersList.find(
            (l) => l.id === item.sourceLayerId,
          );
          setLayerEnabled(item.sourceLayerId, true);
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
                  wmsUrl: item.wmsUrl ?? "",
                },
                wfs: {
                  wfsTypeName: item.sourceLayerId,
                  wfsUrl: item.wfsUrl ?? "",
                },
              } as IgtLayerItem),
            {},
          );
        },
      },
    ];

    return { headers, items, itemActions };
  }, [
    batch.items,
    enabledLayerIds,
    setLayerEnabled,
    map,
    onDetailAttribute,
    fetchedLayersList,
  ]);

  return (
    <VStack flex={1} w={"full"}>
      <DataView.Table.Root<CartBatchItem>
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
