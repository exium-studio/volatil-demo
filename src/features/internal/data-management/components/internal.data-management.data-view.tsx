import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalDataManagementCreateTrigger } from "@/features/internal/data-management/components/internal.data-management.create-modal";
import { InternalDataManagementEditTrigger } from "@/features/internal/data-management/components/internal.data-management.edit-modal";
import { PUBLISH_STATUS_OPTIONS } from "@/features/internal/data-management/constants/data-management.config";
import { useMasterIgtLayersQuery } from "@/features/internal/data-management/hooks/use-data-management";
import type {
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { SpatialBasisSelect } from "@/shared/components/select/ui/spatial-basis-select";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { IconLayersOff } from "@tabler/icons-react";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

export const InternalDataManagementDataView = () => {
  // Transitions
  const [_isPending, startTransition] = useTransition();

  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );
  const [spatialBasis, setSpatialBasis] = useState<string>("all");
  const [publishStatus, setPublishStatus] = useState<string>("all");

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useMasterIgtLayersQuery({
    page,
    pageSize,
    search: search || undefined,
    spatialBasis:
      spatialBasis !== "all" ? (spatialBasis as SpatialBasisType) : undefined,
    isActive:
      publishStatus === "published"
        ? true
        : publishStatus === "draft"
          ? false
          : undefined,
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const isSearching = Boolean(
    search.trim() || spatialBasis !== "all" || publishStatus !== "all",
  );
  const searchQuery = useMemo(() => {
    if (search.trim()) return search;
    if (spatialBasis !== "all" && publishStatus !== "all") {
      return `${spatialBasis}, ${publishStatus}`;
    }
    if (spatialBasis !== "all") return spatialBasis;
    if (publishStatus !== "all") return publishStatus;
    return "...";
  }, [search, spatialBasis, publishStatus]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Layer IGT", sortable: true },
      { th: "Status", sortable: true, align: "center" },
      { th: "Workspace / Typename", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Urutan (Z-Index)", sortable: true, align: "center" },
      { th: "WFS URL" },
      { th: "WMS URL" },
      { th: "Terakhir Diperbarui", sortable: true },
    ];

    const items = rawItems.map((item) => {
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
              <P
                fontSize={"xs"}
                color={"fg.subtle"}
                fontFamily={"mono"}
                whiteSpace={"nowrap"}
              >
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
          },
          {
            value: item.wfsUrl,
            td: (
              <HStack gap={"xs"} align={"center"} maxW={"260px"}>
                <ExternalLink
                  href={item.wfsUrl}
                  display={"inline-flex"}
                  alignItems={"center"}
                  minW={0}
                  flex={1}
                >
                  <ClampedP fontSize={"sm"} truncate>
                    {item.wfsUrl}
                  </ClampedP>
                </ExternalLink>

                <ClipboardButton
                  value={item.wfsUrl}
                  variant={"ghost"}
                  aria-label={"Salin URL WFS"}
                  flexShrink={0}
                />
              </HStack>
            ),
            align: "start" as const,
          },
          {
            value: item.wmsUrl,
            td: (
              <HStack gap={"xs"} align={"center"} maxW={"260px"}>
                <ExternalLink
                  href={item.wmsUrl}
                  display={"inline-flex"}
                  alignItems={"center"}
                  minW={0}
                  flex={1}
                >
                  <ClampedP fontSize={"sm"} truncate>
                    {item.wmsUrl}
                  </ClampedP>
                </ExternalLink>

                <ClipboardButton
                  value={item.wmsUrl}
                  variant={"ghost"}
                  aria-label={"Salin URL WMS"}
                  flexShrink={0}
                />
              </HStack>
            ),
            align: "start" as const,
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
        ],
      };
    });

    const itemActions: DataViewItemActionsGenerator<MasterIgtLayerItem>[] = [
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
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [rawItems, preferredTimezone]);

  return (
    <Container.Root withContext={true} flex={1}>
      <Container.Body overflowY={"auto"}>
        <HeaderContainer>
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
              <Button primary variant={"ghost"} pl={1.5}>
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
            value={search}
            onValueChange={(val) =>
              startTransition(() => {
                setSearch(val);
                setPage(1);
              })
            }
            placeholder={"Cari nama layer, ID, endpoint..."}
            maxW={"280px"}
          />

          <SpatialBasisSelect
            modalKey={"data-management-spatial-basis-filter"}
            value={spatialBasis}
            onValueChange={(val) =>
              startTransition(() => {
                setSpatialBasis(val);
                setPage(1);
              })
            }
            w={"150px"}
          />

          <StatusSelect
            modalKey={"data-management-publish-status-filter"}
            options={PUBLISH_STATUS_OPTIONS}
            placeholder={"Semua Status"}
            value={publishStatus}
            onValueChange={(val) =>
              startTransition(() => {
                setPublishStatus(val);
                setPage(1);
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
                    itemActions={dataList.itemActions}
                    withNumbering
                    page={page}
                    pageSize={pageSize}
                    pb={0}
                    rounded={0}
                  >
                    <DataView.Table.Header />
                    <DataView.Table.Body />
                  </DataView.Table.Root>

                  <Separator borderColor={"bg.canvas"} />

                  <DataViewFooter
                    page={page}
                    pageSize={pageSize}
                    setPage={(nextPage: number) => setPage(nextPage)}
                    setPageSize={(nextSize: number) => {
                      setPageSize(nextSize);
                      setPage(1);
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
