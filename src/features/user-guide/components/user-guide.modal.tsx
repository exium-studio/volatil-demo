// src/features/user-guide/components/user-guide.modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { DownloadTrigger } from "@/design-system/components/utilities/ui/download-trigger";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { StatusFilterSelect } from "@/features/shared/components/status-filter.select";
import {
  resolveUserGuideMimeType,
  USER_GUIDE_CATEGORY_MAP,
  USER_GUIDE_CATEGORY_OPTIONS,
} from "@/features/user-guide/constants/user-guide.constants";
import { useTrackDownloadUserGuideMutation } from "@/features/user-guide/hooks/use-user-guide.mutations";
import { useUserGuidesQuery } from "@/features/user-guide/hooks/use-user-guides.query";
import type {
  UserGuideItem,
  UserGuideModalProps,
} from "@/features/user-guide/types/user-guide.type";
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
      size={"4xl"}
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
  const { portalType, modalKey } = props;

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
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{"Dokumen Panduan Pengguna"}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Body p={0} display={"flex"} flexDir={"column"} flex={1}>
        <VStack gap={"md"} align={"stretch"} flex={1}>
          {/* Search & Category Filter Bar */}
          <ActionHeaderScrollContainer
            gap={"xs"}
            align={"center"}
            w={"full"}
            p={"md"}
          >
            <SearchInput
              value={search}
              onValueChange={setSearch}
              placeholder={"Cari dokumen..."}
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
          </ActionHeaderScrollContainer>

          {/* Loading Skeleton */}
          {isLoading && (
            <SimpleGrid columns={[1, null, 2]} gap={"md"} px={"md"} pb={"md"}>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton
                  key={`user-guide-skeleton-${index}`}
                  height={"180px"}
                  rounded={theme.radii.container}
                />
              ))}
            </SimpleGrid>
          )}

          {/* Error State */}
          {!isLoading && isError && (
            <Center flex={1} p={"xl"}>
              <StateRetry
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
            <Center flex={1} p={"xl"}>
              <StateNoData
                title={"Belum Ada Dokumen Panduan"}
                description={
                  "Dokumen panduan pengguna akan segera tersedia di portal ini."
                }
              />
            </Center>
          )}

          {/* No Result State */}
          {isNoResult && (
            <Center flex={1} p={"xl"}>
              <StateNoResult query={search} />
            </Center>
          )}

          {/* Documents Grid */}
          {!isLoading && !isError && !isEmpty && (
            <SimpleGrid columns={[1, null, 2]} gap={"md"} px={"md"} pb={"md"}>
              {guides.map((guide) => {
                const catMeta =
                  USER_GUIDE_CATEGORY_MAP[guide.category] ??
                  USER_GUIDE_CATEGORY_MAP.manual_book;

                const catIcon = catMeta.icon ?? FileTextIcon;

                return (
                  <VStack
                    key={guide.id}
                    position={"relative"}
                    overflow={"hidden"}
                    align={"stretch"}
                    justify={"space-between"}
                    p={"md"}
                    rounded={theme.radii.component}
                    border={"1px solid"}
                    borderColor={`${catMeta.colorPalette}.muted`}
                    bg={"bg.body"}
                    bgGradient={`linear-gradient(135deg, var(--chakra-colors-${catMeta.colorPalette}-subtle) 0%, var(--chakra-colors-bg-body) 60%)`}
                    gap={"sm"}
                    transition={"all 0.2s ease"}
                  >
                    {/* Top: Icon, Category & Version */}
                    <VStack align={"stretch"} gap={"xs"}>
                      <HStack justify={"space-between"} align={"center"}>
                        <HStack gap={"xs"} align={"center"}>
                          <AppIcon
                            icon={catIcon}
                            color={`${catMeta.colorPalette}.fg`}
                          />
                          <Badge
                            variant={"subtle"}
                            colorPalette={catMeta.colorPalette}
                          >
                            {catMeta.label}
                          </Badge>
                        </HStack>

                        <Badge
                          variant={"outline"}
                          colorPalette={"gray"}
                          size={"xs"}
                        >
                          {guide.version}
                        </Badge>
                      </HStack>

                      {/* Title */}
                      <Heading lineClamp={2} title={guide.title}>
                        {guide.title}
                      </Heading>

                      {/* Description */}
                      <ClampedP
                        color={"fg.muted"}
                        fontSize={"sm"}
                        lineClamp={2}
                      >
                        {guide.description}
                      </ClampedP>
                    </VStack>

                    {/* Bottom: File info & Actions */}
                    <VStack align={"stretch"} gap={"sm"} pt={"xs"}>
                      <Separator borderColor={"bg.canvas"} />

                      <HStack
                        justify={"space-between"}
                        align={"center"}
                        color={"fg.subtle"}
                        fontSize={"xs"}
                      >
                        <ClampedP
                          fontSize={"xs"}
                          color={"fg.subtle"}
                          lineClamp={1}
                          flex={1}
                          title={guide.fileName}
                        >
                          {guide.fileName}
                        </ClampedP>
                        <P
                          fontSize={"xs"}
                          color={"fg.muted"}
                          whiteSpace={"nowrap"}
                        >
                          {formatByte(guide.fileSize)}
                        </P>
                      </HStack>

                      {/* Actions */}
                      <HStack gap={"xs"} align={"center"} w={"full"}>
                        <ExternalLink
                          href={guide.fileUrl}
                          variant={"plain"}
                          colorPalette={"neutral"}
                          flex={1}
                        >
                          <Button
                            variant={"outline"}
                            colorPalette={catMeta.colorPalette}
                            w={"full"}
                          >
                            <AppIcon icon={ExternalLinkIcon} />
                            {"Pratinjau"}
                          </Button>
                        </ExternalLink>

                        <DownloadTrigger
                          data={guide.fileUrl}
                          fileName={guide.fileName}
                          mimeType={resolveUserGuideMimeType(
                            guide.fileName,
                            guide.fileType,
                          )}
                        >
                          <Button
                            variant={"outline"}
                            colorPalette={catMeta.colorPalette}
                            onClick={() => handleDownload(guide)}
                          >
                            <AppIcon icon={DownloadIcon} />
                            {"Unduh"}
                          </Button>
                        </DownloadTrigger>
                      </HStack>
                    </VStack>
                  </VStack>
                );
              })}
            </SimpleGrid>
          )}
        </VStack>
      </Modal.Body>

      <Separator borderColor={"bg.canvas"} />
    </Modal.Content>
  );
};
