import type { DataViewFooterProps } from "@/design-system/components/data-display/types/data-view-footer.type";
import { DataViewPageSize } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewPagination } from "@/design-system/components/data-display/ui/data-view-pagination";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";

const formatDataLengthText = (_?: number, totalData?: number) => {
  // const current = currentDataLength != null ? String(currentDataLength) : "?";
  return `Total ${totalData ? formatNumber(totalData) : "?"}`;
};

export const DataViewFooter = (props: DataViewFooterProps) => {
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
      p={"md"}
      zIndex={4}
      bg={"bg.body"}
      roundedBottom={theme.radii.container}
      {...restProps}
    >
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gapX={4}
        gapY={1}
        w={"full"}
      >
        <HStack align="start">
          <DataViewPageSize
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

          <DataViewPagination
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
