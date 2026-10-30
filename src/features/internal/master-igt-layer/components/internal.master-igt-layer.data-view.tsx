// src/features/internal/master-igt-layer/components/internal.master-igt-layer.data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type {
  DataViewBatchActionsGenerator,
  DataViewItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { NavLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedHeading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalMasterIgtLayerCreateTrigger } from "@/features/internal/master-igt-layer/components/internal.master-igt-layer.create-modal";
import {
  PUBLISH_STATUS_CONFIG_MAP,
  PUBLISH_STATUS_OPTIONS,
} from "@/features/internal/master-igt-layer/constants/master-igt-layer.config";
import {
  useDeleteMasterIgtLayer,
  useMasterIgtLayersQuery,
} from "@/features/internal/master-igt-layer/hooks/use-master-igt-layer";
import type {
  IgtBasisType,
  MasterIgtLayerItem,
  PublishStatusType,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { useTriggerMitraLayerSyncMutation } from "@/features/internal/mitra-layer-sync-jobs/hooks/use-mitra-layer-sync-jobs.query";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IgtBasisFilterSelect } from "@/features/shared/components/igt-basis-filter.select";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { normalizeApiUrl } from "@/shared/utils/url/url.utils";
import { IconLayersOff } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";

export const InternalMasterIgtLayerDataView = () => {
  // Navigation
  const navigate = useNavigate();

  // Route Search Params
  const searchParams = useSearch({
    from: "/_private/internal/master-igt-layer/",
  });

  // Transitions
  const [_isPending, startTransition] = useTransition();

  // Derived Initial Values from search params
  const initialPublishStatus = useMemo(() => {
    if (searchParams.isActive === undefined || searchParams.isActive === null) {
      return "all";
    }
    const val = String(searchParams.isActive).toLowerCase();
    if (val === "1" || val === "true" || val === "published") {
      return "published";
    }
    if (val === "0" || val === "false" || val === "draft") {
      return "draft";
    }
    return "all";
  }, [searchParams.isActive]);

  const initialIgtBasis = useMemo(() => {
    if (
      searchParams.basisIgt === "bidang" ||
      searchParams.basisIgt === "kawasan"
    ) {
      return searchParams.basisIgt;
    }
    return "all";
  }, [searchParams.basisIgt]);

  // States — Centralized query/action parameters
  const [params, setParams] = useState<{
    page: number;
    pageSize: number;
    search: string;
    igtBasis: string;
    publishStatus: string;
  }>(() => ({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
    igtBasis: initialIgtBasis,
    publishStatus: initialPublishStatus,
  }));

  // Mutations
  const deleteMutation = useDeleteMasterIgtLayer();
  const syncMitraMutation = useTriggerMitraLayerSyncMutation();

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useMasterIgtLayersQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search || undefined,
    igtBasis:
      params.igtBasis !== "all" ? (params.igtBasis as IgtBasisType) : undefined,
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
    params.igtBasis !== "all" ||
    params.publishStatus !== "all",
  );
  const searchQuery = useMemo(() => {
    const parts: string[] = [];

    if (params.search.trim()) {
      parts.push(params.search.trim());
    }

    if (params.igtBasis && params.igtBasis !== "all") {
      const basisLabel =
        IGT_BASIS_MAP[params.igtBasis as IgtBasisType]?.label ??
        params.igtBasis;
      parts.push(basisLabel);
    }

    if (params.publishStatus && params.publishStatus !== "all") {
      const statusLabel =
        PUBLISH_STATUS_CONFIG_MAP[params.publishStatus as PublishStatusType]
          ?.label ?? params.publishStatus;
      parts.push(statusLabel);
    }

    return parts.length > 0 ? parts.join(", ") : "...";
  }, [params.search, params.igtBasis, params.publishStatus]);

  // Map Layer Store for toggling visibility
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
  const setLayerEnabled = useMapLayerStore((s) => s.setLayerEnabled);
  const setCustomLayerConfig = useMapLayerStore((s) => s.setCustomLayerConfig);
  const { flyTo } = useFlyToLayer();

  // Handlers
  const handleToggleLayer = useCallback(
    (item: MasterIgtLayerItem, checked: boolean) => {
      if (!checked) {
        setLayerEnabled(item.id, false);
        setCustomLayerConfig(item.id, null);
      } else {
        const rawWmsUrl = item.wms.url || item.wms.baseUrl;
        const rawWfsUrl = item.wfs.url || item.wfs.baseUrl;
        const normalizedWmsUrl = normalizeApiUrl(rawWmsUrl);
        const normalizedWfsUrl = normalizeApiUrl(rawWfsUrl);

        setCustomLayerConfig(item.id, {
          wmsUrl: normalizedWmsUrl || "",
          layers: item.typeName || "",
          spatialBasis: item.igtBasis,
          minZoom: item.minZoom ?? 12,
        });
        setLayerEnabled(item.id, true);

        if (item.bbox || normalizedWfsUrl) {
          void flyTo({
            id: item.id,
            title: item.title,
            spatialBasis: item.igtBasis,
            bbox: item.bbox,
            wfs: normalizedWfsUrl
              ? {
                  wfsTypeName: item.typeName || "",
                  wfsUrl: normalizedWfsUrl,
                }
              : undefined,
          });
        }
      }
    },
    [flyTo, setCustomLayerConfig, setLayerEnabled],
  );

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Layer IGT", sortable: true },
      { th: "Status", sortable: true, align: "center" },
      { th: "Typename", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Urutan (Z-Index)", sortable: true, align: "center" },
      { th: "Min Zoom", sortable: true, align: "center" },
      { th: "Default Tampil", sortable: true },
      { th: "Terakhir Diperbarui", sortable: true },
      { th: "Tampilkan di Peta", align: "center" },
    ];

    const items = rawItems.map((item) => {
      const isVisibleOnMap = Boolean(enabledLayerIds[item.id]);
      const basis = item.igtBasis;

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.title,
            td: (
              <NavLink
                to={"/internal/master-igt-layer/$layerId"}
                params={{ layerId: item.id }}
              >
                <ClampedP
                  fontWeight={"medium"}
                  color={"colorPalette.fg"}
                  _hover={{ color: "blue.fg" }}
                >
                  {item.title}
                </ClampedP>
              </NavLink>
            ),
            align: "start" as const,
            cellProps: {
              w: "200px",
            },
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
            value: basis,
            td: <IgtBasisBadge>{basis}</IgtBasisBadge>,
            align: "start" as const,
          },
          {
            value: item.zIndex ?? 0,
            td: <P>{item.zIndex != null ? `${item.zIndex}` : "-"}</P>,
            align: "center" as const,
          },
          {
            value: item.minZoom ?? 12,
            td: <P>{item.minZoom != null ? `${item.minZoom}` : "12"}</P>,
            align: "center" as const,
          },
          {
            value: item.defaultVisible ? "Ya" : "Tidak",
            td: (
              <Badge
                colorPalette={item.defaultVisible ? "blue" : "gray"}
                variant={"subtle"}
              >
                {item.defaultVisible ? "Otomatis" : "Manual"}
              </Badge>
            ),
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
                  onCheckedChange={({ checked }) => {
                    handleToggleLayer(item, checked);
                  }}
                  tooltip={
                    isVisibleOnMap
                      ? "Sembunyikan dari Peta"
                      : "Tampilkan di Peta"
                  }
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

    const batchActions: DataViewBatchActionsGenerator<MasterIgtLayerItem>[] = [
      {
        key: "show-on-map",
        label: "Tampilkan di Peta",
        icon: EyeIcon,
        onClick: ({ selectedItemIds, clearSelectedItems }) => {
          selectedItemIds.forEach((id) => {
            const target = rawItems.find((it) => it.id === id);
            if (target) {
              handleToggleLayer(target, true);
            } else {
              setLayerEnabled(id, true);
            }
          });
          clearSelectedItems();
        },
      },
      {
        key: "hide-from-map",
        label: "Sembunyikan dari Peta",
        icon: EyeOffIcon,
        onClick: ({ selectedItemIds, clearSelectedItems }) => {
          selectedItemIds.forEach((id) => {
            const target = rawItems.find((it) => it.id === id);
            if (target) {
              handleToggleLayer(target, false);
            } else {
              setLayerEnabled(id, false);
              setCustomLayerConfig(id, null);
            }
          });
          clearSelectedItems();
        },
      },
      {
        key: "sync-mitra-layer-batch",
        label: "Perbarui Layer Mitra",
        icon: RefreshCwIcon,
        loading: () => syncMitraMutation.isPending,
        modal: {
          triggerComponent: ({ selectedItemIds, clearSelectedItems }) => (
            <ConfirmationTrigger
              modalKey={"sync-mitra-layer-batch"}
              title={`Perbarui ${selectedItemIds.length} Layer Mitra Terpilih`}
              description={`Tindakan ini akan menjadwalkan tugas di latar belakang (antrean job) untuk memperbarui seluruh layer turunan milik mitra yang diperoleh dari ${selectedItemIds.length} layer IGT yang dipilih. Proses sinkronisasi geoserver berjalan secara asinkron tanpa memblokir pekerjaan Anda.`}
              confirmLabel={"Jadwalkan Pembaruan"}
              onConfirm={() => {
                syncMitraMutation.mutate({ layerIds: selectedItemIds });
                clearSelectedItems();
              }}
            />
          ),
        },
      },
    ];

    const itemActions: DataViewItemActionsGenerator<MasterIgtLayerItem>[] = [
      {
        key: "toggle-map-visibility",
        label: (layer: MasterIgtLayerItem) => {
          const isVisible = Boolean(enabledLayerIds[layer.id]);
          return isVisible ? "Sembunyikan dari Peta" : "Tampilkan di Peta";
        },
        icon: (layer: MasterIgtLayerItem) => {
          const isVisible = Boolean(enabledLayerIds[layer.id]);
          return isVisible ? EyeOffIcon : EyeIcon;
        },
        onClick: (layer: MasterIgtLayerItem) => {
          const willEnable = !enabledLayerIds[layer.id];
          handleToggleLayer(layer, willEnable);
        },
      },
      {
        key: "fly-to-map",
        label: "Zoom ke Layer",
        icon: FocusIcon,
        onClick: (item: MasterIgtLayerItem) => {
          const rawWfsUrl = item.wfs.url || item.wfs.baseUrl;
          void flyTo({
            id: item.id,
            title: item.title,
            spatialBasis: item.igtBasis,
            bbox: item.bbox,
            wfs: {
              wfsTypeName: item.typeName || "",
              wfsUrl: rawWfsUrl || "",
            },
          });
        },
      },
      {
        key: "edit-layer",
        label: "Konfigurasi Layer",
        icon: PencilIcon,
        onClick: (layer: MasterIgtLayerItem) => {
          void navigate({
            to: "/internal/master-igt-layer/$layerId",
            params: { layerId: layer.id },
          });
        },
      },
      {
        key: "sync-mitra-layer",
        label: "Perbarui Layer Mitra",
        icon: RefreshCwIcon,
        modal: {
          triggerComponent: (layer: MasterIgtLayerItem) => (
            <ConfirmationTrigger
              modalKey={`sync-mitra-layer-${layer.id}`}
              icon={RefreshCwIcon}
              title={"Perbarui Layer Mitra Terkait"}
              description={`Tindakan ini akan menjadwalkan tugas di latar belakang (antrean job) untuk memperbarui seluruh layer turunan milik mitra yang diperoleh dari layer "${layer.title}". Proses sinkronisasi geoserver berjalan secara asinkron tanpa memblokir pekerjaan Anda.`}
              confirmLabel={"Jadwalkan Pembaruan"}
              onConfirm={() => {
                syncMitraMutation.mutate({ layerIds: [layer.id] });
              }}
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
              title={"Hapus Layer IGT"}
              description={`Layer "${layer.title}" akan diarsipkan terlebih dahulu agar permintaan data yang sedang diproses tidak terganggu, lalu dihapus permanen secara otomatis setelah 30 hari.`}
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
    handleToggleLayer,
    setLayerEnabled,
    setCustomLayerConfig,
    deleteMutation,
    syncMitraMutation,
    flyTo,
    navigate,
  ]);

  return (
    <>
      <HeaderContainer pr={"xs"}>
        <HStack
          justify={"space-between"}
          align={"center"}
          gap={"md"}
          w={"full"}
        >
          <HStack gap={"xs"} align={"center"}>
            <ClampedHeading>{"Manajemen Master Layer IGT"}</ClampedHeading>

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

          <InternalMasterIgtLayerCreateTrigger>
            <Button primary variant={"ghost"} pl={3}>
              <AppIcon icon={PlusIcon} />
              {"Tambah Layer"}
            </Button>
          </InternalMasterIgtLayerCreateTrigger>
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <ActionHeaderScrollContainer>
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

        <IgtBasisFilterSelect
          modalKey={"master-igt-layer-basis-filter"}
          value={params.igtBasis}
          onValueChange={(val) => {
            startTransition(() => {
              setParams((prev) => ({ ...prev, igtBasis: val, page: 1 }));
            });
            void navigate({
              to: "/internal/master-igt-layer",
              replace: true,
              search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                delete next.basisIgt;
                return next;
              },
            });
          }}
          w={"150px"}
        />

        <StatusFilterSelect
          modalKey={"master-igt-layer-publish-status-filter"}
          options={PUBLISH_STATUS_OPTIONS}
          placeholder={"Semua Status"}
          value={params.publishStatus}
          onValueChange={(val) => {
            startTransition(() => {
              setParams((prev) => ({
                ...prev,
                publishStatus: val,
                page: 1,
              }));
            });
            void navigate({
              to: "/internal/master-igt-layer",
              replace: true,
              search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                delete next.isActive;
                return next;
              },
            });
          }}
          w={"150px"}
        />
      </ActionHeaderScrollContainer>

      <Separator borderColor={"bg.canvas"} />

      <VStack flex={1} gap={"sm"} w={"full"} position={"relative"}>
        {isLoading && <Skeleton p={"md"} rounded={0} />}

        {!isLoading && isError && (
          <Center flex={1} w={"full"} p={"xl"} bg={"bg.body"}>
            <StateRetry
              title={"Gagal Memuat Layer IGT"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat daftar layer IGT. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Center>
        )}

        {!isLoading && !isError && (
          <>
            {isEmptyArray(rawItems) && (
              <Center flex={1} w={"full"} p={"xl"} bg={"bg.body"}>
                {isSearching ? (
                  <StateNoResult query={searchQuery} />
                ) : (
                  <StateNoData
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
              <VStack flex={1} w={"full"} position={"relative"}>
                <TopBarLoader isFetching={isFetching} />

                <DataViewTable.Root<MasterIgtLayerItem>
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
                  <DataViewTable.Header />
                  <DataViewTable.Body />
                </DataViewTable.Root>

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
              </VStack>
            )}
          </>
        )}
      </VStack>
    </>
  );
};

export const InternalDataManagementDataView = InternalMasterIgtLayerDataView;
