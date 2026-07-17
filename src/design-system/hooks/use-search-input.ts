// src/design-system/hooks/use-search.ts
import MiniSearch from "minisearch";
import { useMemo, useState } from "react";
import type {
  SearchIndex,
  SearchIndexItem,
} from "@/design-system/types/search.type";

const RECENT_KEY = "search:recent";
const MAX_RECENT = 5;

function loadRecent(queryKey: string): string[] {
  try {
    return JSON.parse(
      localStorage.getItem(`${RECENT_KEY}:${queryKey}`) ?? "[]",
    );
  } catch {
    return [];
  }
}

function saveRecent(queryKey: string, ids: string[]) {
  localStorage.setItem(`${RECENT_KEY}:${queryKey}`, JSON.stringify(ids));
}

export function useSearch<T>(
  queryKey: string,
  query: string,
  index: SearchIndex<T>,
) {
  const [recentIds, setRecentIds] = useState<string[]>(() =>
    loadRecent(queryKey),
  );

  const miniSearch = useMemo(() => {
    const ms = new MiniSearch<SearchIndexItem<T>>({
      fields: ["title", "description", "keywords"],
      storeFields: ["title", "description", "data"],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
    ms.addAll(index);
    return ms;
  }, [index]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return miniSearch.search(query) as unknown as (SearchIndexItem<T> & {
      score: number;
    })[];
  }, [miniSearch, query]);

  const recentResults = useMemo(() => {
    return recentIds
      .map((id) => index.find((item) => item.id === id))
      .filter(Boolean) as SearchIndexItem<T>[];
  }, [recentIds, index]);

  function addRecent(id: string) {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENT);
      saveRecent(queryKey, next);
      return next;
    });
  }

  function clearRecent(id: string) {
    setRecentIds((prev) => {
      const next = prev.filter((r) => r !== id);
      saveRecent(queryKey, next);
      return next;
    });
  }

  function clearAllRecent() {
    setRecentIds([]);
    saveRecent(queryKey, []);
  }

  return {
    recentResults,
    addRecent,
    clearRecent,
    clearAllRecent,
    results,
  };
}
