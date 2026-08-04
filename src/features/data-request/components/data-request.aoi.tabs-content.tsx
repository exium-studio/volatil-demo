// src/features/data-request/components/data-request.catalog.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListBatchActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import {
  PADDING_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import type { IgtCategory } from "@/features/data-request/types/data-request.catalog.type";
import { catalogData } from "@/shared/constants/dummy-data";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { ShoppingCartIcon, SlidersHorizontalIcon } from "lucide-react";
import { useMemo } from "react";

export type DataRequestCatalogTabsContentProps = TabsContentProps & {};

const IGT_THEME_TYPE_MAP = {
  bidang: {
    label: "IGT Berbasis Bidang",
    colorPalette: "blue",
    color: "blue.fg",
  },
  kawasan: {
    label: "IGT Berbasis Kawasan",
    colorPalette: "orange",
    color: "orange.fg",
  },
} as const;

const IGT_CATEGORY_MAP: Record<IgtCategory, string> = {
  hak_atas_tanah: "IGT Hak Atas Tanah",
  pemilikan_tanah: "IGT Pemilikan Tanah",
  bidang_tanah: "IGT Bidang Tanah",
  rtrw_nasional: "IGT RTRW Nasional",
  rtrw_provinsi: "IGT RTRW Provinsi",
  rtrw_kota: "IGT RTRW Kota",
};

export const DataRequestAoiTabsContent = (
  props: DataRequestCatalogTabsContentProps,
) => {
  return (
    <Tabs.Content
      display={"flex"}
      flexDir={"column"}
      flex={1}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        {/* <VStack gap={1}>
          <P>Unggah Data AOI</P>
          <P fontSize={"sm"} color={"fg.subtle"}>
            Unggah data untuk menemukan informasi.
          </P>
        </VStack> */}

        <FileInput />
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING_SM}
        >
          <HStack gap={SPACING_SM}>
            <SearchInput placeholder={t["action.search"]()} />

            <IconButton variant={"outline"}>
              <AppIcon icon={SlidersHorizontalIcon} />
            </IconButton>
          </HStack>

          <Button primary variant={"subtle"}>
            Pilih semua yang terfilter
          </Button>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <DataList />
    </Tabs.Content>
  );
};

const DataList = () => {
  // Resolved Values
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "Nama Data IGT-PR", sortable: true },
        { th: "Jenis Tema IGT-PR", sortable: true },
        { th: "Basis Kuota", sortable: true },
        { th: "Kategori Tema IGT-PR" },
        { th: "Deskripsi Data" },
        { th: "Total Harga", sortable: true, align: "end" },
      ] as FormattedTableHeader[],

      items: catalogData.map((item) => ({
        id: item.id,
        data: item,
        columns: [
          {
            value: item.name,
            td: <P>{item.name}</P>,
            align: "start",
          },
          {
            value: item.themeType,
            td: (
              <Badge
                colorPalette={IGT_THEME_TYPE_MAP[item.themeType].colorPalette}
                variant={"subtle"}
              >
                {IGT_THEME_TYPE_MAP[item.themeType].label}
              </Badge>
            ),
            align: "center",
          },
          {
            value: item.quotaBase,
            td: (
              <HStack align={"center"} gap={2}>
                <P>{item.quotaBase}</P>
                <P
                  fontSize={"sm"}
                  color={IGT_THEME_TYPE_MAP[item.themeType].color}
                >
                  {item.themeType === "bidang" ? "bidang" : "ha"}
                </P>
              </HStack>
            ),
            align: "start",
          },
          {
            value: item.categories.join(", "),
            td: (
              <HStack
                wrap={"wrap"}
                align={"start"}
                gap={1}
                w={"max"}
                maxW={"300px"}
              >
                {item.categories.map((cat) => (
                  <Badge key={cat} colorPalette={"neutral"}>
                    {IGT_CATEGORY_MAP[cat]}
                  </Badge>
                ))}
              </HStack>
            ),
            align: "start",
          },
          {
            value: item.description,
            td: (
              <P
                color={"fg.subtle"}
                w={"max"}
                maxW={"300px"}
                whiteSpace={"wrap"}
                fontSize={"sm"}
              >
                {item.description}
              </P>
            ),
            align: "start",
          },
          {
            value: item.price,
            td: (
              <FormatNumber
                value={item.price}
                style={"currency"}
                currency={"IDR"}
                maximumFractionDigits={0}
              />
            ),
            align: "end",
          },
        ] as FormattedTableColumn[],
      })) as FormattedListItem[],

      batchActions: [
        ({ selectedItemIds, selectedItems }) => {
          return (
            <Button
              disabled={isEmptyArray(selectedItems)}
              onClick={() => {
                console.log({ selectedItemIds, selectedItems });
              }}
            >
              <AppIcon icon={ShoppingCartIcon} />
              Tambah ke keranjang
            </Button>
          );
        },
      ] as DataListBatchActionsGenerator[],
    }),
    [],
  );

  return (
    <VStack flex={1} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        withNumbering={false}
        headers={dataList.headers}
        items={dataList.items}
        batchActions={dataList.batchActions}
        onSelectedItemChange={({ selectedItems }) => {
          console.log("selectedItems", selectedItems);
        }}
        overflowY={"visible"}
        rounded={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>
    </VStack>
  );
};
