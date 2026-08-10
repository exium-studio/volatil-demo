// src/features/mitra/data-request/components/mitra.data-request.draw-aoi.tabs-content.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { WfsIgtFilterTrigger } from "@/features/mitra/data-request/components/wfs-igt-filter";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useMitraDrawAoi } from "@/features/mitra/data-request/hooks/use-mitra-draw-aoi";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import type { DrawAoiGuideAlertProps } from "@/features/mitra/data-request/types/mitra.data-request.draw-aoi.type";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { t } from "@/shared/libs/i18n";
import { IconPolygonOff } from "@tabler/icons-react";
import {
  CheckIcon,
  InfoIcon,
  PencilIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

export const MitraDataRequestDrawAoiTabsContent = memo(
  (props: TabsContentProps) => {
    // Hooks
    const {
      isDrawing,
      startDraw,
      cancelDraw,
      hasStartedDrawing,
      hasFinishedDraw,
      isError,
      error,
      isLoading,
      isDone,
      aoiCqlFilter,
      handleResetDraw,
      handleConfirmAndFetch,
    } = useMitraDrawAoi();

    return (
      <Tabs.Content
        display={"flex"}
        flex={1}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
        {...props}
      >
        {!isDone && !isLoading && (
          <>
            <GuideAlert
              isLoading={isLoading}
              isDrawing={isDrawing}
              hasFinishedDraw={hasFinishedDraw}
              isVisible={hasStartedDrawing}
            />

            <NoDataState
              description={
                "Tentukan area spesifik pada peta untuk mengambil data IGT."
              }
            >
              {!hasStartedDrawing && (
                <Button primary pl={3} onClick={startDraw}>
                  <AppIcon icon={PencilIcon} />
                  {"Mulai gambar"}
                </Button>
              )}

              {isDrawing && (
                <Button
                  variant={"outline"}
                  colorPalette={"red"}
                  pl={3}
                  onClick={cancelDraw}
                >
                  <AppIcon icon={XIcon} />
                  {"Batal gambar"}
                </Button>
              )}

              {hasFinishedDraw && (
                <HStack gap={SPACING_SM}>
                  <Button
                    variant={"outline"}
                    colorPalette={"red"}
                    pl={3}
                    onClick={handleResetDraw}
                  >
                    <AppIcon icon={IconPolygonOff} />
                    {"Hapus gambar"}
                  </Button>

                  <Button
                    primary
                    pl={3}
                    onClick={() =>
                      void handleConfirmAndFetch("igt:CONTOH_BIDANG_TANAH")
                    }
                  >
                    <AppIcon icon={CheckIcon} />
                    {"Konfirmasi & clip"}
                  </Button>
                </HStack>
              )}
            </NoDataState>

            <GuideAlert
              isLoading={isLoading}
              isDrawing={isDrawing}
              hasFinishedDraw={hasFinishedDraw}
              isVisible={false}
            />
          </>
        )}

        {isLoading && (
          <Box
            display={"flex"}
            flex={1}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <HStack align={"center"} gap={SPACING_SM}>
              <Loader />
              <P>{"Mengambil data IGT di area AOI Anda..."}</P>
            </HStack>
          </Box>
        )}

        {isError && (
          <VStack gap={SPACING_SM} p={PADDING_MD}>
            <P color={"fg.error"}>{error ?? "Terjadi kesalahan"}</P>
            <Button variant={"outline"} onClick={handleResetDraw}>
              {"Coba lagi"}
            </Button>
          </VStack>
        )}

        {isDone && aoiCqlFilter && (
          <DrawAoiDataList
            aoiCqlFilter={aoiCqlFilter}
            onResetDraw={handleResetDraw}
          />
        )}
      </Tabs.Content>
    );
  },
);

// -------------------------------------------------------------------------------------

const GuideAlert = (props: DrawAoiGuideAlertProps) => {
  // Props
  const {
    isLoading,
    isDrawing,
    hasFinishedDraw,
    isVisible = true,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Handlers / Utils
  const getAlertBg = () => {
    if (isLoading) return "bg.info";
    if (isDrawing) return "bg.warning";
    if (hasFinishedDraw) return "bg.success";
    return "bg.info";
  };

  const getAlertColor = () => {
    if (isLoading) return "fg.info";
    if (isDrawing) return "fg.warning";
    if (hasFinishedDraw) return "fg.success";
    return "fg.info";
  };

  const getGuideMessage = () => {
    if (isLoading) return "Mengambil data IGT di area AOI Anda...";
    if (isDrawing)
      return "Klik titik pada peta untuk menggambar. Klik titik pertama atau double-click untuk selesai.";
    if (hasFinishedDraw)
      return "Area berhasil digambar. Klik 'Konfirmasi & clip' untuk mengambil data, atau 'Hapus gambar' untuk menggambar ulang.";
    return "Klik 'Mulai gambar' lalu klik titik pada peta untuk menentukan batas area spesifik yang Anda inginkan.";
  };

  return (
    <VStack
      wrap={"wrap"}
      justify={"space-between"}
      gap={SPACING_MD}
      p={PADDING_MD}
      pb={0}
      visibility={isVisible ? "visible" : "hidden"}
      pointerEvents={isVisible ? "auto" : "none"}
      {...restProps}
    >
      <HStack
        align={"center"}
        gap={SPACING_MD}
        p={PADDING_MD}
        bg={getAlertBg()}
        rounded={theme.radii.container}
        color={getAlertColor()}
      >
        <AppIcon icon={InfoIcon} />
        <P>{getGuideMessage()}</P>
      </HStack>
    </VStack>
  );
};

// -------------------------------------------------------------------------------------

type DrawAoiDataListProps = {
  aoiCqlFilter: string;
  onResetDraw: () => void;
};

const DrawAoiDataList = memo((props: DrawAoiDataListProps) => {
  // Props
  const { aoiCqlFilter, onResetDraw } = props;

  // Hooks (Mutations)
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // States
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    selectedItems: [] as FormattedListItem[],
  });

  // Derived Values — Combine AOI INTERSECTS filter with 5-field filter
  const combinedCqlFilter = useMemo(() => {
    const filterCql = buildWfsCqlFilter(appliedFilters);
    return filterCql ? `${aoiCqlFilter} AND ${filterCql}` : aoiCqlFilter;
  }, [aoiCqlFilter, appliedFilters]);

  // Queries — server-side WFS pagination
  const {
    features,
    totalFeatures,
    bidangCount,
    kawasanCount,
    isLoading,
    isFetching,
  } = useIgtWfsCatalog({
    page: pageState.page,
    pageSize: pageState.pageSize,
    cqlFilter: combinedCqlFilter,
  });

  // const isLoading = true;

  return (
    <>
      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING_SM}
        >
          <HStack gap={SPACING_SM}>
            <SearchInput placeholder={t["action.search"]()} />

            <WfsIgtFilterTrigger
              onApply={(filters) => {
                setAppliedFilters(filters);
                setPageState((prev) => ({ ...prev, page: 1 }));
              }}
            >
              <IconButton variant={"outline"}>
                <AppIcon icon={SlidersHorizontalIcon} />
              </IconButton>
            </WfsIgtFilterTrigger>
          </HStack>

          <HStack gap={SPACING_SM} align={"center"}>
            <Button
              variant={"outline"}
              colorPalette={"red"}
              pl={3}
              onClick={onResetDraw}
            >
              <AppIcon icon={IconPolygonOff} />
              {"Hapus gambar"}
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <VStack
        flex={1}
        gap={PADDING_SM}
        overflowY={"auto"}
        bg={"bg.canvas"}
        position={"relative"}
      >
        {isLoading ? (
          <Skeleton p={PADDING_MD} />
        ) : (
          <>
            <TopBarLoader isFetching={isFetching} />

            <WfsIgtDataList
              wfsFeatures={features}
              page={pageState.page}
              pageSize={pageState.pageSize}
              totalFeatures={totalFeatures}
              setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
              setPageSize={(pageSize) =>
                setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
              }
              onSelectedItemChange={({ selectedItems }) =>
                setPageState((prev) => ({ ...prev, selectedItems }))
              }
            />

            <MitraDataRequestAddToCartButtons
              selectedItems={pageState.selectedItems}
              allItems={features}
              totalBidangCount={bidangCount}
              totalKawasanCount={kawasanCount}
              totalCount={totalFeatures}
              onAddAllBidangClick={() => {
                addToCartAllMutation.mutate({
                  source: "draw_aoi",
                  targetBasis: "bidang",
                });
              }}
              onAddAllKawasanClick={() => {
                addToCartAllMutation.mutate({
                  source: "draw_aoi",
                  targetBasis: "kawasan",
                });
              }}
              onAddAllBothClick={() => {
                addToCartAllMutation.mutate({
                  source: "draw_aoi",
                  targetBasis: "all",
                });
              }}
              onAddSelectedClick={() => {
                const selectedIds = pageState.selectedItems.map((item) =>
                  String(item.id),
                );
                addToCartSelectedMutation.mutate({ itemIds: selectedIds });
              }}
              mt={"auto"}
            />
          </>
        )}
      </VStack>
    </>
  );
});
