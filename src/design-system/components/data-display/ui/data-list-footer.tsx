// src/design-system/components/data-display/ui/data-list-footer.tsx

import { HStack, VStack } from "@/design-system/components/layout/ui/stack";
import { P } from "@/design-system/components/typography/ui/p";
import { DataListPerPage } from "./data-list-per-page";
import { DataListPagination } from "./data-list-pagination";
import type { DataListFooterProps } from "../types/data-list.type";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

const formatDataLengthText = (
  currentDataLength?: number,
  totalData?: number,
) => {
  const current = currentDataLength != null ? String(currentDataLength) : "?";
  const total = totalData != null ? String(totalData) : "?";
  return `${current} / ${total} items`;
};

export const DataListFooter = (props: DataListFooterProps) => {
  // Props
  const {
    currentDataLength,
    totalData,
    perPage,
    setPerPage,
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
      p={3}
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
          <DataListPerPage
            perPage={perPage}
            setPerPage={setPerPage}
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
