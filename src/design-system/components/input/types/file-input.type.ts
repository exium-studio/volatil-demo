// src/design-system/components/input/types/file-input.type.ts

import type { ButtonProps } from "@/design-system/components/button/types/button.type";
import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { FileUpload } from "@chakra-ui/react";
import type { ReactNode, RefObject } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export type FileInputTriggerProps = BoxProps &
  Record<string, unknown> & {
    children: ReactNode;
    fileInputProps?: FileInputProps;
  };

export type FileInputProps = Omit<FileUpload.RootProps, "accept"> &
  FileInputOwnProps;

type FileInputOwnProps = {
  inputProps?: UseFormRegisterReturn;
  files?: FileList | File[] | null;
  value?: File[];
  maxFiles?: number;
  existingFiles?: FileInputExistingItem[];
  onToggleDeleteExisting?: (id: string) => void;

  accept?: string[];
  variant?: FileInputVariant;
  disabled?: boolean;
  label?: string;
  dropzoneProps?: FileUpload.DropzoneProps;
  dropzoneButtonProps?: ButtonProps;
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
