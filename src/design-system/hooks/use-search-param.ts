// src/design-system/hooks/use-search-param.ts

import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export function useSearchParam<ValueType extends string = string>(
  queryKey: string,
  validValues?: readonly ValueType[],
) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;

  const rawValue = search?.[queryKey] ?? "";

  const queryValue: ValueType | undefined = rawValue
    ? validValues
      ? validValues.includes(rawValue as ValueType)
        ? (rawValue as ValueType)
        : undefined
      : (rawValue as ValueType)
    : undefined;

  const setQueryValue = useCallback(
    (next: ValueType | undefined) => {
      navigate({
        to: ".",
        search: (prev) => {
          const updated = { ...prev } as Record<string, unknown>;
          if (next !== undefined && next !== "") {
            updated[queryKey] = next;
          } else {
            delete updated[queryKey];
          }
          return updated;
        },
        replace: true,
      });
    },
    [queryKey, navigate],
  );

  const clearQueryValue = useCallback(() => {
    setQueryValue(undefined);
  }, [setQueryValue]);

  return { queryValue, setQueryValue, clearQueryValue };
}
