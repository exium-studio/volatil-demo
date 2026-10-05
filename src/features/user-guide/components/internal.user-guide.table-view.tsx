// src/features/user-guide/components/internal.user-guide.table-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import {
  USER_GUIDE_CATEGORY_MAP,
  USER_GUIDE_CATEGORY_OPTIONS,
  USER_GUIDE_PUBLISH_STATUS_OPTIONS,
  USER_GUIDE_TARGET_ROLE_MAP,
} from "@/features/user-guide/constants/user-guide.constants";
import { UserGuideFormModal } from "@/features/user-guide/components/user-guide.form-modal";
import {
  useDeleteUserGuideMutation,
  useTogglePublishUserGuideMutation,
  useTrackDownloadUserGuideMutation,
} from "@/features/user-guide/hooks/use-user-guide.mutations";
import { useUserGuidesQuery } from "@/features/user-guide/hooks/use-user-guides.query";
import type {
  InternalUserGuideTableViewProps,
  UserGuideItem,
  UserGuideQueryParams,
} from "@/features/user-guide/types/user-guide.type";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatUtcDateTime } from "@/shared/utils/formatter/date.formatter";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import {
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export const InternalUserGuideTableView = (
  props: InternalUserGuideTableViewProps,
) => {
  // Props
  const {
    initialLimit = DEFAULT_PAGE_SIZE_OPTIONS[0],
    showPagination = true,
    showFilters = true,
    roundedTop,
  } = props;

  // States — Centralized query parameters
  const [params, setParams] = useState<UserGuideQueryParams>({
    page: 1,
    limit: initialLimit,
    search: "",
    category: undefined,
    isPublished: undefined,
  });

  const [selectedGuideForEdit, setSelectedGuideForEdit] =
    useState<UserGuideItem | null>(null);

  // Queries & Mutations
  const {
    guides: rawItems,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useUserGuidesQuery(params);

  const deleteMutation = useDeleteUserGuideMutation();
  const togglePublishMutation = useTogglePublishUserGuideMutation();
  const trackDownloadMutation = useTrackDownloadUserGuideMutation();

  // Derived Values
  const isSearching = Boolean(params.search?.trim());
  const searchQuery = params.search?.trim() || "...";

  // Handlers
  const handleDownload = useCallback(
    (guide: UserGuideItem) => {
      trackDownloadMutation.mutate(guide.id);
      const link = document.createElement("a");
      link.href = guide.fileUrl;
      link.download = guide.fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [trackDownloadMutation],
  );

  const handleOpenEdit = useCallback((guide: UserGuideItem) => {
    setSelectedGuideForEdit(guide);
  }, []);

  // DataList Table Pattern: Wajib 1 useMemo implicit return
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "Judul & Berkas Dokumen", sortable: true },
        { th: "Kategori", sortable: true },
        { th: "Target Pengguna", sortable: true },
        { th: "Versi & Ukuran", sortable: true },
        { th: "Status Publikasi", sortable: true },
        { th: "Unduhan", sortable: true, align: "center" },
        { th: "Terakhir Diperbarui", sortable: true },
      ] as FormattedTableHeader[],

      items: rawItems.map((item) => {
        const catMeta =
          USER_GUIDE_CATEGORY_MAP[item.category] ??
          USER_GUIDE_CATEGORY_MAP.general;
        const roleMeta =
          USER_GUIDE_TARGET_ROLE_MAP[item.targetRole] ??
          USER_GUIDE_TARGET_ROLE_MAP.all;

        return {
          id: item.id,
          data: item,
          columns: [
            // 1. Judul & Berkas
            {
              value: item.title,
              td: (
                <HStack gap={"sm"} align={"start"} maxW={"360px"}>
                  <Center
                    p={"xs"}
                    bg={`${catMeta.colorPalette}.subtle`}
                    rounded={"sm"}
                    flexShrink={0}
                    mt={"2xs"}
                  >
                    <AppIcon
                      icon={FileTextIcon}
                      boxSize={4}
                      color={`${catMeta.colorPalette}.fg`}
                    />
                  </Center>

                  <VStack align={"start"} gap={0}>
                    <ClampedP fontWeight={"medium"} lineClamp={1}>
                      {item.title}
                    </ClampedP>

                    <ClampedP color={"fg.subtle"} lineClamp={1}>
                      {item.fileName}
                    </ClampedP>
                  </VStack>
                </HStack>
              ),
              align: "start" as const,
            },

            // 2. Kategori
            {
              value: catMeta.label,
              td: (
                <Badge
                  variant={"subtle"}
                  colorPalette={catMeta.colorPalette}
                >
                  {catMeta.label}
                </Badge>
              ),
              align: "start" as const,
            },

            // 3. Target Pengguna
            {
              value: roleMeta.label,
              td: (
                <Badge
                  variant={"outline"}
                  colorPalette={roleMeta.colorPalette}
                >
                  {roleMeta.label}
                </Badge>
              ),
              align: "start" as const,
            },

            // 4. Versi & Ukuran
            {
              value: item.version,
              td: (
                <VStack align={"start"} gap={0}>
                  <P fontWeight={"medium"}>
                    {item.version}
                  </P>
                  <P color={"fg.subtle"}>
                    {formatByte(item.fileSize)}
                  </P>
                </VStack>
              ),
              align: "start" as const,
            },

            // 5. Status Publikasi
            {
              value: item.isPublished ? "Dipublikasikan" : "Draf",
              td: (
                <HStack align={"center"} gap={"xs"}>
                  <Switch
                    checked={item.isPublished}
                    onCheckedChange={(e) => {
                      togglePublishMutation.mutate({
                        id: item.id,
                        isPublished: Boolean(e.checked),
                      });
                    }}
                    tooltip={
                      item.isPublished
                        ? "Klik untuk ubah ke Draf"
                        : "Klik untuk Publikasikan"
                    }
                  />
                  <Badge
                    colorPalette={item.isPublished ? "green" : "gray"}
                  >
                    {item.isPublished ? "Publik" : "Draf"}
                  </Badge>
                </HStack>
              ),
              align: "start" as const,
            },

            // 6. Unduhan
            {
              value: item.downloadCount,
              td: (
                <P color={"fg.muted"} textAlign={"center"}>
                  {`${item.downloadCount.toLocaleString("id-ID")}x`}
                </P>
              ),
              align: "center" as const,
            },

            // 7. Terakhir Diperbarui
            {
              value: item.updatedAt,
              td: (
                <P color={"fg.subtle"} whiteSpace={"nowrap"}>
                  {formatUtcDateTime(item.updatedAt)}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),

      batchActions: [],

      itemActions: [
        {
          key: "download-guide",
          label: "Unduh Berkas",
          icon: DownloadIcon,
          onClick: (item: UserGuideItem) => handleDownload(item),
        },
        {
          key: "preview-guide",
          label: "Pratinjau di Tab Baru",
          icon: ExternalLinkIcon,
          onClick: (item: UserGuideItem) =>
            window.open(item.fileUrl, "_blank", "noopener,noreferrer"),
        },
        {
          key: "edit-guide",
          label: "Edit Dokumen",
          icon: PencilIcon,
          onClick: (item: UserGuideItem) => handleOpenEdit(item),
        },
        {
          key: "delete-guide",
          label: "Hapus Dokumen",
          icon: Trash2Icon,
          colorPalette: "red",
          modal: {
            triggerComponent: (item: UserGuideItem) => (
              <ConfirmationTrigger
                modalKey={`delete-guide-${item.id}`}
                title={"Hapus Dokumen Panduan"}
                description={`Apakah Anda yakin ingin menghapus dokumen "${item.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel={"Hapus Dokumen"}
                colorPalette={"red"}
                onConfirm={() => {
                  deleteMutation.mutate(item.id);
                }}
              />
            ),
          },
        },
      ] as DataViewItemActionsGenerator<UserGuideItem>[],
    }),
    [
      rawItems,
      deleteMutation,
      togglePublishMutation,
      handleDownload,
      handleOpenEdit,
    ],
  );

  const isEmpty = isEmptyArray(rawItems);
  const isNoData = !isLoading && !isError && isEmpty && !isSearching;
  const isNoResult = !isLoading && !isError && isEmpty && isSearching;

  return (
    <>
      <TopBarLoader isFetching={isFetching} />

      {/* Filters & Actions Bar */}
      {showFilters && (
        <ActionHeaderScrollContainer>
          <HStack
            align={"center"}
            justify={"space-between"}
            gap={"md"}
            w={"full"}
            p={"xs"}
          >
            <HStack gap={"xs"} flex={1} wrap={"wrap"}>
              <SearchInput
                value={params.search ?? ""}
                onValueChange={(val: string) => {
                  setParams((prev) => ({
                    ...prev,
                    search: val,
                    page: 1,
                  }));
                }}
                placeholder={"Cari judul dokumen atau nama berkas..."}
                maxW={"280px"}
              />

              <StatusFilterSelect
                options={USER_GUIDE_CATEGORY_OPTIONS}
                value={params.category ?? "all"}
                onValueChange={(val) => {
                  setParams((prev) => ({
                    ...prev,
                    category: val !== "all" ? val : undefined,
                    page: 1,
                  }));
                }}
                placeholder={"Semua Kategori"}
              />

              <StatusFilterSelect
                options={USER_GUIDE_PUBLISH_STATUS_OPTIONS}
                value={
                  params.isPublished === undefined
                    ? "all"
                    : params.isPublished
                      ? "published"
                      : "draft"
                }
                onValueChange={(val) => {
                  setParams((prev) => ({
                    ...prev,
                    isPublished:
                      val === "published"
                        ? true
                        : val === "draft"
                          ? false
                          : undefined,
                    page: 1,
                  }));
                }}
                placeholder={"Semua Status"}
              />
            </HStack>

            <UserGuideFormModal mode={"create"}>
              <Button primary={true}>
                <AppIcon icon={PlusIcon} />
                {"Tambah Panduan"}
              </Button>
            </UserGuideFormModal>
          </HStack>
        </ActionHeaderScrollContainer>
      )}

      <Separator borderColor={"bg.canvas"} />

      {/* Loading Skeleton */}
      {isLoading && (
        <VStack p={"md"} gap={"sm"} align={"stretch"} w={"full"}>
          <Skeleton height={"48px"} width={"100%"} />
          <Skeleton height={"48px"} width={"100%"} />
          <Skeleton height={"48px"} width={"100%"} />
          <Skeleton height={"48px"} width={"100%"} />
        </VStack>
      )}

      {/* Retry Error State */}
      {!isLoading && isError && (
        <Center p={"xl"}>
          <RetryState
            title={"Gagal Memuat Daftar Panduan"}
            description={
              error instanceof Error
                ? error.message
                : "Terjadi kesalahan saat memuat daftar dokumen panduan pengguna."
            }
            onRetry={() => {
              void refetch();
            }}
          />
        </Center>
      )}

      {/* No Data State */}
      {isNoData && (
        <Center p={"xl"}>
          <NoDataState
            title={"Belum Ada Dokumen Panduan"}
            description={
              "Klik tombol Tambah Panduan di atas untuk menambahkan dokumen panduan baru."
            }
          />
        </Center>
      )}

      {/* No Result State */}
      {isNoResult && (
        <Center p={"xl"}>
          <NoResultState query={searchQuery} />
        </Center>
      )}

      {/* Data Table */}
      {!isLoading && !isError && !isEmpty && (
        <VStack flex={1} w={"full"} position={"relative"}>
          <DataViewTable.Root<UserGuideItem>
            headers={dataList.headers}
            items={dataList.items}
            itemActions={dataList.itemActions}
            withNumbering={true}
            page={params.page}
            pageSize={params.limit}
            pb={0}
            rounded={roundedTop ?? 0}
          >
            <DataViewTable.Header />
            <DataViewTable.Body />
          </DataViewTable.Root>

          <Separator borderColor={"bg.canvas"} />

          {showPagination && (
            <DataViewFooter
              page={params.page ?? 1}
              pageSize={params.limit ?? DEFAULT_PAGE_SIZE_OPTIONS[0]}
              setPage={(nextPage: number) =>
                setParams((prev) => ({ ...prev, page: nextPage }))
              }
              setPageSize={(nextSize: number) => {
                setParams((prev) => ({
                  ...prev,
                  limit: nextSize,
                  page: 1,
                }));
              }}
              currentDataLength={rawItems.length}
              totalData={total}
              totalPage={totalPages}
            />
          )}
        </VStack>
      )}

      {/* Edit Form Modal */}
      {selectedGuideForEdit && (
        <UserGuideFormModal
          modalKey={`edit-user-guide-${selectedGuideForEdit.id}`}
          initialData={selectedGuideForEdit}
          mode={"edit"}
        />
      )}
    </>
  );
};
