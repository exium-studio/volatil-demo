// src/design-system/components/data-display/ui/data-list-per-page.tsx

import type { DataListPerPageProps } from "@/design-system/components/data-display/types/data-list.type";
import Select from "@/design-system/components/input/ui/select";
import { Span } from "@/design-system/components/typography/ui/span";

const DEFAULT_PER_PAGE_OPTIONS = [20, 40, 60, 100];

export const DataListPerPage = (props: DataListPerPageProps) => {
  // Props
  const {
    perPage,
    setPerPage,
    options = DEFAULT_PER_PAGE_OPTIONS,
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
      defaultValue={[String(perPage)]}
      selectOptions={selectOptions}
      onSelect={(selectedOption) => {
        setPerPage?.(parseInt(selectedOption?.value));
      }}
      suffixLabel={<Span ml={1}>/page</Span>}
      variant={"ghost"}
      minW={"120px"}
      {...restProps}
    />
  );
};
