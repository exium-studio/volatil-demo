// src/design-system/components/data-display/types/data-list-deferred.type.ts

import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-list-table.type";

export type DataListConfig<T = Record<string, unknown>> = {
  headers: FormattedTableHeader[];
  items: FormattedListItem<T>[];
  batchActions?: DataListBatchActionsGenerator[];
  itemActions?: DataListItemActionsGenerator<T>[];
};

export type UseDeferredDataListOptions<T = Record<string, unknown>> = {
  dataList: DataListConfig<T>;
};

export type UseDeferredDataListReturn<T = Record<string, unknown>> = {
  dataList: DataListConfig<T>;
  isProcessing: boolean;
};
