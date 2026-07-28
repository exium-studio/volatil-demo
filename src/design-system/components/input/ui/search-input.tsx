// src/design-system/components/input/ui/search-input.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SearchInputProps } from "@/design-system/components/input/types/search-input.type";
import { Input } from "@/design-system/components/input/ui/input";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { InputGroup } from "@chakra-ui/react";
import { SearchIcon, XIcon } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SeachInput(
    {
      queryKey,
      value: controlledValue,
      onValueChange,
      w,
      inputGroupProps,
      appIconProps,
      ...restProps
    },
    ref,
  ) {
    // Refs
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Hooks
    const { queryValue, setQueryValue, clearQueryValue } = useSearchParam(
      queryKey ?? "",
    );
    const isUrlMode = !!queryKey;

    // Constants
    const ml = {
      "2xs": -2,
      xs: -1,
      sm: -1,
      md: 0,
      lg: 0,
      xl: 1,
      "2xl": 1,
    };

    // States
    const [value, setValue] = useState<string>(
      isUrlMode ? (queryValue ?? "") : (controlledValue ?? ""),
    );

    // Sync state with controlledValue prop
    useEffect(() => {
      if (!isUrlMode && controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue, isUrlMode]);

    // Sync state with queryValue URL param
    useEffect(() => {
      if (isUrlMode) {
        setValue(queryValue ?? "");
      }
    }, [queryValue, isUrlMode]);

    // Handlers
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const next = e.currentTarget.value;
      setValue(next);
      if (isUrlMode) {
        setQueryValue(next);
      }
      onValueChange?.(next);
    }

    function handleClear() {
      setValue("");
      if (isUrlMode) {
        clearQueryValue();
      }
      onValueChange?.("");
      internalRef.current?.focus();
    }

    return (
      <InputGroup
        startElement={
          <AppIcon
            icon={SearchIcon}
            ml={ml[restProps.size as keyof typeof ml]}
            {...appIconProps}
          />
        }
        endElement={
          value ? (
            <IconButton size={"xs"} onClick={handleClear} me={-2}>
              <AppIcon icon={XIcon} />
            </IconButton>
          ) : undefined
        }
        w={w || "fit"}
        {...inputGroupProps}
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
