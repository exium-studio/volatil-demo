// src/features/data-request/components/data-request.catalog.tabs-content.tsx

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableColumn,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PER_PAGE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-per-page";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInputTrigger } from "@/design-system/components/input/ui/file-input";
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
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import {
  DataRequestAoiContext,
  useDataRequestAoiContext,
} from "@/features/data-request/contexts/data-request.aoi.context";
import type {
  IgtCategory,
  IgtDataResponse,
} from "@/features/data-request/types/data-request.type";
import { dummyIgtData } from "@/shared/constants/dummy-data";
import { t } from "@/shared/libs/i18n";
import { FilesIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";

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

export const DataRequestAoiTabsContent = (props: TabsContentProps) => {
  // States
  const [dataListState, setDataListState] = useState({
    perPage: DEFAULT_PER_PAGE_OPTIONS[0],
    page: 1,
    selectedItems: [] as FormattedListItem[],
    uploadedFiles: [] as File[],
  });

  // Queries
  // TODO: use tanstack query to fetch data
  const data = dummyIgtData as IgtDataResponse | null;
  // const data = null as IgtDataResponse | null;

  // Resolved Values
  const contextValue = useMemo(
    () => ({
      igtData: data,
      dataListState,
      setDataListState,
    }),
    [data, dataListState, setDataListState],
  );

  return (
    <DataRequestAoiContext.Provider value={contextValue}>
      <Tabs.Content
        display={"flex"}
        flexDir={"column"}
        flex={1}
        overflowY={"auto"}
        p={0}
        {...props}
      >
        {!data && (
          <NoDataState
            description={
              "Upload file AOI untuk melihat data IGT yang tersedia di area tersebut"
            }
          >
            <AddAoiFileButton />
          </NoDataState>
        )}

        {data && (
          <>
            {/* Header */}
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

                <HStack align={"center"} gap={SPACING_SM}>
                  <Button variant={"outline"}>
                    <AppIcon icon={FilesIcon} />
                    File anda ({dataListState.uploadedFiles.length})
                  </Button>
                  <AddAoiFileButton variant={"outline"} />
                </HStack>
              </HStack>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            {/* Body */}
            <DataList />

            <Separator borderColor={"bg.canvas"} />

            {/* Footer */}
            <DataRequestAddToCartButtons
              selectedItems={dataListState.selectedItems}
              totalItems={data.meta.total ?? 0}
              onAddSelectedClick={() => {
                console.log("onAddSelectedClick");
              }}
              onAddAllClick={() => {
                console.log("onAddAllClick");
              }}
            />
          </>
        )}
      </Tabs.Content>
    </DataRequestAoiContext.Provider>
  );
};

const DataList = () => {
  // Contexts
  const { igtData, dataListState, setDataListState } =
    useDataRequestAoiContext();

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

      items: igtData?.items?.map((item) => ({
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
    }),
    [igtData],
  );

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        withNumbering={false}
        headers={dataList.headers}
        items={dataList.items}
        canBatchSelect
        onSelectedItemChange={({ selectedItems }) => {
          setDataListState((prev) => ({ ...prev, selectedItems }));
          console.log("selectedItems", selectedItems);
        }}
        rounded={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>

      <DataListFooter
        perPage={dataListState.perPage}
        setPerPage={(perPage) =>
          setDataListState((prev) => ({ ...prev, perPage }))
        }
        page={dataListState.page}
        setPage={(page) => setDataListState((prev) => ({ ...prev, page }))}
        // currentDataLength={items.length}
        rounded={0}
      />
    </VStack>
  );
};

const AddAoiFileButton = (props: ButtonProps) => {
  return (
    <FileInputTrigger>
      <Button primary pl={3} {...props}>
        <AppIcon icon={PlusIcon} />
        Tambah File
      </Button>
    </FileInputTrigger>
  );
};
