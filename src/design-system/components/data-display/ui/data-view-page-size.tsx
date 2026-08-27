// src/design-system/components/data-display/ui/data-list-page-size.tsx

import type { DataViewPageSizeProps } from "@/design-system/components/data-display/types/data-view.type";
import Select from "@/design-system/components/input/ui/select";
import { Span } from "@/design-system/components/typography/ui/span";

export const DEFAULT_PAGE_SIZE_OPTIONS = [20, 40, 60, 100];

export const DataViewPageSize = (props: DataViewPageSizeProps) => {
  // Props
  const {
    pageSize,
    setPageSize,
    options = DEFAULT_PAGE_SIZE_OPTIONS,
    ...restProps
  } = props;

  const selectOptions = options.map((option) => {
    return {
      label: `${option}`,
      value: String(option),
    };
  });

  return (
    <Select
      value={String(pageSize)}
      selectOptions={selectOptions}
      onValueChange={(val) => {
        setPageSize?.(parseInt(val, 10));
      }}
      suffixLabel={<Span ml={1}>{"/page"}</Span>}
      variant={"ghost"}
      minW={"120px"}
      {...restProps}
    />
  );
};
