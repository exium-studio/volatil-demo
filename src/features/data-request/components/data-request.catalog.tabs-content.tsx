// src/features/data-request/components/data-request.catalog.tabs-content.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PER_PAGE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-per-page";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { DataRequestAddToCartButtons } from "@/features/data-request/components/data.request.add-to-cart-buttons";
import { useIgtCatalog } from "@/features/data-request/hooks/use-data-request";
import { t } from "@/shared/libs/i18n";
import { SlidersHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export const DataRequestCatalogTabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
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
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <DataList />
    </Tabs.Content>
  );
};

const DataList = () => {
  const { theme } = useThemeStore();

  const [dataListState, setDataListState] = useState({
    perPage: DEFAULT_PER_PAGE_OPTIONS[0],
    page: 1,
    selectedItems: [] as FormattedListItem[],
  });

  const { items: rawItems } = useIgtCatalog({
    page: dataListState.page,
    perPage: dataListState.perPage,
  });

  const dataList = useMemo(
    () => ({
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi" },
      ],
      items: rawItems.map((item) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.id,
              td: <P fontSize={"sm"}>{item.id}</P>,
              align: "start" as const,
            },
            {
              value: item.themes.map((th) => th.name).join(", "),
              td: (
                <HStack wrap={"wrap"} gap={1}>
                  {visibleThemes.map((theme) => (
                    <Badge
                      key={theme.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {theme.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge colorPalette={"neutral"} variant={"outline"}>
                      +{remainingCount} lainnya
                    </Badge>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.basis,
              td: (
                <Badge
                  colorPalette={
                    item.basis === "bidang"
                      ? BASIS_BIDANG_COLOR
                      : BASIS_KAWASAN_COLOR
                  }
                  variant={"subtle"}
                >
                  {item.basis}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.description ?? "",
              td: (
                <P
                  fontSize={"sm"}
                  color={"fg.subtle"}
                  maxW={"280px"}
                  whiteSpace={"wrap"}
                >
                  {item.description ?? "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),
    }),
    [rawItems],
  );

  return (
    <VStack
      flex={1}
      gap={PADDING_SM}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
    >
      <VStack overflowY={"auto"}>
        <DataListTable.Root
          withNumbering={false}
          headers={dataList.headers}
          items={dataList.items}
          canBatchSelect
          roundedTop={0}
          onSelectedItemChange={({ selectedItems }) => {
            console.log("selectedItems", selectedItems);
            setDataListState((prev) => ({ ...prev, selectedItems }));
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
          roundedBottom={theme.radii.container}
        />
      </VStack>

      <DataRequestAddToCartButtons
        selectedItems={dataListState.selectedItems}
        onAddSelectedClick={() => {
          console.log("onAddSelectedClick");
        }}
        onAddAllClick={() => {
          console.log("onAddAllClick");
        }}
      />
    </VStack>
  );
};
