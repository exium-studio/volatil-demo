// src/design-system/components/input/ui/search-input.tsx

"use client";

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SearchInputProps } from "@/design-system/components/input/types/search-input.type";
import { Input } from "@/design-system/components/input/ui/input";
import { useFocusSearch } from "@/design-system/hooks/use-focus-search";
import { InputGroup } from "@chakra-ui/react";
import { SearchIcon, XIcon } from "lucide-react";
import { forwardRef, useRef, useState, type ChangeEvent } from "react";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { queryKey, value: controlledValue, onValueChange, w, ...restProps },
    ref,
  ) => {
    // Refs
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Hooks
    const { isUrlMode, queryValue, setQueryValue, clearQueryValue } =
      useFocusSearch(queryKey);

    // States
    const [value, setValue] = useState<string>(
      isUrlMode ? (queryValue ?? "") : (controlledValue ?? ""),
    );

    // Handlers
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
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
        startElement={<AppIcon icon={SearchIcon} />}
        endElement={
          value ? (
            <IconButton size="xs" onClick={handleClear} me="-2">
              <AppIcon icon={XIcon} />
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
