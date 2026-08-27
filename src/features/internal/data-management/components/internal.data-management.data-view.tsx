// src/features/internal/data-management/components/internal.data-management.data-list.tsx

import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalDataManagementEditTrigger } from "@/features/internal/data-management/components/internal.data-management.edit-modal";
import { useMasterIgtLayersQuery } from "@/features/internal/data-management/hooks/use-data-management";
import type {
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import { SpatialBasisSelect } from "@/shared/components/select/ui/spatial-basis-select";
import { StatusSelect } from "@/shared/components/select/ui/status-select";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { Edit2Icon, LayersIcon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

const PUBLISH_STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Publik" },
  { value: "draft", label: "Draft" },
];

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

  const filteredItems = useMemo(() => {
    if (!search) return rawItems;
    const lower = search.toLowerCase();
    return rawItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.id.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.wfs.wfsUrl.toLowerCase().includes(lower) ||
        item.wms.wmsUrl.toLowerCase().includes(lower),
    );
  }, [rawItems, search]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Tema / Layer IGT", sortable: false, align: "start" },
      { th: "Basis Spasial", sortable: false, align: "start" },
      { th: "Status Publikasi", sortable: false, align: "center" },
      { th: "WFS / WMS Service URL", sortable: false, align: "start" },
      { th: "Terakhir Diperbarui", sortable: false, align: "start" },
    ];

    const items = filteredItems.map((item) => {
      const isBidang = item.spatialBasis === "bidang";

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.title,
            td: (
              <VStack align={"start"} gap={0} maxW={"280px"}>
                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {item.title}
                </P>
                <P fontSize={"xs"} color={"fg.subtle"} fontFamily={"mono"}>
                  {item.id}
                </P>
                {item.description && (
                  <P
                    fontSize={"xs"}
                    color={"fg.muted"}
                    truncate
                    title={item.description}
                  >
                    {item.description}
                  </P>
                )}
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: item.spatialBasis,
            td: (
              <Badge
                colorPalette={isBidang ? "blue" : "orange"}
                variant={"subtle"}
              >
                {isBidang ? "Bidang" : "Kawasan"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.isActive ? "Publik" : "Draft",
            td: (
              <Badge
                colorPalette={item.isActive ? "green" : "gray"}
                variant={item.isActive ? "solid" : "subtle"}
              >
                {item.isActive ? "Publik" : "Draft"}
              </Badge>
            ),
            align: "center" as const,
          },
          {
            value: item.wfs.wfsUrl,
            td: (
              <VStack align={"start"} gap={1} maxW={"280px"}>
                <HStack gap={1}>
                  <Badge size={"xs"} variant={"outline"} colorPalette={"teal"}>
                    {"WFS"}
                  </Badge>
                  <P
                    fontSize={"xs"}
                    fontFamily={"mono"}
                    color={"fg.subtle"}
                    truncate
                    title={item.wfs.wfsUrl}
                  >
                    {item.wfs.wfsUrl}
                  </P>
                </HStack>

                <HStack gap={1}>
                  <Badge size={"xs"} variant={"outline"} colorPalette={"purple"}>
                    {"WMS"}
                  </Badge>
                  <P
                    fontSize={"xs"}
                    fontFamily={"mono"}
                    color={"fg.subtle"}
                    truncate
                    title={item.wms.wmsUrl}
                  >
                    {item.wms.wmsUrl}
                  </P>
                </HStack>
              </VStack>
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
        icon: Edit2Icon,
        modal: {
          triggerComponent: (layer: MasterIgtLayerItem) => (
            <InternalDataManagementEditTrigger item={layer} />
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
  }, [filteredItems, preferredTimezone]);

  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
        <HeaderContainer>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <VStack align={"start"} gap={0}>
              <Heading>{"Manajemen Tema & Layer IGT"}</Heading>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {
                  "Katalog master data spasial geospasial ATR/BPN. Layer berstatus 'Publik' otomatis dapat diakses dan dipesan oleh Mitra."
                }
              </P>
            </VStack>

            <HStack gap={"xs"} align={"center"}>
              <Badge variant={"subtle"} colorPalette={"blue"}>
                <LayersIcon size={14} />
                {`${filteredItems.length} Layer`}
              </Badge>
            </HStack>
          </HStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Controls Bar */}
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
            <Skeleton p={"md"} rounded={0} h={"320px"} />
          ) : (
            <Box w={"full"} position={"relative"} overflowY={"auto"}>
              <DataView.Table.Root<MasterIgtLayerItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                withNumbering={true}
                page={page}
                pageSize={pageSize}
                rounded={0}
                pb={0}
                shadow={"none"}
              >
                <DataView.Table.Header />
                <DataView.Table.Body />
              </DataView.Table.Root>

              <TopBarLoader isFetching={isFetching} />

              <DataViewFooter
                page={page}
                pageSize={pageSize}
                setPage={(nextPage: number) => setPage(nextPage)}
                setPageSize={(nextSize: number) => {
                  setPageSize(nextSize);
                  setPage(1);
                }}
                currentDataLength={filteredItems.length}
                totalData={pagination?.totalItems ?? filteredItems.length}
                totalPage={pagination?.totalPages ?? 1}
                roundedBottom={0}
                shadow={"none"}
              />
            </Box>
          )}
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
