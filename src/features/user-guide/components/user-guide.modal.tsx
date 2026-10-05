// src/features/user-guide/components/user-guide.modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  USER_GUIDE_CATEGORY_MAP,
  USER_GUIDE_CATEGORY_OPTIONS,
} from "@/features/user-guide/constants/user-guide.constants";
import { useTrackDownloadUserGuideMutation } from "@/features/user-guide/hooks/use-user-guide.mutations";
import { useUserGuidesQuery } from "@/features/user-guide/hooks/use-user-guides.query";
import type {
  UserGuideItem,
  UserGuideModalProps,
} from "@/features/user-guide/types/user-guide.type";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { DownloadIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";

export const UserGuideModal = (props: UserGuideModalProps) => {
  // Props
  const {
    modalKey: customModalKey = "user-guide-modal",
    portalType = "all",
    opened,
    open: propOpen,
    close: propClose,
  } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const resolvedIsOpen = opened !== undefined ? opened : isOpen;
  const resolvedOpen = propOpen ?? open;
  const resolvedClose = propClose ?? close;

  const isMounted = useMountTimeout({
    isOpen: resolvedIsOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={resolvedIsOpen}
      open={resolvedOpen}
      close={resolvedClose}
      size={"lg"}
    >
      {isMounted && (
        <UserGuideModalContent
          close={resolvedClose}
          portalType={portalType}
          modalKey={modalKey}
        />
      )}
    </Modal.Root>
  );
};

const UserGuideModalContent = (props: {
  close: () => void;
  portalType: "mitra" | "internal" | "all";
  modalKey: string;
}) => {
  // Props
  const { close, portalType, modalKey } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Queries & Mutations
  const categoryOptions = USER_GUIDE_CATEGORY_OPTIONS;

  const { guides, isLoading, isError, error, refetch } = useUserGuidesQuery({
    page: 1,
    limit: 100,
    search: search.trim() || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    targetRole: portalType === "mitra" ? "mitra" : undefined,
    isPublished: true,
  });

  const trackDownloadMutation = useTrackDownloadUserGuideMutation();

  // Derived Values
  const hasSearch = Boolean(search.trim());
  const isEmpty = isEmptyArray(guides);
  const isNoResult = !isLoading && !isError && isEmpty && hasSearch;
  const isNoData = !isLoading && !isError && isEmpty && !hasSearch;

  // Handlers
  const handleDownload = (guide: UserGuideItem) => {
    trackDownloadMutation.mutate(guide.id);

    const link = document.createElement("a");
    link.href = guide.fileUrl;
    link.download = guide.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (guide: UserGuideItem) => {
    window.open(guide.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal.Content maxW={"760px"}>
      <Modal.Header>
        <Modal.Title>{"Dokumen Panduan Pengguna"}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Body p={0}>
        <VStack gap={"md"} align={"stretch"}>
          {/* Search & Category Filter Bar */}
          <HStack gap={"xs"} align={"center"} w={"full"} p={"md"}>
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder={"Cari judul dokumen atau nama berkas..."}
              flex={1}
            />

            <StatusFilterSelect
              modalKey={`${modalKey}.category-filter`}
              options={categoryOptions}
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
              placeholder={"Semua Kategori"}
              w={"180px"}
            />
          </HStack>

          {/* Loading Skeleton */}
          {isLoading && (
            <VStack gap={"sm"} align={"stretch"}>
              <Skeleton height={"76px"} rounded={theme.radii.component} />
              <Skeleton height={"76px"} rounded={theme.radii.component} />
              <Skeleton height={"76px"} rounded={theme.radii.component} />
            </VStack>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <Center p={"xl"}>
              <RetryState
                title={"Gagal Memuat Dokumen Panduan"}
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
                  "Dokumen panduan pengguna akan segera tersedia di portal ini."
                }
              />
            </Center>
          )}

          {/* No Result State */}
          {isNoResult && (
            <Center p={"xl"}>
              <NoResultState query={search} />
            </Center>
          )}

          {/* Clean Documents List */}
          {!isLoading && !isError && !isEmpty && (
            <VStack gap={"md"} overflowY={"auto"} px={"md"}>
              {guides.map((guide, index) => {
                const catMeta =
                  USER_GUIDE_CATEGORY_MAP[guide.category] ??
                  USER_GUIDE_CATEGORY_MAP.manual_book;

                return (
                  <VStack
                    key={guide.id}
                    align={"stretch"}
                    gap={"sm"}
                    pb={"md"}
                    borderBottom={
                      index < guides.length - 1 ? "1px solid" : "none"
                    }
                    borderColor={"bg.canvas"}
                  >
                    {/* Header: Title + Category + Version */}
                    <HStack
                      justify={"space-between"}
                      align={"start"}
                      gap={"sm"}
                      wrap={"wrap"}
                    >
                      <HStack gap={"xs"} align={"center"} flex={1} minW={0}>
                        <AppIcon
                          icon={FileTextIcon}
                          boxSize={4}
                          color={`${catMeta.colorPalette}.fg`}
                        />

                        <ClampedP fontWeight={"semibold"} lineClamp={1}>
                          {guide.title}
                        </ClampedP>

                        <Badge
                          variant={"subtle"}
                          colorPalette={catMeta.colorPalette}
                        >
                          {catMeta.label}
                        </Badge>
                      </HStack>

                      <Badge variant={"outline"}>{guide.version}</Badge>
                    </HStack>

                    {/* Description */}
                    <ClampedP color={"fg.muted"} lineClamp={2}>
                      {guide.description}
                    </ClampedP>

                    {/* Footer: Metadata & Actions */}
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      gap={"md"}
                      pt={"2xs"}
                      wrap={"wrap"}
                    >
                      <HStack gap={"xs"} color={"fg.subtle"} wrap={"wrap"}>
                        <P color={"fg.subtle"}>{guide.fileName}</P>
                        <P color={"fg.subtle"}>{"•"}</P>
                        <P color={"fg.subtle"}>{formatByte(guide.fileSize)}</P>
                      </HStack>

                      <HStack gap={"xs"} align={"center"}>
                        <Button
                          variant={"ghost"}
                          colorPalette={"gray"}
                          onClick={() => handlePreview(guide)}
                        >
                          <AppIcon icon={ExternalLinkIcon} />
                          {"Pratinjau"}
                        </Button>

                        <Button
                          primary={true}
                          onClick={() => handleDownload(guide)}
                        >
                          <AppIcon icon={DownloadIcon} />
                          {"Unduh"}
                        </Button>
                      </HStack>
                    </HStack>
                  </VStack>
                );
              })}
            </VStack>
          )}
        </VStack>
      </Modal.Body>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Footer>
        <Button flex={1} onClick={close}>
          {"Tutup"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
