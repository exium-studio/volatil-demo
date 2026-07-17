// src/design-system/components/input/types/file-input.type.ts

import type { AppIconProps } from "@/design-system/components/icon/types/app-icon.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { FileUpload } from "@chakra-ui/react";
import type { RefObject } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export type FileInputProps = Omit<FileUpload.RootProps, "accept"> &
  FileInputOwnProps;

type FileInputOwnProps = {
  inputProps?: UseFormRegisterReturn;
  files?: FileList | File[] | null;
  maxFiles?: number;
  existingFiles?: FileInputExistingItem[];
  onToggleDeleteExisting?: (id: string) => void;

  accept?: string[];
  variant?: FileInputVariant;
  disabled?: boolean;
  label?: string;
};

export type FileinputInnerProps = FileInputOwnProps &
  Pick<FileUpload.RootProps, "maxFileSize" | "accept"> & {
    variant: FileInputVariant;
    disabled?: boolean;
    label: string;
    invalid?: boolean;
    effectiveMaxFiles: number;
    existingFiles: FileInputExistingItem[];
    onToggleDeleteExisting?: (id: string) => void;
    acceptedFilesRef: RefObject<File[]>;
    filesToRestoreRef: RefObject<File[]>;
  };

export type NewFileItemProps = StackProps & {
  file: File;
  disabled?: boolean;
  onDelete: () => void;
};

export type ExistingFileItemProps = StackProps & {
  file: FileInputExistingItem;
  disabled?: boolean;
  onToggleDelete?: (id: string) => void;
  hasNewFiles?: boolean;
};

export type FileItemProps = StackProps & {
  name: string;
  mimeType: string;
  sizeLabel?: string;
  previewUrl?: string;
  markedForDelete?: boolean;
  disabled?: boolean;
  onDelete?: () => void;
};

export interface FileInputExistingItem {
  id: string;
  name: string;
  size?: number;
  url?: string;
  mimeType?: string;
  markedForDelete?: boolean;
}

export type FileInputVariant = "auto" | "button" | "dropzone";

export type FileIconProps = AppIconProps & {
  mimeType: string;
};
