// src/design-system/components/overlay/ui/focus-search.tsx

import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { VScrollContainer } from "@/design-system/components/layout/ui/scroll-container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import type {
  FocusSearchResultItemProps,
  FocusSearchTriggerProps,
} from "@/design-system/components/overlay/types/focus-search.type";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Kbd } from "@/design-system/components/typography/ui/kbd";
import { P } from "@/design-system/components/typography/ui/p";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useSearchInput } from "@/design-system/hooks/use-search-input";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type {
  SearchIndex,
  SearchIndexItem,
} from "@/design-system/types/search.type";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type KeyboardEvent,
} from "react";

type FocusTriggerContextValue = {
  modalKey: string;
  queryKey: string;
  searchIndex: SearchIndex;
  onResultSelect?: (result: SearchIndexItem) => void;
};

const FocusTriggerContext = createContext<FocusTriggerContextValue | undefined>(
  undefined,
);

const useFocusTriggerContext = () => {
  const context = useContext(FocusTriggerContext);
  if (!context)
    throw new Error(
      "useFocusTriggerContext must be used within FocusSearch.Root",
    );
  return context;
};

// ---------------------------------------------------------------------------

export const FocusSearchTrigger = <T,>(props: FocusSearchTriggerProps<T>) => {
  // Props
  const { children, modalKey, queryKey, searchIndex, onResultSelect } = props;

  // Hooks
  const { isOpen, open, close } = usePopModal({
    modalKey,
  });

  return (
    <FocusTriggerContext.Provider
      value={{
        modalKey,
        queryKey,
        searchIndex: searchIndex as SearchIndex,
        onResultSelect: onResultSelect as
          | ((result: SearchIndexItem) => void)
          | undefined,
      }}
    >
      <Modal.Root
        modalKey={modalKey}
        opened={isOpen}
        open={open}
        close={close}
        size={"sm"}
      >
        <Modal.Trigger>{children}</Modal.Trigger>

        <Modal.Content>
          <Modal.Body display="flex" flexDir="column" p={0}>
            <FocusSearchBody />
          </Modal.Body>

          <Modal.Footer borderTop="1px solid" borderColor="border.subtle">
            <FocusSearchFooter />
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </FocusTriggerContext.Provider>
  );
};

const FocusSearchResultItem = (
  props: FocusSearchResultItemProps & { isSelected?: boolean },
) => {
  // Props
  const {
    result,
    onResultSelect,
    idx,
    selectedIdx,
    setSelectedIdx,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const isSelected = idx === selectedIdx;

  // Scroll selected item into view
  useEffect(() => {
    if (isSelected) {
      const el = document.getElementById(`focus-search-item-${result.id}`);
      if (el) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [isSelected, result.id]);

  return (
    <VStack
      id={`focus-search-item-${result.id}`}
      gap={2}
      rounded={theme.radii.component}
      p={4}
      cursor="pointer"
      transition="200ms"
      bg={isSelected ? "bg.subtle" : undefined}
      _hover={{ bg: "bg.subtle" }}
      onClick={() => onResultSelect?.(result)}
      onMouseEnter={() => {
        setSelectedIdx(idx);
      }}
      {...restProps}
    >
      <P>{result.title}</P>
      <P color="fg.subtle">{result.description}</P>
    </VStack>
  );
};

const FocusSearchBody = () => {
  const { queryKey, searchIndex, onResultSelect } = useFocusTriggerContext();
  const { queryValue } = useSearchParam(queryKey);
  const [query, setQuery] = useState<string>(queryValue ?? "");

  const { results, recentResults, addRecent, clearAllRecent } = useSearchInput(
    queryKey,
    query,
    searchIndex,
  );

  const hasQuery = !!query.trim();

  const items = hasQuery ? results : recentResults;
  const [selectedIdx, setSelectedIdx] = useState(0);

  function handleValueChange(value: string) {
    setQuery(value);
    setSelectedIdx(0);
  }

  function handleSelect(result: SearchIndexItem) {
    setTimeout(() => {
      addRecent(result.id);
    }, 200);
    onResultSelect?.(result);
    back();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = items[selectedIdx];
      if (current) handleSelect(current);
    }
  };

  // function handleClearRecent(result: SearchIndexItem) {
  //   clearRecent(result.id);
  // }

  return (
    <VStack gap={2} overflowY={"auto"} py={2}>
      <HStack px={2}>
        <SearchInput
          queryKey={queryKey}
          placeholder={t["settings.search.placeholder"]()}
          onValueChange={handleValueChange}
          w={"full"}
          autoFocus={true}
          onKeyDown={handleKeyDown}
        />
      </HStack>

      <VScrollContainer h={"350px"} px={2}>
        {!hasQuery && (
          <>
            {isEmptyArray(recentResults) && (
              <FeedbackState
                title={t["settings.search.empty.title"]()}
                description={t["settings.search.empty.description"]()}
              />
            )}

            {!isEmptyArray(recentResults) && (
              <>
                <HStack justify="space-between" px={4} mt={2} mb={1}>
                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {t["common.recent"]()}
                  </P>

                  <P
                    fontSize={"sm"}
                    color={"fg.subtle"}
                    cursor={"pointer"}
                    onClick={clearAllRecent}
                  >
                    {t["common.clear_all"]()}
                  </P>
                </HStack>

                <VStack gap={1}>
                  {items.map((result, idx) => (
                    <FocusSearchResultItem
                      key={result.id}
                      result={result}
                      onResultSelect={handleSelect}
                      idx={idx}
                      selectedIdx={selectedIdx}
                      setSelectedIdx={setSelectedIdx}
                    />
                  ))}
                </VStack>
              </>
            )}
          </>
        )}

        {hasQuery && (
          <>
            {isEmptyArray(results) && <NoResultState query={query} />}

            {!isEmptyArray(results) && (
              <VStack gap={1}>
                {items.map((result, idx) => (
                  <FocusSearchResultItem
                    key={result.id}
                    result={result}
                    onResultSelect={handleSelect}
                    idx={idx}
                    selectedIdx={selectedIdx}
                    setSelectedIdx={setSelectedIdx}
                  />
                ))}
              </VStack>
            )}
          </>
        )}
      </VScrollContainer>
    </VStack>
  );
};

const FocusSearchFooter = () => (
  <HStack align="center" gap={4}>
    <HStack align="center" gap={2}>
      <Kbd fontSize={"sm"}>↑</Kbd>
      <Kbd fontSize={"sm"}>↓</Kbd>

      <P fontSize="xs" color="fg.subtle">
        {t["common.navigate"]()}
      </P>
    </HStack>

    <HStack align="center" gap={2}>
      <Kbd fontSize={"sm"}>↵</Kbd>

      <P fontSize="xs" color="fg.subtle">
        {t["common.select"]()}
      </P>
    </HStack>

    <HStack align="center" gap={2}>
      <Kbd>Esc</Kbd>

      <P fontSize="xs" color="fg.subtle">
        {t["common.close"]()}
      </P>
    </HStack>
  </HStack>
);
