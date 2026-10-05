// src/design-system/components/input/types/version-input.type.ts

import type { ChangeEvent, FocusEvent, RefObject } from "react";

export type VersionFieldKey = "major" | "minor" | "patch";

export type VersionFieldValues = {
  major: string;
  minor: string;
  patch: string;
};

export type VersionInputProps = {
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement> | string) => void;
  onValueChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  withPrefix?: boolean;
  min?: number;
  max?: number;
};

export type VersionSegmentInputProps = {
  fieldKey: VersionFieldKey;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange: (field: VersionFieldKey, rawValue: string) => void;
  onAutoAdvance: (field: VersionFieldKey) => void;
  onArrowNavigate: (field: VersionFieldKey, direction: "left" | "right") => void;
  onStep: (field: VersionFieldKey, direction: "up" | "down") => void;
  inputRef: RefObject<HTMLInputElement | null>;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};
