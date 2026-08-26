// src/features/internal/data-management/components/internal.data-management.data-list.tsx

import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { InternalDataManagementEditModal } from "@/features/internal/data-management/components/internal.data-management.edit-modal";
import { useMasterIgtLayersQuery } from "@/features/internal/data-management/hooks/use-data-management";
import type {
  MasterIgtLayerItem,
  SpatialBasisType,
} from "@/features/internal/data-management/types/data-management.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { Edit2Icon, LayersIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const InternalDataManagementDataList = () => {
  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(
    DEFAULT_PAGE_SIZE_OPTIONS[0],
  );
  const [spatialBasis, setSpatialBasis] = useState<string>("all");
  const [publishStatus, setPublishStatus] = useState<string>("all");
  const [selectedLayer, setSelectedLayer] = useState<MasterIgtLayerItem | null>(
    null,
  );

  // Stores & Hooks
  const { open: openLayerModal, close: closeLayerModal } = usePopModal({
    modalKey: "layer-edit",
  });

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
              <VStack align={"start"} gap={0} maxW={"260px"}>
                <P fontWeight={"medium"}>{item.title}</P>
                <P fontSize={"xs"} color={"fg.subtle"} truncate title={item.id}>
                  {item.id}
                </P>
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
                {isBidang ? "Objek Bidang" : "Luas Kawasan"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.isActive ? "published" : "draft",
            td: (
              <Badge
                colorPalette={item.isActive ? "green" : "gray"}
                variant={"subtle"}
              >
                {item.isActive ? "Publik (Aktif)" : "Draft (Internal)"}
              </Badge>
            ),
            align: "center" as const,
          },
          {
            value: item.wfs.wfsUrl,
            td: (
              <VStack align={"start"} gap={0} maxW={"300px"}>
                <HStack gap={1} align={"center"}>
                  <Badge variant={"outline"} colorPalette={"teal"} size={"xs"}>
                    {"WFS"}
                  </Badge>
                  <P
                    fontSize={"xs"}
                    color={"fg.subtle"}
                    truncate
                    title={item.wfs.wfsUrl}
                  >
                    {item.wfs.wfsUrl}
                  </P>
                </HStack>
                <HStack gap={1} align={"center"}>
                  <Badge
                    variant={"outline"}
                    colorPalette={"purple"}
                    size={"xs"}
                  >
                    {"WMS"}
                  </Badge>
                  <P
                    fontSize={"xs"}
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

    const itemActions = [
      {
        key: "edit-layer",
        label: "Ubah Layer",
        icon: Edit2Icon,
        onClick: (item: MasterIgtLayerItem) => {
          setSelectedLayer(item);
          openLayerModal();
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [filteredItems, preferredTimezone, openLayerModal]);

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

            <HStack gap={SPACING.xs} align={"center"}>
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
          gap={SPACING.sm}
          w={"full"}
          p={SPACING.md}
          bg={"bg.body"}
        >
          <SearchInput
            value={search}
            onValueChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder={"Cari nama layer, ID, endpoint..."}
            maxW={"300px"}
          />

          {/* Basis Filter */}
          <HStack gap={SPACING.xs}>
            <Badge
              cursor={"pointer"}
              variant={spatialBasis === "all" ? "solid" : "outline"}
              colorPalette={"teal"}
              onClick={() => setSpatialBasis("all")}
            >
              {"Semua Basis"}
            </Badge>
            <Badge
              cursor={"pointer"}
              variant={spatialBasis === "bidang" ? "solid" : "outline"}
              colorPalette={"blue"}
              onClick={() => setSpatialBasis("bidang")}
            >
              {"Bidang"}
            </Badge>
            <Badge
              cursor={"pointer"}
              variant={spatialBasis === "kawasan" ? "solid" : "outline"}
              colorPalette={"orange"}
              onClick={() => setSpatialBasis("kawasan")}
            >
              {"Kawasan"}
            </Badge>
          </HStack>

          {/* Publish Status Filter */}
          <HStack gap={SPACING.xs}>
            <Badge
              cursor={"pointer"}
              variant={publishStatus === "all" ? "solid" : "outline"}
              colorPalette={"gray"}
              onClick={() => setPublishStatus("all")}
            >
              {"Semua Status"}
            </Badge>
            <Badge
              cursor={"pointer"}
              variant={publishStatus === "published" ? "solid" : "outline"}
              colorPalette={"green"}
              onClick={() => setPublishStatus("published")}
            >
              {"Publik"}
            </Badge>
            <Badge
              cursor={"pointer"}
              variant={publishStatus === "draft" ? "solid" : "outline"}
              colorPalette={"gray"}
              onClick={() => setPublishStatus("draft")}
            >
              {"Draft"}
            </Badge>
          </HStack>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Table Content */}
        <VStack
          flex={1}
          gap={SPACING.sm}
          overflowY={"auto"}
          bg={"bg.canvas"}
          w={"full"}
          position={"relative"}
        >
          {isLoading ? (
            <Skeleton p={SPACING.md} rounded={0} h={"320px"} />
          ) : (
            <Box w={"full"} position={"relative"} overflowY={"auto"}>
              <DataListTable.Root<MasterIgtLayerItem>
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
                <DataListTable.Header />
                <DataListTable.Body />
              </DataListTable.Root>

              <TopBarLoader isFetching={isFetching} />

              <DataListFooter
                page={page}
                pageSize={pageSize}
                setPage={(nextPage) => setPage(nextPage)}
                setPageSize={(nextSize) => {
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

        {/* Edit Layer Modal */}
        <InternalDataManagementEditModal
          modalKey={"layer-edit"}
          item={selectedLayer}
          onClose={() => {
            setSelectedLayer(null);
            closeLayerModal();
          }}
        />
      </Container.Body>
    </Container.Root>
  );
};
