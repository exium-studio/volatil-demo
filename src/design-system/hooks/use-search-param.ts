// src/design-system/hooks/use-search-param.ts

import { useNavigate, useSearch } from "@tanstack/react-router";

export function useSearchParam<ValueType extends string = string>(
  queryKey?: string,
  validValues?: readonly ValueType[],
) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isUrlMode = queryKey !== undefined;
  const rawValue = isUrlMode ? (search?.[queryKey] ?? "") : "";

  const queryValue: ValueType | undefined = isUrlMode
    ? validValues
      ? validValues.includes(rawValue as ValueType)
        ? (rawValue as ValueType)
        : undefined
      : (rawValue as ValueType)
    : undefined;

  function setQueryValue(next: ValueType) {
    if (!queryKey) return;
    navigate({
      to: ".",
      search: (prev) => {
        const updated = { ...prev } as Record<string, unknown>;
        if (next) {
          updated[queryKey] = next;
        } else {
          delete updated[queryKey];
        }
        return updated;
      },
      replace: true,
    });
  }

  function clearQueryValue() {
    setQueryValue("" as ValueType);
  }

  return { isUrlMode, queryValue, setQueryValue, clearQueryValue };
}
