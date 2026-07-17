// src/design-system/components/input/ui/file-input.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  ExistingFileItemProps,
  FileIconProps,
  FileinputInnerProps,
  FileInputProps,
  FileItemProps,
  NewFileItemProps,
} from "@/design-system/components/input/types/file-input.type";
import { getFileIcon } from "@/design-system/components/input/utils/file-input.utils";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useObjectUrl } from "@/shared/hooks/use-object-url";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatFileSize, isImageFile } from "@/shared/utils/data/file";
import { cssCalc } from "@/shared/utils/style/css-calc";
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
import { useEffect, useMemo, useRef, useState } from "react";

export const FileInput = (props: FileInputProps) => {
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

        // TODO: replace with real toast engine
        const tooMany = details.files.some((f) =>
          f.errors.includes("TOO_MANY_FILES"),
        );
        if (tooMany) {
          console.error(
            `Only ${effectiveMaxFiles} slot(s) left — you selected too many files at once (${details.files.length}).`,
          );
        }

        // TODO: replace with real toast engine
        const invalidType = details.files.some((f) =>
          f.errors.includes("FILE_INVALID_TYPE"),
        );
        if (invalidType) {
          const allowedTypes = accept?.join(", ") ?? "-";
          console.error(`Invalid file type — allowed types: ${allowedTypes}.`);
        }

        // TODO: replace with real toast engine
        const tooLarge = details.files.some((f) =>
          f.errors.includes("FILE_TOO_LARGE"),
        );
        if (tooLarge) {
          console.error(
            `File too large — maximum allowed size is ${maxFileSize} bytes.`,
          );
        }
      }}
      {...restProps}
    >
      <FileUpload.HiddenInput {...inputProps} />

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
      />
    </FileUpload.Root>
  );
};

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

  // Handlers
  function handleToggleDeleteExisting(id: string) {
    const target = existingFiles.find((f) => f.id === id);
    const isRestoring = target?.markedForDelete === true;
    if (isRestoring && acceptedFiles.length > 0) {
      const newEffectiveMax = effectiveMaxFiles - 1;
      if (acceptedFiles.length > newEffectiveMax) {
        setFiles(acceptedFiles.slice(0, Math.max(newEffectiveMax, 0)));
        // TODO: info toast wuth content t["file_input.auto_trimmed_warning"]()
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

  return (
    <VStack gap={2} w={"full"}>
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
        <VStack w={"full"}>
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
            <VStack pos={"relative"} w={"full"}>
              <FileUpload.Dropzone
                w={"full"}
                minH={"220px"}
                p={4}
                bg={"bg.body"}
                border={"2px dashed"}
                borderColor={dragging ? "transparent" : "border.muted"}
                rounded={theme.radii.component}
                cursor={"pointer"}
                _hover={{
                  bg: "bg.subtle",
                }}
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
                      mb={-2}
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

                  <VStack gap={1}>
                    <FileUpload.Label>
                      {dragging
                        ? t["common.drop_it_here"]()
                        : t["common.chose_or_drag_to_upload"]()}
                    </FileUpload.Label>

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
                    variant={"outline"}
                    size={"sm"}
                    rounded={cssCalc(`${theme.radii.component} - 4px`)}
                    opacity={dragging ? 0 : 1}
                    transition={"200ms"}
                    onClick={openFilePicker}
                  >
                    {t["common.browse_files"]()}
                  </Button>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>

              {dragging && (
                <svg
                  width={"100%"}
                  height={"100%"}
                  preserveAspectRatio={"none"}
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "visible",
                    pointerEvents: "none",
                  }}
                >
                  <rect
                    x={1}
                    y={1}
                    width={"calc(100% - 2px)"}
                    height={"calc(100% - 2px)"}
                    rx={theme.radii.component}
                    fill={"none"}
                    stroke={"currentColor"}
                    strokeWidth={1.5}
                    strokeDasharray={"6 4"}
                    style={{
                      animation: "marching-ants 0.6s linear infinite",
                      vectorEffect: "non-scaling-stroke",
                    }}
                  />
                </svg>
              )}

              <style>{`
                @keyframes marching-ants {
                  to { stroke-dashoffset: -10; }
                }
              `}</style>
            </VStack>
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

const FileIcon = (props: FileIconProps) => {
  // Props
  const { mimeType, ...restProps } = props;

  // Resolved Values
  const icon = useMemo(() => getFileIcon(mimeType), [mimeType]);

  return <AppIcon icon={icon} {...restProps} />;
};
