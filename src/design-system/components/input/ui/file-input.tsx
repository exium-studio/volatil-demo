// src/design-system/components/input/ui/file-input.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { FileIcon } from "@/design-system/components/data-display/ui/file-item";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  ExistingFileItemProps,
  FileinputInnerProps,
  FileInputProps,
  FileInputTriggerProps,
  FileItemProps,
  NewFileItemProps,
} from "@/design-system/components/input/types/file-input.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { toast } from "@/design-system/components/toast";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useObjectUrl } from "@/shared/hooks/use-object-url";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatFileSize, isImageFile } from "@/shared/utils/data/file";
import {
  FileUpload,
  FormatByte,
  useFieldContext,
  useFileUploadContext,
} from "@chakra-ui/react";
import {
  ArrowDownIcon,
  DotIcon,
  ImageOffIcon,
  UndoIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

export const FileInputTrigger = ({
  children,
  fileInputProps,
  ...restProps
}: FileInputTriggerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <FileInput
        ref={inputRef}
        variant={"button"}
        label={"Tambah file"}
        display={"none"}
        w={"fit"}
        {...fileInputProps}
      />

      <Box w={"fit"} onClick={() => inputRef.current?.click()} {...restProps}>
        {children}
      </Box>
    </>
  );
};

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(props, ref) {
    // Props
    const {
      inputProps,
      variant = "auto",
      accept,
      maxFiles = 1,
      maxFileSize = 5 * 1024 * 1024, // 5MB
      disabled,
      label = t["common.upload_files"](),
      existingFiles = [],
      onToggleDeleteExisting,
      value,
      dropzoneProps,
      dropzoneButtonProps,
      ...restProps
    } = props;

    // Contexts
    const fieldContext = useFieldContext();
    const isFieldInvalid = fieldContext?.invalid;

    // Refs
    const acceptedFilesRef = useRef<File[]>([]);
    const filesToRestoreRef = useRef<File[]>([]);

    // States
    const [resetKey, setResetKey] = useState(0);

    // Resolved Values
    const existingRemainingCount = existingFiles.filter(
      (file) => !file.markedForDelete,
    ).length;
    const effectiveMaxFiles = onToggleDeleteExisting
      ? Math.max(maxFiles - existingRemainingCount, 0)
      : maxFiles;

    return (
      <FileUpload.Root
        key={resetKey}
        accept={accept}
        maxFiles={effectiveMaxFiles}
        maxFileSize={maxFileSize}
        disabled={disabled || effectiveMaxFiles <= 0}
        onFileReject={(details) => {
          filesToRestoreRef.current = acceptedFilesRef.current;
          setResetKey((k) => k + 1);

          const tooMany = details.files.some((f) =>
            f.errors.includes("TOO_MANY_FILES"),
          );
          if (tooMany) {
            toast.error(t["file_input.max_files_exceeded"]());
          }

          const invalidType = details.files.some((f) =>
            f.errors.includes("FILE_INVALID_TYPE"),
          );
          if (invalidType) {
            toast.error(t["file_input.invalid_file_type"]());
          }

          const tooLarge = details.files.some((f) =>
            f.errors.includes("FILE_TOO_LARGE"),
          );
          if (tooLarge) {
            toast.error(t["file_input.max_file_size_exceeded"]());
          }
        }}
        {...restProps}
      >
        <FileUpload.HiddenInput ref={ref} {...inputProps} />

        <FileInputInner
          accept={accept}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}
          variant={variant}
          disabled={disabled}
          label={label}
          invalid={isFieldInvalid}
          effectiveMaxFiles={effectiveMaxFiles}
          existingFiles={existingFiles}
          onToggleDeleteExisting={onToggleDeleteExisting}
          acceptedFilesRef={acceptedFilesRef}
          filesToRestoreRef={filesToRestoreRef}
          value={value}
          dropzoneProps={dropzoneProps}
          dropzoneButtonProps={dropzoneButtonProps}
        />
      </FileUpload.Root>
    );
  },
);

const FileInputInner = (props: FileinputInnerProps) => {
  // Props
  const {
    accept,
    maxFiles,
    maxFileSize,
    variant,
    disabled,
    label,
    invalid,
    effectiveMaxFiles,
    existingFiles,
    onToggleDeleteExisting,
    acceptedFilesRef,
    filesToRestoreRef,
    value,
    dropzoneProps,
    dropzoneButtonProps,
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { acceptedFiles, setFiles, dragging, openFilePicker } =
    useFileUploadContext();

  // Hooks
  const isSmallViewport = useIsSmallViewport();

  // Resolved Values
  const resolvedVariant =
    variant === "auto" ? (isSmallViewport ? "button" : "dropzone") : variant;

  // Derived Values
  const isReplaceAllMode = !onToggleDeleteExisting;
  const isSlotFull =
    effectiveMaxFiles <= 0 || acceptedFiles.length >= effectiveMaxFiles;
  const showInputComponent = !isSlotFull;
  const isDropzoneFlex =
    resolvedVariant === "dropzone" &&
    (Boolean(dropzoneProps?.flex) || Boolean(dropzoneProps?.h));

  const dropzoneText =
    label && label !== t["common.upload_files"]()
      ? label
      : t["common.chose_or_drag_to_upload"]();

  // Handlers
  function handleToggleDeleteExisting(id: string) {
    const target = existingFiles.find((f) => f.id === id);
    const isRestoring = target?.markedForDelete === true;
    if (isRestoring && acceptedFiles.length > 0) {
      const newEffectiveMax = effectiveMaxFiles - 1;
      if (acceptedFiles.length > newEffectiveMax) {
        setFiles(acceptedFiles.slice(0, Math.max(newEffectiveMax, 0)));
        toast.info(t["file_input.auto_trimmed_warning"]());
      }
    }
    onToggleDeleteExisting?.(id);
  }

  // Keep parent's snapshot ref up-to-date so it can save files before remount
  useEffect(() => {
    acceptedFilesRef.current = acceptedFiles;
  }, [acceptedFiles, acceptedFilesRef]);
  useEffect(() => {
    const toRestore = filesToRestoreRef.current;
    if (toRestore.length > 0) {
      filesToRestoreRef.current = [];
      setFiles(toRestore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync controlled value prop with internal acceptedFiles state
  useEffect(() => {
    if (value) {
      const isDifferent =
        value.length !== acceptedFiles.length ||
        value.some((file, idx) => file !== acceptedFiles[idx]);
      if (isDifferent) {
        setFiles(value);
      }
    }
  }, [value, acceptedFiles, setFiles]);

  return (
    <VStack
      gap={2}
      w={"full"}
      flex={isDropzoneFlex ? (dropzoneProps?.flex ?? 1) : undefined}
      h={isDropzoneFlex ? (dropzoneProps?.h ?? "full") : undefined}
    >
      {/* Existing file list */}
      {!isEmptyArray(existingFiles) && (
        <VStack gap={2}>
          {existingFiles.map((file) => (
            <ExistingFileItem
              key={file.id}
              file={file}
              disabled={disabled}
              onToggleDelete={
                onToggleDeleteExisting ? handleToggleDeleteExisting : undefined
              }
              hasNewFiles={acceptedFiles.length > 0}
            />
          ))}
        </VStack>
      )}

      {/* Input component */}
      {showInputComponent ? (
        <VStack
          w={"full"}
          flex={isDropzoneFlex ? (dropzoneProps?.flex ?? 1) : undefined}
          h={isDropzoneFlex ? (dropzoneProps?.h ?? "full") : undefined}
        >
          {resolvedVariant === "button" && (
            <FileUpload.Trigger asChild>
              <Button
                variant={"outline"}
                w={"full"}
                disabled={disabled}
                borderColor={invalid ? "border.error" : undefined}
              >
                <AppIcon icon={UploadIcon} />
                {label}
              </Button>
            </FileUpload.Trigger>
          )}

          {resolvedVariant === "dropzone" && (
            <FileUpload.Dropzone
              w={"full"}
              minH={"220px"}
              p={4}
              bg={"bg.body"}
              border={"2px dashed"}
              borderColor={dragging ? "transparent" : "border"}
              outline={dragging ? "2px dashed currentColor" : "none"}
              outlineOffset={"2px"}
              rounded={theme.radii.component}
              cursor={"pointer"}
              flex={isDropzoneFlex ? (dropzoneProps?.flex ?? 1) : undefined}
              h={isDropzoneFlex ? (dropzoneProps?.h ?? "full") : undefined}
              _hover={{
                bg: "bg.subtle",
              }}
              {...dropzoneProps}
            >
              <FileUpload.DropzoneContent
                gap={4}
                mt={1}
                transform={dragging ? "translateY(25%)" : ""}
                transition={"200ms"}
              >
                <VStack>
                  <AppIcon
                    icon={dragging ? ArrowDownIcon : UploadIcon}
                    size={"lg"}
                    color={"fg.muted"}
                    mb={dragging ? -2 : 0}
                    animation={dragging ? "bounce" : ""}
                  />
                  {dragging && (
                    <AppIcon
                      icon={DotIcon}
                      size={"lg"}
                      color={"fg.muted"}
                      mb={-4}
                    />
                  )}
                </VStack>

                <VStack gap={1} maxW={"360px"}>
                  <P textAlign={"center"}>
                    {dragging ? t["common.drop_it_here"]() : dropzoneText}
                  </P>

                  <P
                    fontSize={"sm"}
                    textAlign={"center"}
                    color={"fg.subtle"}
                    opacity={dragging ? 0 : 1}
                    transition={"200ms"}
                  >
                    {accept?.map((a: string) => a).join(", ")}
                    {` max ${maxFiles} files `}
                    {maxFileSize && (
                      <>
                        (<FormatByte value={maxFileSize} />)
                      </>
                    )}
                  </P>
                </VStack>

                <Button
                  variant={
                    dropzoneButtonProps?.primary
                      ? undefined
                      : (dropzoneButtonProps?.variant ?? "outline")
                  }
                  opacity={dragging ? 0 : 1}
                  transition={"200ms"}
                  onClick={openFilePicker}
                  {...dropzoneButtonProps}
                >
                  {dropzoneButtonProps?.children ?? t["common.browse_files"]()}
                </Button>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
          )}
        </VStack>
      ) : (
        <Center
          w={"full"}
          p={4}
          border={"1px dashed"}
          borderColor={"border.muted"}
          rounded={theme.radii.component}
          bg={"bg.subtle"}
        >
          <P fontSize={"sm"} color={"fg.subtle"} textAlign={"center"}>
            {t["file_input.limit_reached"]()}
          </P>
        </Center>
      )}

      {isReplaceAllMode && !isEmptyArray(existingFiles) && (
        <P fontSize={"xs"} color={"fg.subtle"} textAlign={"center"}>
          {t["file_input.replace_hint"]()}
        </P>
      )}

      {/* New file list */}
      {!isEmptyArray(acceptedFiles) && (
        <VStack gap={2}>
          {acceptedFiles.map((file) => (
            <NewFileItem
              key={file.name}
              file={file}
              disabled={disabled}
              border={"1px solid"}
              borderColor={invalid ? "border.error" : "border.muted"}
              onDelete={() => setFiles(acceptedFiles.filter((f) => f !== file))}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

const NewFileItem = (props: NewFileItemProps) => {
  // Props
  const { file, disabled, onDelete, ...restProps } = props;

  // Resolved Values
  const previewUrl = useObjectUrl(isImageFile(file.type) ? file : undefined);

  return (
    <FileItem
      name={file.name}
      mimeType={file.type}
      sizeLabel={formatFileSize(file.size)}
      previewUrl={previewUrl}
      disabled={disabled}
      onDelete={onDelete}
      {...restProps}
    />
  );
};

const ExistingFileItem = (props: ExistingFileItemProps) => {
  // Props
  const { file, disabled, onToggleDelete, hasNewFiles, ...restProps } = props;

  // Derived Values
  const isReplaceAll = !onToggleDelete;
  const effectiveMarkedForDelete =
    file.markedForDelete || (isReplaceAll && hasNewFiles);

  return (
    <FileItem
      name={file.name}
      mimeType={file.mimeType ?? ""}
      previewUrl={file.url}
      sizeLabel={file.size != null ? formatFileSize(file.size) : undefined}
      markedForDelete={effectiveMarkedForDelete}
      disabled={disabled}
      onDelete={onToggleDelete ? () => onToggleDelete(file.id) : undefined}
      {...restProps}
    />
  );
};

const FileItem = (props: FileItemProps) => {
  // Props
  const {
    name,
    mimeType,
    sizeLabel,
    previewUrl,
    markedForDelete,
    disabled,
    onDelete,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Derived Values
  const contentOpacity = markedForDelete ? 0.5 : 1;

  return (
    <HStack
      align={"center"}
      gap={4}
      w={"full"}
      p={3}
      pl={4}
      bg={"bg.body"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={theme.radii.component}
      {...restProps}
    >
      {previewUrl && isImageFile(mimeType) ? (
        <Image
          src={previewUrl}
          alt={name}
          fallback={<AppIcon icon={ImageOffIcon} opacity={contentOpacity} />}
          w={"20px"}
          h={"20px"}
          objectFit={"cover"}
          opacity={contentOpacity}
        />
      ) : (
        <FileIcon mimeType={mimeType} opacity={contentOpacity} />
      )}

      <ClampedP
        textDecoration={markedForDelete ? "line-through" : undefined}
        opacity={contentOpacity}
      >
        {name}
      </ClampedP>

      <HStack align={"center"} gap={4} ml={"auto"}>
        {markedForDelete && (
          <P
            fontSize={"xs"}
            color={"fg.subtle"}
            fontStyle={"italic"}
            whiteSpace={"nowrap"}
          >
            {t["file_input.scheduled_removal"]()}
          </P>
        )}

        {!markedForDelete && sizeLabel && (
          <P
            fontSize={"sm"}
            whiteSpace={"nowrap"}
            color={"fg.subtle"}
            opacity={contentOpacity}
          >
            {sizeLabel}
          </P>
        )}

        {onDelete && (
          <Tooltip
            content={
              markedForDelete
                ? t["common.undo_remove_file"]()
                : t["common.remove_file"]()
            }
          >
            <IconButton
              size={"xs"}
              h={"32px"}
              disabled={disabled}
              aria-label={
                markedForDelete
                  ? t["common.undo_remove_file"]()
                  : t["common.remove_file"]()
              }
              onClick={onDelete}
            >
              <AppIcon icon={markedForDelete ? UndoIcon : XIcon} />
            </IconButton>
          </Tooltip>
        )}
      </HStack>
    </HStack>
  );
};
