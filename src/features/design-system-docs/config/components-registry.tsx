// src/features/design-system-docs/config/components-registry.ts

import { Button } from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import {
  Progress,
  ProgressRoot,
} from "@/design-system/components/feedback/ui/progress";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import { Input } from "@/design-system/components/input/ui/input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import type { ComponentDocSpec } from "@/features/design-system-docs/types/ds-docs-spec.type";

export const COMPONENTS_REGISTRY: Record<string, ComponentDocSpec> = {
  button: {
    key: "button",
    title: "Button Component",
    category: "Buttons & Actions",
    description:
      "Komponen interaktif utama untuk aksi pengguna dengan pelbagai variasi saiz, gaya, dan status pemuatan.",
    importPath:
      'import { Button } from "@/design-system/components/button/ui/button";',
    component: Button,
    defaultProps: {
      children: "Click Me",
      variant: "solid",
      size: "md",
      colorPalette: "blue",
      loading: false,
      disabled: false,
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Click Me",
        description: "Label atau elemen anak di dalam button.",
        controlKind: "text",
      },
      {
        name: "variant",
        type: '"solid" | "subtle" | "outline" | "ghost" | "surface"',
        defaultValue: "solid",
        description: "Gaya visual button.",
        controlKind: "select",
        options: ["solid", "subtle", "outline", "ghost", "surface"],
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl"',
        defaultValue: "md",
        description: "Saiz fizikal button.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna UI komponen.",
        controlKind: "select",
        options: ["blue", "teal", "green", "red", "amber", "purple", "gray"],
      },
      {
        name: "loading",
        type: "boolean",
        defaultValue: false,
        description: "Menunjukkan status pemuatan (spinner).",
        controlKind: "boolean",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menyahdayakan interaksi button.",
        controlKind: "boolean",
      },
    ],
  },

  button_group: {
    key: "button_group",
    title: "ButtonGroup Component",
    category: "Buttons & Actions",
    description: "Membungkus sekumpulan Button agar menyatu secara visual.",
    importPath:
      'import { ButtonGroup } from "@/design-system/components/button/ui/button-group";\nimport { Button } from "@/design-system/components/button/ui/button";',
    component: ButtonGroup,
    defaultProps: {
      attached: true,
      size: "md",
      variant: "outline",
    },
    propsSpec: [
      {
        name: "attached",
        type: "boolean",
        defaultValue: true,
        description: "Menggabungkan border antara button.",
        controlKind: "boolean",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Saiz button di dalam group.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "variant",
        type: '"solid" | "outline" | "ghost" | "subtle"',
        defaultValue: "outline",
        description: "Gaya visual gabungan.",
        controlKind: "select",
        options: ["solid", "outline", "ghost", "subtle"],
      },
    ],
    renderPlayground: (props) => (
      <ButtonGroup {...props}>
        <Button>Left</Button>
        <Button>Middle</Button>
        <Button>Right</Button>
      </ButtonGroup>
    ),
  },

  typography: {
    key: "typography",
    title: "Typography (P Component)",
    category: "Typography & Display",
    description:
      "Komponen teks standard dengan sokongan penyesuaian font size, weight, dan warna.",
    importPath:
      'import { P } from "@/design-system/components/typography/ui/p";',
    component: P,
    defaultProps: {
      children: "Design System Typography Example",
      fontSize: "md",
      fontWeight: "normal",
      color: "fg.default",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Design System Typography Example",
        description: "Kandungan teks yang dipaparkan.",
        controlKind: "text",
      },
      {
        name: "fontSize",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"',
        defaultValue: "md",
        description: "Saiz fon.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      },
      {
        name: "fontWeight",
        type: '"normal" | "medium" | "semibold" | "bold"',
        defaultValue: "normal",
        description: "Ketebalan fon.",
        controlKind: "select",
        options: ["normal", "medium", "semibold", "bold"],
      },
    ],
  },

  badge: {
    key: "badge",
    title: "Badge Component",
    category: "Typography & Display",
    description: "Label ringkas untuk menunjukkan status, kategori, atau tag.",
    importPath:
      'import { Badge } from "@/design-system/components/typography/ui/badge";',
    component: Badge,
    defaultProps: {
      children: "Badge Label",
      variant: "subtle",
      colorPalette: "blue",
      size: "md",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Badge Label",
        description: "Teks atau ikon dalam badge.",
        controlKind: "text",
      },
      {
        name: "variant",
        type: '"solid" | "subtle" | "outline" | "surface"',
        defaultValue: "subtle",
        description: "Gaya paparan badge.",
        controlKind: "select",
        options: ["solid", "subtle", "outline", "surface"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna.",
        controlKind: "select",
        options: ["blue", "green", "red", "amber", "purple", "gray"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Saiz badge.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
    ],
  },

  input: {
    key: "input",
    title: "Input Component",
    category: "Form Inputs",
    description: "Input teks standard untuk borang pengisian data.",
    importPath:
      'import { Input } from "@/design-system/components/input/ui/input";',
    component: Input,
    defaultProps: {
      placeholder: "Enter text here...",
      variant: "outline",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Enter text here...",
        description: "Placeholder teks input.",
        controlKind: "text",
      },
      {
        name: "variant",
        type: '"outline" | "subtle" | "flushed"',
        defaultValue: "outline",
        description: "Variasi garisan border input.",
        controlKind: "select",
        options: ["outline", "subtle", "flushed"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Saiz bidang input.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Status menyahdayakan input.",
        controlKind: "boolean",
      },
    ],
  },

  checkbox: {
    key: "checkbox",
    title: "Checkbox Component",
    category: "Form Inputs",
    description: "Elemen kotak pilihan tunggal atau multiple.",
    importPath:
      'import { Checkbox } from "@/design-system/components/input/ui/checkbox";',
    component: Checkbox,
    defaultProps: {
      children: "Accept Terms & Conditions",
      colorPalette: "blue",
      disabled: false,
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Accept Terms & Conditions",
        description: "Label checkbox.",
        controlKind: "text",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Warna bila ditanda.",
        controlKind: "select",
        options: ["blue", "green", "red", "purple"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menyahdayakan checkbox.",
        controlKind: "boolean",
      },
    ],
  },

  switch: {
    key: "switch",
    title: "Switch Component",
    category: "Form Inputs",
    description: "Togel dua status (On/Off).",
    importPath:
      'import { Switch } from "@/design-system/components/input/ui/switch";',
    component: Switch,
    defaultProps: {
      children: "Enable Notifications",
      colorPalette: "blue",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Enable Notifications",
        description: "Label di sebelah switch.",
        controlKind: "text",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna aktif.",
        controlKind: "select",
        options: ["blue", "green", "red", "purple"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Saiz switch.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menyahdayakan switch.",
        controlKind: "boolean",
      },
    ],
  },

  progress: {
    key: "progress",
    title: "Progress Component",
    category: "Feedback & Status",
    description: "Bar kemajuan untuk indikator proses.",
    importPath:
      'import { Progress } from "@/design-system/components/feedback/ui/progress";',
    component: ProgressRoot,
    renderPlayground: (props) => (
      <Progress.Root {...props}>
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    ),
    defaultProps: {
      value: 65,
      colorPalette: "blue",
      size: "md",
      animated: false,
    },
    propsSpec: [
      {
        name: "value",
        type: "number",
        defaultValue: 65,
        description: "Nilai kemajuan (0-100).",
        controlKind: "number",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna bar.",
        controlKind: "select",
        options: ["blue", "green", "amber", "red"],
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ketebalan bar.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: false,
        description: "Animasi peluncuran bar.",
        controlKind: "boolean",
      },
    ],
  },
};
