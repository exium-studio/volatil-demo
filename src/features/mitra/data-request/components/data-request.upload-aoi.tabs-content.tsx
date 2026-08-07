// src/features/mitra/data-request/components/data-request.upload-aoi.tabs-content.tsx

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
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
import { DataRequestAddToCartButtons } from "@/features/mitra/data-request/components/data.request.add-to-cart-buttons";
import {
  DataRequestUploadAoiContext,
  useDataRequestUploadAoiContext,
} from "@/features/mitra/data-request/contexts/data-request.upload-aoi.context";
import { useFetchIgtByUploadedAoi } from "@/features/mitra/data-request/hooks/use-data-request";
import type { UploadAoiFileListTriggerProps } from "@/features/mitra/data-request/types/data-request.upload-aoi.type";
import type { IgtDataResponse } from "@/features/mitra/data-request/types/data-request.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/igt-by-aoi.type";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import { useSearch } from "@tanstack/react-router";
import { FilesIcon, PlusIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

export const DataRequestUploadAoiTabsContent = (props: TabsContentProps) => {
  const [dataListState, setDataListState] = useState({
    selectedItems: [] as FormattedListItem[],
    uploadedFiles: [] as File[],
  });

  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const isAoiFileModalOpen = search[MODAL_SEARCH_PARAM_KEY] === "aoi-file-list";

  const uploadAoiMutation = useFetchIgtByUploadedAoi();

  useEffect(() => {
    if (!isEmptyArray(dataListState.uploadedFiles)) {
      void uploadAoiMutation.mutateAsync(dataListState.uploadedFiles[0]);
    } else {
      uploadAoiMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataListState.uploadedFiles]);

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
    <DataRequestUploadAoiContext.Provider value={contextValue}>
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

              <DataRequestAddToCartButtons
                selectedItems={dataListState.selectedItems}
                onAddSelectedClick={() => {
                  console.log("onAddSelectedClick");
                }}
                onAddAllClick={() => {
                  console.log("onAddAllClick");
                }}
              />
            </VStack>
          </>
        )}
      </Tabs.Content>
    </DataRequestUploadAoiContext.Provider>
  );
};

const AddFileButton = (props: ButtonProps) => {
  const { dataListState, setDataListState } = useDataRequestUploadAoiContext();

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
        Tambah File
      </Button>
    </FileInputTrigger>
  );
};

const FileListTrigger = (props: UploadAoiFileListTriggerProps) => {
  const { children } = props;
  const { dataListState, setDataListState } = useDataRequestUploadAoiContext();

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
          <P textAlign={"center"}>File AOI Anda</P>
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
            Hapus semua
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

const DataList = () => {
  const { theme } = useThemeStore();
  const { igtData, setDataListState } = useDataRequestUploadAoiContext();

  const dataList = useMemo(
    () => ({
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi" },
      ],
      items: (igtData?.items ?? []).map((item: IgtDataItem) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: item.id,
          data: item,
          columns: [
            {
              value: item.id,
              td: <P fontSize={"sm"}>{item.id}</P>,
              align: "start" as const,
            },
            {
              value: item.themes.map((th) => th.name).join(", "),
              td: (
                <HStack wrap={"wrap"} gap={1}>
                  {visibleThemes.map((theme) => (
                    <Badge
                      key={theme.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {theme.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge colorPalette={"neutral"} variant={"outline"}>
                      +{remainingCount} lainnya
                    </Badge>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.basis,
              td: (
                <Badge
                  colorPalette={
                    item.basis === "bidang"
                      ? BASIS_BIDANG_COLOR
                      : BASIS_KAWASAN_COLOR
                  }
                  variant={"subtle"}
                >
                  {item.basis}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.description ?? "",
              td: (
                <P
                  fontSize={"sm"}
                  color={"fg.subtle"}
                  maxW={"280px"}
                  whiteSpace={"wrap"}
                >
                  {item.description ?? "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),
    }),
    [igtData],
  );

  return (
    <VStack flex={1} overflowY={"auto"} bg={"bg.canvas"} w={"full"}>
      <DataListTable.Root
        withNumbering={false}
        headers={dataList.headers}
        items={dataList.items}
        canBatchSelect
        pb={0}
        roundedTop={0}
        roundedBottom={theme.radii.container}
        onSelectedItemChange={({ selectedItems }) => {
          setDataListState((prev) => ({ ...prev, selectedItems }));
        }}
        rounded={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>
    </VStack>
  );
};
