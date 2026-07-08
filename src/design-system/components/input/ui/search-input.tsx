// src/design-system/components/input/ui/search-input.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppTablerIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SearchInputProps } from "@/design-system/components/input/types/search-input.type";
import { Input } from "@/design-system/components/input/ui/input";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { InputGroup } from "@chakra-ui/react";
import { IconSearch, IconX } from "@tabler/icons-react";
import { forwardRef, useRef, useState } from "react";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { queryKey, value: controlledValue, onValueChange, w, ...restProps },
    ref,
  ) => {
    // Refs
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Hooks
    const { isUrlMode, queryValue, setQueryValue, clearQueryValue } =
      useSearchParam(queryKey);

    // States
    const [value, setValue] = useState<string>(
      isUrlMode ? (queryValue ?? "") : (controlledValue ?? ""),
    );

    // Handlers
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const next = e.currentTarget.value;
      setValue(next);
      setQueryValue(next);
      onValueChange?.(next);
    }

    function handleClear() {
      setValue("");
      clearQueryValue();
      onValueChange?.("");
      internalRef.current?.focus();
    }

    return (
      <InputGroup
        startElement={<AppTablerIcon icon={IconSearch} />}
        endElement={
          value ? (
            <IconButton size="xs" onClick={handleClear} me="-2">
              <AppTablerIcon icon={IconX} />
            </IconButton>
          ) : undefined
        }
        w={w || "fit"}
      >
        <Input
          {...restProps}
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          value={value}
          onChange={handleChange}
        />
      </InputGroup>
    );
  },
);

SearchInput.displayName = "SearchInput";
