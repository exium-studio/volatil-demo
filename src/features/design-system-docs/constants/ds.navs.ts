// src/features/design-system-docs/constants/ds.navs.ts

import type { NavItem } from "@/shared/types/nav.type";
import {
  Bell,
  Box,
  CheckSquare,
  FileText,
  FormInput,
  Info,
  Layers,
  LayoutGrid,
  Maximize2,
  MousePointerClick,
  Sliders,
  Type,
} from "lucide-react";

export const DS_NAVS_MAP = {
  overview: {
    icon: Info,
    title: "Overview & Specs",
  },
  // Categories (Parent Nodes)
  cat_buttons: {
    icon: MousePointerClick,
    title: "Buttons & Actions",
  },
  cat_typography: {
    icon: Type,
    title: "Typography & Display",
  },
  cat_inputs: {
    icon: FormInput,
    title: "Form Inputs",
  },
  cat_feedback: {
    icon: Sliders,
    title: "Feedback & Status",
  },
  cat_layout: {
    icon: Box,
    title: "Layout & Structure",
  },
  cat_overlay: {
    icon: Maximize2,
    title: "Overlays & Modals",
  },

  // Component Item Nodes
  button: {
    icon: MousePointerClick,
    title: "Button",
  },
  button_group: {
    icon: Layers,
    title: "Button Group",
  },
  typography: {
    icon: Type,
    title: "P & Typography",
  },
  badge: {
    icon: FileText,
    title: "Badge",
  },
  input: {
    icon: FormInput,
    title: "Input",
  },
  number_input: {
    icon: FormInput,
    title: "Number Input",
  },
  password_input: {
    icon: FormInput,
    title: "Password Input",
  },
  checkbox: {
    icon: CheckSquare,
    title: "Checkbox",
  },
  switch: {
    icon: Sliders,
    title: "Switch",
  },
  textarea: {
    icon: FormInput,
    title: "Textarea",
  },
  progress: {
    icon: Sliders,
    title: "Progress & Circle",
  },
  skeleton: {
    icon: Box,
    title: "Skeleton Loader",
  },
  toast: {
    icon: Bell,
    title: "Toast Notification",
  },
  box: {
    icon: Box,
    title: "Box",
  },
  grid: {
    icon: LayoutGrid,
    title: "Simple Grid",
  },
  dialog: {
    icon: Maximize2,
    title: "Dialog Modal",
  },
} as const satisfies Record<string, NavItem>;
