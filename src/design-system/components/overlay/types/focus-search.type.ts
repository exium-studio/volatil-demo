// src/design-system/components/overlay/types/focus-search.type.ts

import type {
  SearchIndex,
  SearchIndexItem,
} from "@/design-system/types/search.type";
import type { StackProps } from "@chakra-ui/react";

export type FocusSearchTriggerProps<T> = {
  children: React.ReactNode;
  modalKey: string;
  queryKey: string;
  searchIndex: SearchIndex<T>;
  onResultSelect?: (result: SearchIndexItem<T>) => void;
};

export type FocusSearchResultItemProps = {
  result: SearchIndexItem;
  onResultSelect?: (result: SearchIndexItem) => void;
  idx: number;
  selectedIdx: number;
  setSelectedIdx: (idx: number) => void;
} & StackProps;
