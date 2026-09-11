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
  renderPlayground?: (props: Record<string, unknown>) => ReactNode;
};
