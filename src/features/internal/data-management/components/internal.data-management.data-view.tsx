import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalDataManagementCreateTrigger } from "@/features/internal/data-management/components/internal.data-management.create-modal";
import { InternalDataManagementEditTrigger } from "@/features/internal/data-management/components/internal.data-management.edit-modal";
import { PUBLISH_STATUS_OPTIONS } from "@/features/internal/data-management/constants/data-management.config";
import {
  useDeleteMasterIgtLayer,
  useMasterIgtLayersQuery,
} from "@/features/internal/data-management/hooks/use-data-management";
import type {
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { DEFAULT_ACTIVE_IGT_LAYER_ID } from "@/features/mitra/data-request/constants/igt.config";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { SpatialBasisFilterSelect } from "@/features/shared/components/spatial-basis-filter.select";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { IconLayersOff } from "@tabler/icons-react";
import {
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const InternalDataManagementDataView = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<{
    page: number;
    pageSize: number;
    search: string;
    spatialBasis: string;
    publishStatus: string;
  }>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    spatialBasis: "all",
    publishStatus: "all",
  });

  // Mutations
  const deleteMutation = useDeleteMasterIgtLayer();

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useMasterIgtLayersQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    spatialBasis:
      params.spatialBasis !== "all"
        ? (params.spatialBasis as SpatialBasisType)
        : undefined,
    isActive:
      params.publishStatus === "published"
        ? true
        : params.publishStatus === "draft"
          ? false
          : undefined,
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const isSearching = Boolean(
    params.search.trim() ||
    params.spatialBasis !== "all" ||
    params.publishStatus !== "all",
  );
  const searchQuery = useMemo(() => {
    if (params.search.trim()) return params.search;
    if (params.spatialBasis !== "all" && params.publishStatus !== "all") {
      return `${params.spatialBasis}, ${params.publishStatus}`;
    }
    if (params.spatialBasis !== "all") return params.spatialBasis;
    if (params.publishStatus !== "all") return params.publishStatus;
    return "...";
  }, [params.search, params.spatialBasis, params.publishStatus]);

  // Map Layer Store for toggling visibility
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
  const toggleLayerId = useMapLayerStore((s) => s.toggleLayerId);
  const setLayerEnabled = useMapLayerStore((s) => s.setLayerEnabled);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Layer IGT", sortable: true },
      { th: "Status", sortable: true, align: "center" },
      { th: "Workspace / Typename", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Urutan (Z-Index)", sortable: true, align: "center" },
      { th: "Terakhir Diperbarui", sortable: true },
      { th: "Lihat di Peta", align: "center" },
    ];

    const items = rawItems.map((item) => {
      const isVisibleOnMap =
        enabledLayerIds[item.id] ?? item.id === DEFAULT_ACTIVE_IGT_LAYER_ID;

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.title,
            td: <ClampedP w={"200px"}>{item.title}</ClampedP>,
            align: "start" as const,
          },
          {
            value: item.isActive ? "Publik" : "Draft",
            td: (
              <Badge colorPalette={item.isActive ? "green" : "gray"}>
                {item.isActive ? "Publik" : "Draft"}
              </Badge>
            ),
            align: "center" as const,
          },
          {
            value: item.typeName || item.id,
            td: (
              <P fontSize={"xs"} color={"fg.subtle"} whiteSpace={"nowrap"}>
                {item.typeName || item.id}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.spatialBasis,
            td: <BasisIgtBadge>{item.spatialBasis}</BasisIgtBadge>,
            align: "start" as const,
          },
          {
            value: item.zIndex ?? 0,
            td: <P>{item.zIndex != null ? `${item.zIndex}` : "-"}</P>,
            align: "center" as const,
          },
          {
            value: item.updatedAt,
            td: (
              <P fontSize={"sm"} color={"fg.muted"} whiteSpace={"nowrap"}>
                {formatUtcDateTime(item.updatedAt, preferredTimezone)}
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
                  onCheckedChange={() => {
                    toggleLayerId(item.id);
                  }}
                  aria-label={`Toggle visibilitas peta untuk ${item.title}`}
                  size={"sm"}
                />
              </Center>
            ),
            align: "center" as const,
          },
        ],
      };
    });

    const batchActions = [
      ({
        selectedItemIds,
        clearSelectedItems,
      }: {
        selectedItemIds: string[];
        clearSelectedItems: () => void;
      }) => (
        <HStack key={"map-visibility-batch-actions"} gap={"xs"}>
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              selectedItemIds.forEach((id) => setLayerEnabled(id, true));
              clearSelectedItems();
            }}
          >
            <AppIcon icon={EyeIcon} />
            {"Tampilkan di Peta"}
          </Button>

          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => {
              selectedItemIds.forEach((id) => setLayerEnabled(id, false));
              clearSelectedItems();
            }}
          >
            <AppIcon icon={EyeOffIcon} />
            {"Sembunyikan dari Peta"}
          </Button>
        </HStack>
      ),
    ];

    const itemActions: DataViewItemActionsGenerator<MasterIgtLayerItem>[] = [
      {
        key: "toggle-map-visibility",
        label: (layer: MasterIgtLayerItem) => {
          const isVisible =
            enabledLayerIds[layer.id] ??
            layer.id === DEFAULT_ACTIVE_IGT_LAYER_ID;
          return isVisible ? "Sembunyikan dari Peta" : "Tampilkan di Peta";
        },
        icon: (layer: MasterIgtLayerItem) => {
          const isVisible =
            enabledLayerIds[layer.id] ??
            layer.id === DEFAULT_ACTIVE_IGT_LAYER_ID;
          return isVisible ? EyeOffIcon : EyeIcon;
        },
        onClick: (layer: MasterIgtLayerItem) => {
          toggleLayerId(layer.id);
        },
      },
      {
        key: "edit-layer",
        label: "Ubah Layer",
        icon: PencilIcon,
        modal: {
          triggerComponent: (layer: MasterIgtLayerItem) => (
            <InternalDataManagementEditTrigger
              modalKey={`layer-edit-${layer.id}`}
              item={layer}
            />
          ),
        },
      },
      {
        key: "delete-layer",
        label: "Hapus Layer",
        icon: Trash2Icon,
        colorPalette: "red",
        modal: {
          triggerComponent: (layer: MasterIgtLayerItem) => (
            <ConfirmationTrigger
              modalKey={`delete-layer-${layer.id}`}
              title={"Hapus Layer IGT?"}
              description={`Apakah Anda yakin ingin menghapus layer "${layer.title}"? Layer akan diarsipkan terlebih dahulu agar permohonan data yang sedang diproses tidak terganggu, lalu dihapus permanen secara otomatis setelah 30 hari.`}
              confirmLabel={"Hapus Layer"}
              colorPalette={"red"}
              onConfirm={() => {
                deleteMutation.mutate(layer.id);
              }}
            />
          ),
        },
      },
    ];

    return {
      headers,
      items,
      batchActions,
      itemActions,
    };
  }, [
    rawItems,
    preferredTimezone,
    enabledLayerIds,
    toggleLayerId,
    setLayerEnabled,
    deleteMutation,
  ]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer pr={"xs"}>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={"xs"} align={"center"}>
              <Heading>{"Manajemen Data IGT"}</Heading>

              <InfoTip
                variant={"icon"}
                appIconProps={{
                  size: "xs",
                  color: "fg.subtle",
                }}
              >
                {
                  "Katalog master data spasial geospasial ATR/BPN. Layer berstatus 'Publik' otomatis dapat diakses dan dipesan oleh Mitra."
                }
              </InfoTip>
            </HStack>

            <InternalDataManagementCreateTrigger>
              <Button primary variant={"ghost"}>
                <AppIcon icon={PlusIcon} />
                {"Tambah Layer"}
              </Button>
            </InternalDataManagementCreateTrigger>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"start"}
          gap={"sm"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <SearchInput
            value={params.search}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({ ...prev, search: val, page: 1 }));
              })
            }
            placeholder={"Cari nama layer, ID, endpoint..."}
            maxW={"280px"}
          />

          <SpatialBasisFilterSelect
            modalKey={"data-management-spatial-basis-filter"}
            value={params.spatialBasis}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({ ...prev, spatialBasis: val, page: 1 }));
              })
            }
            w={"150px"}
          />

          <StatusFilterSelect
            modalKey={"data-management-publish-status-filter"}
            options={PUBLISH_STATUS_OPTIONS}
            placeholder={"Semua Status"}
            value={params.publishStatus}
            onValueChange={(val) =>
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  publishStatus: val,
                  page: 1,
                }));
              })
            }
            w={"150px"}
          />
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        <VStack flex={1} gap={"sm"} w={"full"} position={"relative"}>
          {isLoading && <Skeleton p={"md"} rounded={0} />}

          {!isLoading && (
            <>
              {isEmptyArray(rawItems) && (
                <Center flex={1} w={"full"} p={"xl"} bg={"bg.body"}>
                  {isSearching ? (
                    <NoResultState query={searchQuery} />
                  ) : (
                    <NoDataState
                      icon={IconLayersOff}
                      title={"Layer IGT Kosong"}
                      description={
                        "Belum ada layer IGT terdaftar. Silakan tambahkan layer baru."
                      }
                    />
                  )}
                </Center>
              )}

              {!isEmptyArray(rawItems) && (
                <Box w={"full"} position={"relative"}>
                  <TopBarLoader isFetching={isFetching} />

                  <DataView.Table.Root<MasterIgtLayerItem>
                    headers={dataList.headers}
                    items={dataList.items}
                    batchActions={dataList.batchActions}
                    itemActions={dataList.itemActions}
                    canBatchSelect
                    withNumbering
                    page={params.page}
                    pageSize={params.pageSize}
                    pb={0}
                    rounded={0}
                  >
                    <DataView.Table.Header />
                    <DataView.Table.Body />
                  </DataView.Table.Root>

                  <Separator borderColor={"bg.canvas"} />

                  <DataViewFooter
                    page={params.page}
                    pageSize={params.pageSize}
                    setPage={(nextPage: number) =>
                      setParams((prev) => ({ ...prev, page: nextPage }))
                    }
                    setPageSize={(nextSize: number) => {
                      setParams((prev) => ({
                        ...prev,
                        pageSize: nextSize,
                        page: 1,
                      }));
                    }}
                    currentDataLength={rawItems.length}
                    totalData={pagination?.totalItems ?? rawItems.length}
                    totalPage={pagination?.totalPages ?? 1}
                  />
                </Box>
              )}
            </>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
