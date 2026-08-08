// src/features/mitra/data-request/components/mitra.data-request.upload-aoi.tabs-content.tsx

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { FileItem } from "@/design-system/components/data-display/ui/file-item";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { FileInputTrigger } from "@/design-system/components/input/ui/file-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import {
  MODAL_SEARCH_PARAM_KEY,
  usePopModal,
} from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { MitraIgtDataListTable } from "@/features/mitra/data-request/components/mitra.data-request.igt-data-list-table";
import {
  MitraDataRequestUploadAoiContext,
  useMitraDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context";
import {
  useAddToCartAll,
  useAddToCartSelected,
  useFetchIgtByUploadedAoi,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";

import type { IgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
import type { UploadAoiFileListTriggerProps } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import { FilesIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";



export const MitraDataRequestUploadAoiTabsContent = (
  props: TabsContentProps,
) => {
  // States
  const [dataListState, setDataListState] = useState({
    selectedItems: [] as FormattedListItem[],
    uploadedFiles: [] as File[],
  });

  // Search Params / Hooks
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  const uploadAoiMutation = useFetchIgtByUploadedAoi();
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  useEffect(() => {
    if (!isEmptyArray(dataListState.uploadedFiles)) {
      void uploadAoiMutation.mutateAsync(dataListState.uploadedFiles[0]);
    } else {
      uploadAoiMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataListState.uploadedFiles]);

  // Derived Values
  const data = (
    !isEmptyArray(dataListState.uploadedFiles) ? uploadAoiMutation.data : null
  ) as IgtDataResponse | null;

  const contextValue = useMemo(
    () => ({
      igtData: data,
      dataListState,
      setDataListState,
    }),
    [data, dataListState],
  );

  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isAoiFileModalOpen && isEmptyArray(dataListState.uploadedFiles)) {
          back();
        }
      },
    },
    [isAoiFileModalOpen, dataListState.uploadedFiles],
  );

  return (
    <MitraDataRequestUploadAoiContext.Provider value={contextValue}>
      <Tabs.Content
        display={"flex"}
        flex={1}
        flexDir={"column"}
        overflowY={"auto"}
        p={0}
        {...props}
      >
        {!data && (
          <NoDataState
            description={
              "Upload file AOI untuk melihat data IGT yang tersedia di area tersebut"
            }
          >
            <AddFileButton />
          </NoDataState>
        )}

        {data && (
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
                </HStack>

                <HStack align={"center"} gap={SPACING_SM}>
                  <FileListTrigger>
                    <Button variant={"outline"}>
                      <AppIcon icon={FilesIcon} />
                      File AOI anda ({dataListState.uploadedFiles.length})
                    </Button>
                  </FileListTrigger>

                  <AddFileButton variant={"outline"} />
                </HStack>
              </HStack>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            <VStack
              flex={1}
              gap={PADDING_SM}
              overflowY={"auto"}
              bg={"bg.canvas"}
            >
              <DataList />

              <MitraDataRequestAddToCartButtons
                selectedItems={dataListState.selectedItems}
                allItems={data?.items ?? []}
                totalBidangCount={data?.meta?.totalBidang}
                totalKawasanCount={data?.meta?.totalKawasan}
                totalCount={data?.meta?.total}
                onAddSelectedClick={() => {
                  const selectedIds = dataListState.selectedItems.map((item) =>
                    String(item.id),
                  );
                  addToCartSelectedMutation.mutate({ itemIds: selectedIds });
                }}
                onAddAllBidangClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "bidang",
                  });
                }}
                onAddAllKawasanClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "kawasan",
                  });
                }}
                onAddAllBothClick={() => {
                  addToCartAllMutation.mutate({
                    source: "upload_aoi",
                    targetBasis: "all",
                  });
                }}
              />
            </VStack>
          </>
        )}
      </Tabs.Content>
    </MitraDataRequestUploadAoiContext.Provider>
  );
};

const AddFileButton = (props: ButtonProps) => {
  // Contexts
  const { dataListState, setDataListState } =
    useMitraDataRequestUploadAoiContext();

  return (
    <FileInputTrigger
      fileInputProps={{
        maxFiles: 1,
        value: dataListState.uploadedFiles,
        onFileChange: ({ acceptedFiles }) => {
          setDataListState((prev) => ({
            ...prev,
            uploadedFiles: acceptedFiles,
          }));
        },
      }}
    >
      <Button primary pl={3} {...props}>
        <AppIcon icon={PlusIcon} />
        {"Tambah File"}
      </Button>
    </FileInputTrigger>
  );
};

const FileListTrigger = (props: UploadAoiFileListTriggerProps) => {
  // Props
  const { children } = props;

  // Contexts
  const { dataListState, setDataListState } =
    useMitraDataRequestUploadAoiContext();

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "aoi-file-list",
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <P textAlign={"center"}>{"File AOI Anda"}</P>
          <Modal.CloseButton />
        </Modal.Header>

        <Modal.Body gap={SPACING_SM}>
          {isEmptyArray(dataListState.uploadedFiles) && <NoDataState />}

          {dataListState.uploadedFiles.map((file, index) => (
            <FileItem
              key={index}
              name={file.name}
              mimeType={file.type}
              sizeLabel={formatByte(file.size)}
              onDelete={() => {
                setDataListState((prev) => ({
                  ...prev,
                  uploadedFiles: prev.uploadedFiles.filter(
                    (_, i) => i !== index,
                  ),
                }));
              }}
            />
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button
            flex={1}
            _hover={{
              color: "fg.error",
            }}
            onClick={() => {
              setDataListState((prev) => ({
                ...prev,
                uploadedFiles: [],
              }));
            }}
          >
            {"Hapus semua"}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

const DataList = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { igtData, setDataListState } = useMitraDataRequestUploadAoiContext();

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <MitraIgtDataListTable
        igtItems={igtData?.items ?? []}
        withNumbering={false}
        canBatchSelect
        pb={0}
        roundedTop={0}
        roundedBottom={theme.radii.container}
        onSelectedItemChange={({ selectedItems }) => {
          setDataListState((prev) => ({ ...prev, selectedItems }));
        }}
        rounded={0}
        shadow={"none"}
      />
    </VStack>
  );
};
