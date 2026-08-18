// src/design-system/components/data-display/hooks/use-deferred-data-list.ts

import type {
  UseDeferredDataListOptions,
  UseDeferredDataListReturn,
} from "@/design-system/components/data-display/types/data-list-deferred.type";
import { useEffect, useState, useDeferredValue } from "react";

/**
 * Hook to manage non-blocking deferred rendering for heavy `dataList` data sets.
 * Uses React 18+ `useDeferredValue` and configurable timeout delay (`delayMs = 100` by default)
 * to keep UI responsive and transition cleanly without locking up the main thread.
 */
export const useDeferredDataList = <T = Record<string, unknown>>(
  options: UseDeferredDataListOptions<T>,
): UseDeferredDataListReturn<T> => {
  const { dataList, delayMs = 100 } = options;

  const deferredDataList = useDeferredValue(dataList);
  const [delayedDataList, setDelayedDataList] = useState(dataList);
  const [isDelaying, setIsDelaying] = useState<boolean>(false);

  useEffect(() => {
    if (delayMs <= 0) return;

    const timer = setTimeout(() => {
      setDelayedDataList(dataList);
      setIsDelaying(false);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [dataList, delayMs]);

  if (delayMs > 0) {
    const isProcessing = isDelaying || delayedDataList !== dataList;
    return {
      dataList: isProcessing ? delayedDataList : dataList,
      isProcessing,
    };
  }

  const isProcessing = deferredDataList !== dataList;

  return {
    dataList: deferredDataList,
    isProcessing,
  };
};
