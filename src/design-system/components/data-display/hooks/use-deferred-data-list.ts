// src/design-system/components/data-display/hooks/use-deferred-data-list.ts

import type {
  UseDeferredDataListOptions,
  UseDeferredDataListReturn,
} from "@/design-system/components/data-display/types/data-list-deferred.type";
import { useDeferredValue } from "react";

/**
 * Hook to manage non-blocking deferred rendering for heavy `dataList` data sets.
 * Uses React 18+ `useDeferredValue` to keep UI responsive and transition cleanly
 * without locking up the main thread when navigating between routes or tabs.
 */
export const useDeferredDataList = <T = Record<string, unknown>>(
  options: UseDeferredDataListOptions<T>,
): UseDeferredDataListReturn<T> => {
  const { dataList } = options;

  const deferredDataList = useDeferredValue(dataList);
  const isProcessing = deferredDataList !== dataList;

  return {
    dataList: deferredDataList,
    isProcessing,
  };
};
