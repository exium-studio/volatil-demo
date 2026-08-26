// src/features/internal/pricing/components/internal.pricing.data-list.tsx

import type {
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
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
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import { InternalPricingEditModal } from "@/features/internal/pricing/components/internal.pricing-edit-modal";
import { useInternalPricingListQuery } from "@/features/internal/pricing/hooks/use-internal-pricing";
import type {
  PricingItem,
  SpatialBasisType,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { formatUtcDateTime, getPreferredUserTimezone } from "@/shared/utils/formatter/date.formatter";
import { Edit2Icon } from "lucide-react";
import { useMemo, useState } from "react";

export const InternalPricingDataList = () => {
  // States
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE_OPTIONS[0]);
  const [spatialBasis, setSpatialBasis] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PricingItem | null>(null);

  // Stores & Hooks
  const { open: openEditModal, close: closeEditModal } = usePopModal({
    modalKey: "pricing-edit",
  });

  // Queries
  const {
    items: rawItems,
    pagination,
    isLoading,
    isFetching,
  } = useInternalPricingListQuery({
    page,
    pageSize,
    search: search || undefined,
    spatialBasis: spatialBasis !== "all" ? (spatialBasis as SpatialBasisType) : undefined,
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const filteredItems = useMemo(() => {
    if (!search) return rawItems;
    const lower = search.toLowerCase();
    return rawItems.filter(
      (item) =>
        item.layerTitle?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.id.toLowerCase().includes(lower),
    );
  }, [rawItems, search]);

  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Layer / Komponen Tarif", sortable: false, align: "start" },
      { th: "Basis Spasial", sortable: false, align: "start" },
      { th: "Tarif Satuan (PNBP)", sortable: false, align: "end" },
      { th: "Status", sortable: false, align: "center" },
      { th: "Terakhir Diperbarui", sortable: false, align: "start" },
    ];

    const items = filteredItems.map((item) => {
      const isBidang = item.spatialBasis === "bidang";

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.layerTitle ?? item.id,
            td: (
              <VStack align={"start"} gap={0} maxW={"280px"}>
                <P fontWeight={"medium"}>{item.layerTitle ?? item.id}</P>
                {item.description && (
                  <P fontSize={"xs"} color={"fg.subtle"} truncate title={item.description}>
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
                {isBidang ? "Objek Bidang" : "Luas Kawasan"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.unitPrice,
            td: (
              <VStack align={"end"} gap={0}>
                <P fontWeight={"bold"} color={"teal.fg"}>
                  <FormatNumber
                    value={item.unitPrice}
                    style={"currency"}
                    currency={"IDR"}
                    maximumFractionDigits={0}
                  />
                </P>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {item.unitLabel}
                </P>
              </VStack>
            ),
            align: "end" as const,
          },
          {
            value: item.isActive ? "active" : "inactive",
            td: (
              <Badge
                colorPalette={item.isActive ? "green" : "gray"}
                variant={"subtle"}
              >
                {item.isActive ? "Aktif" : "Non-Aktif"}
              </Badge>
            ),
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
        ],
      };
    });

    const itemActions = [
      {
        key: "edit-pricing",
        label: "Ubah Tarif",
        icon: Edit2Icon,
        onClick: (item: PricingItem) => {
          setSelectedItem(item);
          openEditModal();
        },
      },
    ];

    return {
      headers,
      items,
      batchActions: [],
      itemActions,
    };
  }, [filteredItems, preferredTimezone, openEditModal]);

  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <Container.Body flex={1} minH={0} overflowY={"auto"}>
        <HeaderContainer>
          <VStack align={"start"} gap={0}>
            <Heading>{"Master Tarif & Pricing PNBP"}</Heading>
            <P fontSize={"xs"} color={"fg.subtle"}>
              {"Konfigurasi tarif satuan layer IGT yang digunakan saat kalkulasi keranjang permohonan data mitra."}
            </P>
          </VStack>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        {/* Controls */}
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
            placeholder={"Cari layer / keterangan tarif..."}
            maxW={"300px"}
          />

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
              <DataListTable.Root<PricingItem>
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

        {/* Edit Modal */}
        <InternalPricingEditModal
          modalKey={"pricing-edit"}
          item={selectedItem}
          onClose={() => {
            setSelectedItem(null);
            closeEditModal();
          }}
        />
      </Container.Body>
    </Container.Root>
  );
};
