// src\features\design-system-docs\types\ds-docs-spec.type.ts

// src\features\design-system-docs\types\ds-docs-spec.type.ts

import type { ElementType, ReactNode } from "react";

export type PropControlKind =
  | "text"
  | "number"
  | "boolean"
  | "select"
  | "color";

export type PropSpec = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  description: string;
  controlKind?: PropControlKind;
  options?: (string | number)[];
};

export type ComponentDocSpec = {
  key: string;
  title: string;
  category: string;
  description: string;
  importPath: string;
  component: ElementType;
  propsSpec: PropSpec[];
  defaultProps: Record<string, unknown>;
  renderPlayground?: (
    props: Record<string, unknown>,
    onPropChange?: (name: string, value: unknown) => void,
  ) => ReactNode;
};

export type ComponentPlaygroundContainerProps = {
  children: ReactNode;
  minH?: string | number;
};

export type TableDemoItem = {
  name: string;
  role: string;
  status: string;
};

