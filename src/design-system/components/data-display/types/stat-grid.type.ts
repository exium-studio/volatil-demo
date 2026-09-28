// src/design-system/components/data-display/types/stat-grid.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { GridProps } from "@/design-system/components/layout/types/grid.type";
import type { PProps } from "@/design-system/components/typography/types/p.type";
import type { ComponentType, ReactNode } from "react";

export type StatGridRootProps = GridProps & {
  columns?: number;
  children: ReactNode;
};

export type StatGridItemProps = StackProps & {
  index?: number;
  columns?: number;
  children: ReactNode;
};

export type StatGridHeaderProps = StackProps & {
  children?: ReactNode;
};

export type StatGridLabelProps = PProps & {
  children?: ReactNode;
};

export type StatGridIconProps = {
  icon: ComponentType;
  color?: string;
  fontSize?: string;
};

export type StatGridValueProps = PProps & {
  value?: number | string;
  suffix?: string;
  isCurrency?: boolean;
  isCompact?: boolean;
  currency?: string;
  format?: (val: number | string) => ReactNode;
  children?: ReactNode;
};

export type StatGridDescriptionProps = PProps & {
  children?: ReactNode;
};
