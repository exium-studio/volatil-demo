// src/design-system/components/data-display/ui/data-list-footer.tsx

import type { DataListFooterProps } from "@/design-system/components/data-display/types/data-list.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { DataListPagination } from "./data-list-pagination";
import { DataListPageSize } from "./data-list-page-size";
import { PADDING } from "@/design-system/constants/styles";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";

const formatDataLengthText = (_?: number, totalData?: number) => {
  // const current = currentDataLength != null ? String(currentDataLength) : "?";
  return `Total ${totalData ? formatNumber(totalData) : "?"}`;
};

export const DataListFooter = (props: DataListFooterProps) => {
  // Props
  const {
    currentDataLength,
    totalData,
    pageSize,
    setPageSize,
    page,
    setPage,
    totalPage,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  const dataLengthText = formatDataLengthText(currentDataLength, totalData);

  return (
    <VStack
      justify={"center"}
      gap={2}
      w={"full"}
      p={PADDING.md}
      zIndex={4}
      bg={"bg.body"}
      roundedBottom={theme.radii.container}
      shadow={"sm"}
      {...restProps}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={["center", null, "space-between"]}
        gapX={4}
        gapY={1}
        w={"full"}
      >
        <HStack align="start">
          <DataListPageSize
            pageSize={pageSize}
            setPageSize={setPageSize}
            size={"xs"}
          />
        </HStack>

        <HStack
          align={"center"}
          justify={"center"}
          gapX={3}
          px={["10px", null, 0]}
        >
          <P color={"fg.subtle"} whiteSpace={"nowrap"} textAlign={"center"}>
            {dataLengthText}
          </P>

          <DataListPagination
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            size={"xs"}
          />
        </HStack>
      </HStack>
    </VStack>
  );
};
