import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraMyDataViewProps,
  MyDataItem,
  MyDataQueryParams,
  MyDataStatus,
} from "@/features/mitra/my-data/types/my-data.type";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { MyDataStatusBadge } from "@/features/shared/components/my-data-status.badge";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { UrlDataView } from "@/features/shared/components/url.data-view";
import { MY_DATA_STATUS_OPTIONS } from "@/shared/constants/status.config";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";
import { useNavigate } from "@tanstack/react-router";
import {
  DatabaseIcon,
  EyeIcon,
  EyeOffIcon,
  FocusIcon,
  SquarePen,
  TablePropertiesIcon,
} from "lucide-react";
import { useCallback, useMemo, useState, useTransition } from "react";

export const MitraMyDataDataView = (_props: MitraMyDataViewProps) => {
  // Navigation
  const navigate = useNavigate();

  // Transitions
  const [_isPending, startTransition] = useTransition();

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
    status: undefined,
  });
  const [selectedAttributeLayer, setSelectedAttributeLayer] =
    useState<MyDataItem | null>(null);

  // Derived Values
  const debouncedSearch = useDebouncedValue(params.search ?? "");
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { myData, isLoading, isFetching } = useMitraMyDataQuery({
    page: params.page,
    pageSize: params.pageSize,
    search: debouncedSearch || undefined,
    status: params.status,
  });

  // Handlers
  const handleToggleLayer = useCallback(
    (item: MyDataItem, checked: boolean) => {
      const effectiveWmsUrl = item.externalWmsUrl || item.wmsUrl;

      if (checked) {
        if (effectiveWmsUrl) {
          setCustomLayerConfig(item.id, {
            wmsUrl: buildWmsProxyUrl(effectiveWmsUrl),
            layers: item.wmsLayers || item.id,
            spatialBasis: item.spatialBasis,
          });
        }
        setLayerEnabled(item.id, true);
        void flyTo({
          id: item.id,
          title: item.title,
          spatialBasis: item.spatialBasis,
          bbox: item.bbox,
          wfs: {
            wfsTypeName: item.wfsTypeName || item.id,
            wfsUrl: item.wfsUrl || "",
          },
        });
      } else {
        setLayerEnabled(item.id, false);
        setCustomLayerConfig(item.id, null);
      }
    },
    [flyTo, setCustomLayerConfig, setLayerEnabled],
  );

  // Derived Values - DataList headers & items
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer IGT", sortable: true, align: "start" },
      { th: "Basis IGT", sortable: true, align: "start" },
      { th: "WMS URL", sortable: false, align: "start" },
      // { th: "WFS URL", sortable: false, align: "start" },
      { th: "Status Aktif", sortable: true, align: "start" },
      { th: "Sisa Waktu", sortable: true, align: "start" },
      { th: "Tanggal Kedaluwarsa", sortable: true, align: "start" },
      { th: "Tampilkan di Peta", sortable: false, align: "center" },
    ];

    const items: FormattedListItem<MyDataItem>[] = myData.items.map(
      (item: MyDataItem) => {
        const layerDisplayName = item.title || item.id.replace(/_/g, " ");
        // const effectiveWfsUrl = item.externalWfsUrl || item.wfsUrl;
        const effectiveWmsUrl = item.externalWmsUrl || item.wmsUrl;
        const isVisibleOnMap = Boolean(enabledLayerIds[item.id]);

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: layerDisplayName,
              td: (
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {layerDisplayName}
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
              value: effectiveWmsUrl ?? "",
              td: (
                <UrlDataView
                  url={effectiveWmsUrl}
                  label={"Salin URL WMS"}
                  maxW={"320px"}
                />
              ),
              align: "start" as const,
            },
            {
              value: item.status,
              td: <MyDataStatusBadge>{item.status}</MyDataStatusBadge>,
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
          if (!enabledLayerIds[item.id]) {
            handleToggleLayer(item, true);
          } else {
            void flyTo({
              id: item.id,
              title: item.title,
              spatialBasis: item.spatialBasis,
              bbox: item.bbox,
              wfs: {
                wfsTypeName: item.wfsTypeName || item.id,
                wfsUrl: item.wfsUrl || "",
              },
            });
          }
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
      <MyDataDetailAttributeList
        item={selectedAttributeLayer}
        onBack={() => setSelectedAttributeLayer(null)}
      />
    );
  }

  return (
    <VStack flex={1} overflowY={"auto"} w={"full"}>
      {/* Header Controls */}
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
          onValueChange={(val) => {
            setParams((prev) => ({ ...prev, search: val, page: 1 }));
          }}
          placeholder={"Cari layer IGT / tema..."}
          maxW={"280px"}
        />

        <HStack wrap={"wrap"} gap={"sm"}>
          <StatusFilterSelect
            modalKey={"my-data-status-filter"}
            placeholder={"Status"}
            options={MY_DATA_STATUS_OPTIONS}
            value={params.status ?? ""}
            onValueChange={(value) => {
              startTransition(() => {
                setParams((prev) => ({
                  ...prev,
                  status: (value as MyDataStatus) || undefined,
                  page: 1,
                }));
              });
            }}
            w={"180px"}
          />
        </HStack>
      </HStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Table Content */}
      <VStack
        flex={1}
        gap={"sm"}
        overflowY={"auto"}
        bg={"bg.canvas"}
        w={"full"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={"md"} rounded={0} />
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
            {debouncedSearch || params.status ? (
              <NoResultState
                description={
                  "Tidak ada layer IGT yang sesuai dengan kata kunci atau filter yang Anda pilih."
                }
              />
            ) : (
              <NoDataState
                icon={DatabaseIcon}
                title={"Belum Ada Data IGT"}
                description={
                  "Anda belum memiliki akses ke layer data spasial IGT. Silakan ajukan permohonan data terlebih dahulu."
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
                  {"Permohonan Data"}
                </Button>
              </NoDataState>
            )}
          </VStack>
        ) : (
          <VStack flex={1} w={"full"} position={"relative"} overflowY={"auto"}>
            <DataView.Table.Root
              flex={1}
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              withNumbering={true}
              page={params.page}
              pageSize={params.pageSize}
              rounded={0}
              pb={0}
            >
              <DataView.Table.Header />
              <DataView.Table.Body />
            </DataView.Table.Root>

            <TopBarLoader isFetching={isFetching} />

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
              roundedBottom={0}
            />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

type MyDataDetailAttributeListProps = {
  item: MyDataItem;
  onBack: () => void;
};

const MyDataDetailAttributeList = (props: MyDataDetailAttributeListProps) => {
  // Props
  const { item, onBack } = props;

  // Stores
  const enabledLayerIds = useMapLayerStore((s) => s.enabledLayerIds);

  // States
  const [pageState, setPageState] = useState({
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    page: 1,
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Derived Values
  const igtLayerTarget = useMemo((): IgtLayerItem => {
    const effectiveWmsUrl = item.externalWmsUrl || item.wmsUrl || "";
    const effectiveWfsUrl = item.externalWfsUrl || item.wfsUrl || "";
    const typeName = item.wfsTypeName || item.id;

    return {
      id: item.id,
      title: item.title,
      spatialBasis: item.spatialBasis,
      bbox: item.bbox,
      visible: Boolean(enabledLayerIds[item.id]),
      zIndex: 1,
      wms: {
        layers: item.wmsLayers || item.id,
        wmsUrl: effectiveWmsUrl,
        format: "image/png",
        transparent: true,
        tileSize: 512,
        styles: "",
        version: "1.1.1",
        srs: "EPSG:3857",
      },
      wfs: {
        wfsTypeName: typeName,
        wfsUrl: effectiveWfsUrl,
        type: item.spatialBasis === "kawasan" ? "wfs-line" : "wfs-fill",
        version: "2.0.0",
        srsName: "EPSG:4326",
      },
    };
  }, [item, enabledLayerIds]);

  // Queries — server-side WFS pagination
  const { features, totalFeatures, isLoading, isFetching } = useIgtWfsCatalog({
    page: pageState.page,
    pageSize: pageState.pageSize,
    typeName: item.wfsTypeName || item.id,
    wfsUrl: item.externalWfsUrl || item.wfsUrl || "",
  });

  return (
    <MitraDataRequestDetailAttributeView
      layer={igtLayerTarget}
      features={features}
      totalFeatures={totalFeatures}
      isLoading={isLoading}
      isFetching={isFetching}
      page={pageState.page}
      pageSize={pageState.pageSize}
      setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
      setPageSize={(pageSize) =>
        setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
      }
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      showActions={false}
      onBack={onBack}
    />
  );
};
