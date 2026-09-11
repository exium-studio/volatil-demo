// src/features/design-system-docs/constants/ds.nav-groups.ts

import type { DsNavKey } from "@/features/design-system-docs/types/ds-docs-navs.type";
import type { NavGroup } from "@/shared/types/nav.type";

export const DS_NAV_GROUPS_LIST: NavGroup<DsNavKey>[] = [
  {
    title: "Getting Started",
    items: [
      { key: "overview" },
    ],
  },
  {
    title: "Components",
    items: [
      {
        key: "cat_buttons",
        children: [
          { key: "button" },
          { key: "button_group" },
        ],
      },
      {
        key: "cat_typography",
        children: [
          { key: "typography" },
          { key: "badge" },
        ],
      },
      {
        key: "cat_inputs",
        children: [
          { key: "input" },
          { key: "number_input" },
          { key: "password_input" },
          { key: "checkbox" },
          { key: "switch" },
          { key: "textarea" },
        ],
      },
      {
        key: "cat_feedback",
        children: [
          { key: "progress" },
          { key: "skeleton" },
          { key: "toast" },
        ],
      },
      {
        key: "cat_layout",
        children: [
          { key: "box" },
          { key: "grid" },
        ],
      },
      {
        key: "cat_overlay",
        children: [
          { key: "dialog" },
        ],
      },
    ],
  },
];
