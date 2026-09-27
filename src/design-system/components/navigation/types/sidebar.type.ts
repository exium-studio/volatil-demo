// src/design-system/components/navigation/types/sidebar.type.ts

// src\design-system\components\navigation\types\sidebar.type.ts

// src\design-system\components\navigation\types\sidebar.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { SeparatorProps } from "@/design-system/components/layout/types/separator.type";
import type { ReactNode } from "react";

export type SidebarContextValue = {
  expanded: boolean;
  sidebarKey?: string;
  defaultExpanded: boolean;
  toggleExpanded: () => void;
};

type BaseSidebarRootProps = Omit<BoxProps, "children"> & {
  children?: ReactNode;
  collapsedWidth?: number;
  expandedWidth?: number;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
};

export type ExpandableSidebarRootProps = BaseSidebarRootProps & {
  expandable: true;
  sidebarKey: string;
};

export type NonExpandableSidebarRootProps = BaseSidebarRootProps & {
  expandable?: false;
  sidebarKey?: string;
};

export type SidebarRootProps =
  | ExpandableSidebarRootProps
  | NonExpandableSidebarRootProps;

export type SidebarHeaderProps = StackProps;

export type SidebarBodyProps = StackProps;

export type SidebarFooterProps = StackProps;

export type SidebarSeparatorProps = SeparatorProps;

export type SidebarToggleButtonProps = {
  sidebarKey?: string;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
};
