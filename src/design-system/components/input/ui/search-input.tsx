// src/design-system/components/input/ui/search-input.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { SearchInputProps } from "@/design-system/components/input/types/search-input.type";
import { Input } from "@/design-system/components/input/ui/input";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { InputGroup } from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      queryKey,
      value: controlledValue,
      debounceMs = 300,
      onValueChange,
      onChange,
      w,
      inputGroupProps,
      appIconProps,
      ...restProps
    },
    ref,
  ) {
    // Refs
    const internalRef = useRef<HTMLInputElement | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const initialValue = isUrlMode
      ? (queryValue ?? "")
      : (controlledValue ?? (restProps.defaultValue as string) ?? "");
    const [value, setValue] = useState<string>(initialValue);
    const [prevControlledValue, setPrevControlledValue] =
      useState<string | undefined>(controlledValue);
    const [prevQueryValue, setPrevQueryValue] = useState<string | undefined>(
      queryValue,
    );

    // Derived State Synchronization during render (no useEffect setState anti-pattern)
    if (
      !isUrlMode &&
      controlledValue !== undefined &&
      controlledValue !== prevControlledValue
    ) {
      setPrevControlledValue(controlledValue);
      setValue(controlledValue);
    }

    if (isUrlMode && queryValue !== prevQueryValue) {
      setPrevQueryValue(queryValue);
      setValue(queryValue ?? "");
    }

    // Effects — Cleanup debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Handlers
    function triggerDebouncedChange(next: string) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (debounceMs <= 0) {
        if (isUrlMode) {
          setQueryValue(next);
        }
        onValueChange?.(next);
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        if (isUrlMode) {
          setQueryValue(next);
        }
        onValueChange?.(next);
      }, debounceMs);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const next = e.currentTarget.value;
      setValue(next);
      onChange?.(e);
      triggerDebouncedChange(next);
    }

    function handleClear() {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
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
            <IconButton
              variant={"plain"}
              size={"xs"}
              onClick={handleClear}
              me={-2}
            >
              <AppIcon icon={DeleteIcon} />
            </IconButton>
          ) : undefined
        }
        w={w || "fit"}
        minW={restProps.minW ?? "200px"}
        flexShrink={0}
        {...inputGroupProps}
      >
        <Input
          {...restProps}
          minW={restProps.minW ?? "200px"}
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
