// src/features/mitra/my-data/components/mitra.my-data.data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { MitraMyDataEditTrigger } from "@/features/mitra/my-data/components/mitra.my-data.edit-modal";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MyDataItem,
  MyDataQueryParams,
} from "@/features/mitra/my-data/types/my-data.type";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { LayerAttributeTableView } from "@/features/shared/components/layer-attribute-table.view";
import { TteBadge } from "@/features/shared/components/tte.badge";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  DatabaseIcon,
  Edit3Icon,
  EyeIcon,
  EyeOffIcon,
  FileCheckIcon,
  FocusIcon,
  ReceiptTextIcon,
  SquarePen,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export const MitraMyDataDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();

  // Stores
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);
  const setLayerEnabled = useMapLayerStore((s) => s.setLayerEnabled);
  const setCustomLayerConfig = useMapLayerStore((s) => s.setCustomLayerConfig);

  // Hooks
  const { flyTo } = useFlyToLayer();

  // States — Centralized query/action parameters
  const [params, setParams] = useState<MyDataQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    search: "",
  });
  const [selectedAttributeLayer, setSelectedAttributeLayer] =
    useState<MyDataItem | null>(null);

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "");
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { myData, isLoading, isFetching, isError, error, refetch } =
    useMitraMyDataQuery({
      page: params.page,
      pageSize: params.pageSize,
      search: debouncedSearch || undefined,
    });

  // Handlers
  const handleToggleLayer = useCallback(
    (item: MyDataItem, checked: boolean) => {
      if (checked) {
        const proxyWmsUrl = item.externalWmsUrl;
        // const proxyWfsUrl = item.externalWfsUrl;

        setCustomLayerConfig(item.id, {
          wmsUrl: proxyWmsUrl,
          layers: item.wmsLayers || item.wfsTypeName || "",
          spatialBasis: item.spatialBasis,
        });
        setLayerEnabled(item.id, true);
        // void flyTo({
        //   id: item.id,
        //   title: item.title,
        //   spatialBasis: item.spatialBasis,
        //   bbox: item.bbox,
        //   wfs: {
        //     wfsTypeName: item.wfsTypeName || item.id,
        //     wfsUrl: proxyWfsUrl,
        //   },
        // });
      } else {
        setLayerEnabled(item.id, false);
        setCustomLayerConfig(item.id, null);
      }
    },
    [
      // flyTo,
      setCustomLayerConfig,
      setLayerEnabled,
    ],
  );

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT (Label)", sortable: true },
      { th: "WMS URL", sortable: false },
      { th: "Basis IGT", sortable: true },
      { th: "TTE & Faktur", sortable: false, align: "start" },
      { th: "Sisa Waktu", sortable: true },
      { th: "Tanggal Kedaluwarsa", sortable: true },
      { th: "Tampilkan di Peta", sortable: false, align: "center" },
    ];

    const items: FormattedListItem<MyDataItem>[] = myData.items.map(
      (item: MyDataItem) => {
        const layerDisplayName =
          item.label || item.title || item.id.replace(/_/g, " ");
        // const effectiveWfsUrl = item.externalWfsUrl || item.wfsUrl;
        const effectiveWmsUrl = item.externalWmsUrl;
        const isVisibleOnMap = Boolean(enabledLayerIds[item.id]);

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: layerDisplayName,
              td: (
                <ClampedP
                  fontSize={"sm"}
                  w={"220px"}
                  cursor={"pointer"}
                  _hover={{ textDecoration: "underline", color: "blue.fg" }}
                  onClick={() => setSelectedAttributeLayer(item)}
                >
                  {layerDisplayName}
                </ClampedP>
              ),
              align: "start" as const,
            },
            {
              value: effectiveWmsUrl ?? "",
              td: (
                <Url
                  url={effectiveWmsUrl}
                  label={"Salin URL WMS"}
                  w={"280px"}
                  minW={"280px"}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.spatialBasis,
              td: <IgtBasisBadge>{item.spatialBasis}</IgtBasisBadge>,
              align: "start" as const,
            },
            {
              value: item.tte ? "TTE" : "Belum TTE",
              td: (
                <TteBadge
                  tte={item.tte}
                  invoiceUrl={item.invoiceUrl}
                  tteInvoiceUrl={item.tteInvoiceUrl}
                />
              ),
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
                  {formatUtcDateTime(item.expiresAt, preferredTimezone)}
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
        icon: ReceiptTextIcon,
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
          setSelectedAttributeLayer(item);
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [
    myData.items,
    preferredTimezone,
    enabledLayerIds,
    handleToggleLayer,
    flyTo,
  ]);

  if (selectedAttributeLayer) {
    return (
      <LayerAttributeTableView
        layer={selectedAttributeLayer}
        onBack={() => setSelectedAttributeLayer(null)}
        showActions={false}
      />
    );
  }

  return (
    <VStack flex={1} overflowY={"auto"} w={"full"} h={"full"}>
      {/* Header Controls */}
      <ActionHeaderScrollContainer>
        <SearchInput
          value={params.search}
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari layer IGT / tema..."}
          maxW={"280px"}
        />
      </ActionHeaderScrollContainer>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Content */}
      <VStack
        flex={1}
        gap={"sm"}
        position={"relative"}
        overflowY={"auto"}
        w={"full"}
        bg={"bg.canvas"}
      >
        {isLoading ? (
          <Skeleton p={"md"} rounded={0} />
        ) : isError ? (
          <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
            <StateRetry
              title={"Gagal Memuat Data IGT"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat daftar data spasial IGT Anda. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </Center>
        ) : isEmptyArray(myData.items) ? (
          <VStack
            flex={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            w={"full"}
            py={"xl"}
            bg={"bg.body"}
          >
            {debouncedSearch ? (
              <StateNoResult
                description={
                  "Tidak ada layer IGT yang sesuai dengan kata kunci pencarian Anda."
                }
              />
            ) : (
              <StateNoData
                icon={DatabaseIcon}
                title={"Belum Ada Data IGT"}
                description={
                  "Anda belum memiliki akses ke layer data spasial IGT. Silakan ajukan permintaan data terlebih dahulu."
                }
              >
                <Button
                  primary
                  size={"sm"}
                  onClick={() => {
                    navigate({ to: "/mitra/data-request" });
                  }}
                >
                  <AppIcon icon={SquarePen} />
                  {"Permintaan Data"}
                </Button>
              </StateNoData>
            )}
          </VStack>
        ) : (
          <VStack flex={1} w={"full"} position={"relative"} overflowY={"auto"}>
            <TopBarLoader isFetching={isFetching} />

            <DataViewTable.Root
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              withNumbering={true}
              page={params.page}
              pageSize={params.pageSize}
              rounded={0}
              pb={0}
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
              currentDataLength={myData.items.length}
              totalData={myData.pagination.totalItems}
              totalPage={myData.pagination.totalPages}
            />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
