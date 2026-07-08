// src/design-system/components/data-display/ui/data-list-pagination.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { LucideIcon } from "@/design-system/components/icon/ui/lucide-icon";
import { HStack } from "@/design-system/components/layout/ui/stack";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { DataListPaginationProps } from "../types/data-list.type";

export const DataListPagination = (props: DataListPaginationProps) => {
  // Props
  const { page, setPage, totalPage, ...restProps } = props;

  // Derived Values
  const canGoPrev = page > 1;
  const canGoNext = totalPage ? page < totalPage : true;

  return (
    <HStack align="center" gap={2}>
      <IconButton
        variant={"ghost"}
        disabled={!canGoPrev}
        onClick={() => setPage?.(page - 1)}
        {...restProps}
      >
        <LucideIcon icon={ChevronLeftIcon} />
      </IconButton>

      <P whiteSpace={"nowrap"}>
        <TNum>{page}</TNum>
      </P>

      <IconButton
        variant={"ghost"}
        size={"xs"}
        disabled={!canGoNext}
        onClick={() => setPage?.(page + 1)}
        {...restProps}
      >
        <LucideIcon icon={ChevronRightIcon} />
      </IconButton>
    </HStack>
  );
};
