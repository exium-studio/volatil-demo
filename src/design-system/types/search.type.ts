// src/design-system/types/search.type.ts

import type MiniSearch from "minisearch";

export type SearchIndexItem<T = Record<string, unknown>> = {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  data?: T;
};

export type SearchIndex<T = Record<string, unknown>> = SearchIndexItem<T>[];

export type SearchOptions = ConstructorParameters<typeof MiniSearch>[0];
