// src\features\design-system-docs\config\components-registry.tsx

// src\features\design-system-docs\config\components-registry.tsx

import { BrandWatermark } from "@/design-system/components/branding/ui/brand-watermark";
import { Logo } from "@/design-system/components/branding/ui/logo";
import { Button } from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { Clipboard } from "@/design-system/components/data-display/ui/clipboard";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import type {
  DataViewBatchActionsGenerator,
  DataViewItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Breadcrumb } from "@/design-system/components/disclosure/ui/breadcrumb";
import { Carousel } from "@/design-system/components/disclosure/ui/carousel";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Steps } from "@/design-system/components/disclosure/ui/steps";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import type { EmojiVariant } from "@/design-system/components/emoji/types/emoji.type";
import { Emoji } from "@/design-system/components/emoji/ui/emoji";
import { EmojiPoker } from "@/design-system/components/emoji/ui/emoji.poker";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import {
  Progress,
  ProgressRoot,
} from "@/design-system/components/feedback/ui/progress";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import { Field } from "@/design-system/components/input/ui/field";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { Input } from "@/design-system/components/input/ui/input";
import { NumberInput } from "@/design-system/components/input/ui/number-input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { RadioInput } from "@/design-system/components/input/ui/radio-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import SelectInput from "@/design-system/components/input/ui/select";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { Box } from "@/design-system/components/layout/ui/box";
import { Card } from "@/design-system/components/layout/ui/card";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Avatar } from "@/design-system/components/media/ui/avatar";
import { Image } from "@/design-system/components/media/ui/image";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { Sidebar } from "@/design-system/components/navigation/ui/sidebar";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { Drawer } from "@/design-system/components/overlay/ui/drawer";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { toast } from "@/design-system/components/toast";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { Kbd } from "@/design-system/components/typography/ui/kbd";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { DownloadTrigger } from "@/design-system/components/utilities/ui/download-trigger";
import { COLOR_PALETTE_OPTIONS } from "@/design-system/constants/colors";
import type {
  ComponentDocSpec,
  TableDemoItem,
} from "@/features/design-system-docs/types/ds-docs-spec.type";
import {
  BellIcon,
  ChevronDownIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  HomeIcon,
  InfoIcon,
  SettingsIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo } from "react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

export const COMPONENTS_REGISTRY: Record<string, ComponentDocSpec> = {
  logo: {
    key: "logo",
    title: "Logo",
    category: "Branding",
    description:
      "Identitas visual resmi aplikasi Exium / ATR BPN dengan adaptasi tema warna.",
    importPath:
      'import { Logo } from "@/design-system/components/branding/ui/logo";',
    component: Logo,
    defaultProps: {
      boxSize: 32,
    },
    propsSpec: [
      {
        name: "boxSize",
        type: "number",
        defaultValue: 32,
        description: "Ukuran dimensi logo dalam pixel.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => <Logo boxSize={Number(props.boxSize) || 32} />,
  },

  brand_watermark: {
    key: "brand_watermark",
    title: "Brand Watermark",
    category: "Branding",
    description: "Teks watermark hak cipta resmi dengan tautan terintegrasi.",
    importPath:
      'import { BrandWatermark } from "@/design-system/components/branding/ui/brand-watermark";',
    component: BrandWatermark,
    defaultProps: {
      textAlign: "center",
      color: "fg.muted",
    },
    propsSpec: [
      {
        name: "textAlign",
        type: '"left" | "center" | "right"',
        defaultValue: "center",
        description: "Pensejajaran horizontal teks watermark.",
        controlKind: "select",
        options: ["left", "center", "right"],
      },
      {
        name: "color",
        type: "string",
        defaultValue: "fg.muted",
        description: "Token warna teks watermark.",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <BrandWatermark
        textAlign={(props.textAlign as "left" | "center" | "right") || "center"}
        color={String(props.color || "fg.muted")}
      />
    ),
  },

  button: {
    key: "button",
    title: "Button",
    category: "Buttons & Actions",
    description:
      "Komponen interaktif utama untuk aksi pengguna dengan variasi saiz, gaya, dan status loading.",
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
        defaultValue: undefined,
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
        description: "Ukuran button.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna UI komponen.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
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
        description: "Menonaktifkan interaksi button.",
        controlKind: "boolean",
      },
    ],
  },

  button_group: {
    key: "button_group",
    title: "ButtonGroup",
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
        description: "Menyatukan border sudut tombol yang berdekatan.",
        controlKind: "boolean",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran untuk semua tombol di dalam grup.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "variant",
        type: '"solid" | "subtle" | "outline" | "ghost"',
        defaultValue: "outline",
        description: "Gaya visual grup.",
        controlKind: "select",
        options: ["solid", "subtle", "outline", "ghost"],
      },
    ],
    renderPlayground: (props) => (
      <ButtonGroup
        attached={Boolean(props.attached)}
        size={(props.size as "xs" | "sm" | "md" | "lg") || "md"}
        variant={
          (props.variant as "solid" | "subtle" | "outline" | "ghost") ||
          "outline"
        }
      >
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    ),
  },

  typography: {
    key: "typography",
    title: "Typography (P)",
    category: "Typography & Display",
    description:
      "Komponen teks standard dengan dukungan penyesuaian font size, weight, dan warna.",
    importPath:
      'import { P } from "@/design-system/components/typography/ui/p";',
    component: P,
    defaultProps: {
      children: "Exium Design System Typography Example",
      fontSize: "md",
      fontWeight: "normal",
      color: "fg.default",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Konten teks yang dipaparkan.",
        controlKind: "text",
      },
      {
        name: "fontSize",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"',
        defaultValue: "md",
        description: "Ukuran font.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      },
      {
        name: "fontWeight",
        type: '"normal" | "medium" | "semibold" | "bold"',
        defaultValue: "normal",
        description: "Ketebalan font.",
        controlKind: "select",
        options: ["normal", "medium", "semibold", "bold"],
      },
    ],
  },

  badge: {
    key: "badge",
    title: "Badge",
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
        defaultValue: undefined,
        description: "Teks atau ikon dalam badge.",
        controlKind: "text",
      },
      {
        name: "variant",
        type: '"solid" | "subtle" | "outline" | "surface"',
        defaultValue: "subtle",
        description: "Gaya tampilan badge.",
        controlKind: "select",
        options: ["solid", "subtle", "outline", "surface"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran badge.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
    ],
  },

  heading: {
    key: "heading",
    title: "Heading",
    category: "Typography & Display",
    description:
      "Elemen judul semantik dengan styling tegas dan line-height teratur.",
    importPath:
      'import { Heading } from "@/design-system/components/typography/ui/heading";',
    component: Heading,
    defaultProps: {
      children: "Exium Design System Heading",
      fontSize: "xl",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Teks judul.",
        controlKind: "text",
      },
      {
        name: "fontSize",
        type: '"md" | "lg" | "xl" | "2xl" | "3xl"',
        defaultValue: "xl",
        description: "Ukuran teks heading.",
        controlKind: "select",
        options: ["md", "lg", "xl", "2xl", "3xl"],
      },
    ],
  },

  count_badge: {
    key: "count_badge",
    title: "Count Badge",
    category: "Typography & Display",
    description:
      "Badge penghitung angka dengan pemformatan otomatis batas maksimal (misal: 99+).",
    importPath:
      'import { CountBadge } from "@/design-system/components/typography/ui/count-badge";',
    component: CountBadge,
    defaultProps: {
      count: 120,
      max: 99,
      size: "xs",
    },
    propsSpec: [
      {
        name: "count",
        type: "number",
        defaultValue: 120,
        description: "Jumlah angka yang ditampilkan.",
        controlKind: "number",
      },
      {
        name: "max",
        type: "number",
        defaultValue: 99,
        description: "Batas angka maksimum sebelum format +.",
        controlKind: "number",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md"',
        defaultValue: "xs",
        description: "Ukuran badge angka.",
        controlKind: "select",
        options: ["xs", "sm", "md"],
      },
    ],
    renderPlayground: (props) => (
      <CountBadge
        count={Number(props.count) || 0}
        max={Number(props.max) || 99}
        size={(props.size as "xs" | "sm" | "md") || "xs"}
      />
    ),
  },

  kbd: {
    key: "kbd",
    title: "Kbd",
    category: "Typography & Display",
    description: "Elemen penunjuk tombol pintasan keyboard pengguna.",
    importPath:
      'import { Kbd } from "@/design-system/components/typography/ui/kbd";',
    component: Kbd,
    defaultProps: {
      children: "Ctrl + K",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Label tombol keyboard.",
        controlKind: "text",
      },
    ],
  },

  input: {
    key: "input",
    title: "Input",
    category: "Form Inputs",
    description:
      "Input teks standar dengan validasi native maxLength dan integrasi toast peringatan.",
    importPath:
      'import { Input } from "@/design-system/components/input/ui/input";',
    component: Input,
    defaultProps: {
      placeholder: "Enter text here...",
      size: "md",
      maxLength: 20,
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Enter text here...",
        description: "Teks placeholder saat input kosong.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran field input.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "maxLength",
        type: "number",
        defaultValue: 20,
        description:
          "Batas karakter maksimal (akan memunculkan toast notifikasi bila dilewati).",
        controlKind: "number",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan input.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"260px"}>
        <Input
          placeholder={props.placeholder as string}
          size={(props.size as "xs" | "sm" | "md" | "lg") || "md"}
          maxLength={Number(props.maxLength) || 20}
          disabled={Boolean(props.disabled)}
        />
      </Box>
    ),
  },

  number_input: {
    key: "number_input",
    title: "NumberInput",
    category: "Form Inputs",
    description:
      "Input angka terstruktur dengan tombol stepper stepper atas/bawah, min/max limiter, dan format angka.",
    importPath:
      'import { NumberInput } from "@/design-system/components/input/ui/number-input";',
    component: NumberInput,
    defaultProps: {
      value: 10,
      min: 0,
      max: 100,
      step: 1,
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "value",
        type: "number",
        defaultValue: 10,
        description: "Nilai numerik saat ini.",
        controlKind: "number",
      },
      {
        name: "min",
        type: "number",
        defaultValue: 0,
        description: "Nilai minimum batas input.",
        controlKind: "number",
      },
      {
        name: "max",
        type: "number",
        defaultValue: 100,
        description: "Nilai maksimum batas input.",
        controlKind: "number",
      },
      {
        name: "step",
        type: "number",
        defaultValue: 1,
        description: "Besaran perubahan per klik stepper.",
        controlKind: "number",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran visual komponen.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan kontrol number input.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"260px"}>
        <NumberInput
          value={String(props.value ?? "10")}
          min={Number(props.min) || 0}
          max={Number(props.max) || 100}
          step={Number(props.step) || 1}
          size={(props.size as "xs" | "sm" | "md" | "lg") || "md"}
          disabled={Boolean(props.disabled)}
        />
      </Box>
    ),
  },

  password_input: {
    key: "password_input",
    title: "PasswordInput",
    category: "Form Inputs",
    description:
      "Input kata laluan aman dengan tombol toggle visibilitas show/hide terintegrasi.",
    importPath:
      'import { PasswordInput } from "@/design-system/components/input/ui/password-input";',
    component: PasswordInput,
    defaultProps: {
      placeholder: "Enter secret password...",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Enter secret password...",
        description: "Teks placeholder saat field kosong.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran field password.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan field password.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"260px"}>
        <PasswordInput {...props} />
      </Box>
    ),
  },

  select: {
    key: "select",
    title: "Select Input",
    category: "Form Inputs",
    description:
      "Komponen dropdown pilihan tunggal dengan portalling, filter, dan dukungan startElement.",
    importPath:
      'import SelectInput from "@/design-system/components/input/ui/select";',
    component: SelectInput,
    defaultProps: {
      placeholder: "Pilih status...",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Pilih status...",
        description: "Placeholder saat belum memilih opsi.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl"',
        defaultValue: "md",
        description: "Ukuran tombol trigger select.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan input select.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => <SelectPlaygroundDemo {...props} />,
  },

  focus_select: {
    key: "focus_select",
    title: "Focus Select Input",
    category: "Form Inputs",
    description:
      "Input pemilihan interaktif modal terfokus dengan search realtime dan dynamic custom option.",
    importPath:
      'import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";',
    component: FocusSelectInput,
    defaultProps: {
      placeholder: "Pilih kategori...",
      size: "md",
      clearable: true,
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Pilih kategori...",
        description: "Placeholder trigger.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl"',
        defaultValue: "md",
        description: "Ukuran field focus select.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl"],
      },
      {
        name: "clearable",
        type: "boolean",
        defaultValue: true,
        description: "Menampilkan tombol hapus pilihan.",
        controlKind: "boolean",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan input.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => <FocusSelectPlaygroundDemo {...props} />,
  },

  checkbox: {
    key: "checkbox",
    title: "Checkbox",
    category: "Form Inputs",
    description: "Elemen kotak pilihan tunggal atau ganda.",
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
        defaultValue: undefined,
        description: "Label checkbox.",
        controlKind: "text",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Warna saat ditandai.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan checkbox.",
        controlKind: "boolean",
      },
    ],
  },

  switch: {
    key: "switch",
    title: "Switch",
    category: "Form Inputs",
    description: "Toggle switch dua status (On/Off).",
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
        defaultValue: undefined,
        description: "Label sakelar switch.",
        controlKind: "text",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Warna saat aktif.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran tombol switch.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan switch.",
        controlKind: "boolean",
      },
    ],
  },

  textarea: {
    key: "textarea",
    title: "Textarea",
    category: "Form Inputs",
    description:
      "Bidang input teks multi-baris dengan perlindungan gradien floating label dan notifikasi batas karakter.",
    importPath:
      'import { Textarea } from "@/design-system/components/input/ui/textarea";',
    component: Textarea,
    defaultProps: {
      placeholder: "Tuliskan keterangan di sini...",
      disabled: false,
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Tuliskan keterangan di sini...",
        description: "Placeholder textarea.",
        controlKind: "text",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan textarea.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"340px"}>
        <Textarea {...props} />
      </Box>
    ),
  },

  radio_input: {
    key: "radio_input",
    title: "Radio Input",
    category: "Form Inputs",
    description: "Pilihan opsi tunggal eksklusif dengan radio group styling.",
    importPath:
      'import { RadioInput } from "@/design-system/components/input/ui/radio-input";',
    component: RadioInput,
    defaultProps: {
      defaultValue: "opt1",
      colorPalette: "blue",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna radio button saat terpilih.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran radio button.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan semua opsi radio input.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <RadioInput
        defaultValue={"opt1"}
        colorPalette={props.colorPalette as string}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        disabled={Boolean(props.disabled)}
        options={[
          { value: "opt1", label: "Option 1" },
          { value: "opt2", label: "Option 2" },
          { value: "opt3", label: "Option 3" },
        ]}
      />
    ),
  },

  radio_card: {
    key: "radio_card",
    title: "Radio Card",
    category: "Form Inputs",
    description:
      "Pilihan opsi berbentuk kartu interaktif dengan border dan indikator terintegrasi.",
    importPath:
      'import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";',
    component: RadioCardInput.Root,
    defaultProps: {
      defaultValue: "standard",
      colorPalette: "blue",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna border dan aksen saat kartu terpilih.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran kartu radio card.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan kartu radio card.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <RadioCardInput.Root
        defaultValue={"standard"}
        colorPalette={props.colorPalette as string}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        disabled={Boolean(props.disabled)}
        maxW={"420px"}
        w={"full"}
      >
        <HStack gap={3} w={"full"}>
          <RadioCardInput.Item value={"standard"} flex={1} p={3}>
            <RadioCardInput.ItemText>
              <P fontWeight={"semibold"} fontSize={"sm"}>
                Standard
              </P>
              <P fontSize={"xs"} color={"fg.muted"}>
                Fitur esensial
              </P>
            </RadioCardInput.ItemText>
          </RadioCardInput.Item>
          <RadioCardInput.Item value={"pro"} flex={1} p={3}>
            <RadioCardInput.ItemText>
              <P fontWeight={"semibold"} fontSize={"sm"}>
                Enterprise
              </P>
              <P fontSize={"xs"} color={"fg.muted"}>
                Akses menyeluruh
              </P>
            </RadioCardInput.ItemText>
          </RadioCardInput.Item>
        </HStack>
      </RadioCardInput.Root>
    ),
  },

  segment_group: {
    key: "segment_group",
    title: "Segment Group",
    category: "Form Inputs",
    description:
      "Kontrol tersegmentasi horizontal bergaya tab switcher untuk pilihan cepat.",
    importPath:
      'import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";',
    component: SegmentGroupInput,
    defaultProps: {
      defaultValue: "grid",
      colorPalette: "blue",
      size: "md",
      disabled: false,
    },
    propsSpec: [
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna indikator aktif.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran tombol segment control.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Menonaktifkan kontrol segment group.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <SegmentGroupInput
        defaultValue={"grid"}
        colorPalette={props.colorPalette as string}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        disabled={Boolean(props.disabled)}
        options={[
          { value: "list", label: "List View" },
          { value: "grid", label: "Grid View" },
          { value: "map", label: "Map View" },
        ]}
      />
    ),
  },

  slider: {
    key: "slider",
    title: "Slider",
    category: "Form Inputs",
    description:
      "Kontrol penggeser numerik dengan thumb interaktif dan rentang nilai presisi.",
    importPath:
      'import { Slider } from "@/design-system/components/input/ui/slider";',
    component: Slider,
    defaultProps: {
      defaultValue: [40],
      min: 0,
      max: 100,
      step: 5,
    },
    propsSpec: [
      {
        name: "min",
        type: "number",
        defaultValue: 0,
        description: "Nilai minimum slider.",
        controlKind: "number",
      },
      {
        name: "max",
        type: "number",
        defaultValue: 100,
        description: "Nilai maksimum slider.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"280px"}>
        <Slider
          defaultValue={[40]}
          min={Number(props.min) || 0}
          max={Number(props.max) || 100}
          showValue
          label={"Volume / Ukuran"}
        />
      </Box>
    ),
  },

  pin_input: {
    key: "pin_input",
    title: "Pin Input",
    category: "Form Inputs",
    description:
      "Input digit kode OTP / PIN keamanan dengan fokus otomatis per kotak digit.",
    importPath:
      'import { PinInput } from "@/design-system/components/input/ui/pin-input";',
    component: PinInput,
    defaultProps: {
      count: 4,
      mask: false,
    },
    propsSpec: [
      {
        name: "count",
        type: "number",
        defaultValue: 4,
        description: "Jumlah kotak digit input.",
        controlKind: "number",
      },
      {
        name: "mask",
        type: "boolean",
        defaultValue: false,
        description: "Menyembunyikan angka PIN (password mode).",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <PinInput count={Number(props.count) || 4} mask={Boolean(props.mask)} />
    ),
  },

  search_input: {
    key: "search_input",
    title: "Search Input",
    category: "Form Inputs",
    description:
      "Input pencarian terintegrasi dengan icon kaca pembesar dan tombol reset cepat.",
    importPath:
      'import { SearchInput } from "@/design-system/components/input/ui/search-input";',
    component: SearchInput,
    defaultProps: {
      placeholder: "Cari data di sini...",
      size: "md",
    },
    propsSpec: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Cari data di sini...",
        description: "Teks bantuan pencarian.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran kotak pencarian.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
    ],
    renderPlayground: (props) => (
      <Box w={"280px"}>
        <SearchInput
          placeholder={String(props.placeholder || "Cari data di sini...")}
          size={(props.size as "xs" | "sm" | "md" | "lg") || "md"}
        />
      </Box>
    ),
  },

  field: {
    key: "field",
    title: "Field & Fieldset",
    category: "Form Inputs",
    description:
      "Wrapper form terintegrasi dengan label mengambang, helper text, error handling, dan tag optional.",
    importPath:
      'import { Field } from "@/design-system/components/input/ui/field";',
    component: Field,
    defaultProps: {
      label: "Nama Lengkap",
      helperText: "Sesuai dengan KTP",
      optional: false,
    },
    propsSpec: [
      {
        name: "label",
        type: "string",
        defaultValue: "Nama Lengkap",
        description: "Label field.",
        controlKind: "text",
      },
      {
        name: "helperText",
        type: "string",
        defaultValue: "Sesuai dengan KTP",
        description: "Pesan pembantu di bawah field.",
        controlKind: "text",
      },
      {
        name: "optional",
        type: "boolean",
        defaultValue: false,
        description: "Tampilkan badge Optional.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"300px"}>
        <Field
          label={String(props.label || "Label")}
          helperText={String(props.helperText || "")}
          optional={Boolean(props.optional)}
        >
          <Input placeholder={"Ketikkan teks..."} />
        </Field>
      </Box>
    ),
  },

  progress: {
    key: "progress",
    title: "Progress",
    category: "Feedback & Status",
    description: "Bar kemajuan untuk indikator proses dan loading.",
    importPath:
      'import { Progress } from "@/design-system/components/feedback/ui/progress";',
    component: ProgressRoot,
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
        description: "Skema warna progress bar.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ketebalan progress bar.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: false,
        description: "Animasi garis bergaris (striped animation).",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Box w={"320px"}>
        <Progress.Root
          value={Number(props.value) || 0}
          colorPalette={props.colorPalette as string}
          size={(props.size as "xs" | "sm" | "md" | "lg") || "md"}
          striped={Boolean(props.animated)}
          animated={Boolean(props.animated)}
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>
    ),
  },

  skeleton: {
    key: "skeleton",
    title: "Skeleton",
    category: "Feedback & Status",
    description:
      "Placeholder pemuatan konten visual saat data sedang di-fetch secara asinkron.",
    importPath:
      'import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";',
    component: Skeleton,
    defaultProps: {
      loaded: false,
      variant: "shine",
    },
    propsSpec: [
      {
        name: "loaded",
        type: "boolean",
        defaultValue: false,
        description:
          "Status pemuatan. Saat bernilai true, skeleton menghilang dan menampilkan data asli.",
        controlKind: "boolean",
      },
      {
        name: "variant",
        type: '"shine" | "pulse"',
        defaultValue: "shine",
        description: "Gaya animasi shimmer skeleton.",
        controlKind: "select",
        options: ["shine", "pulse"],
      },
    ],
    renderPlayground: (props) => {
      const isLoaded = Boolean(props.loaded);
      const variant = (props.variant as "shine" | "pulse") || "shine";

      return (
        <Box
          w={"340px"}
          p={4}
          rounded={"lg"}
          border={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack gap={4} align={"center"}>
            <Skeleton
              w={"48px"}
              h={"48px"}
              rounded={"full"}
              loaded={isLoaded}
              variant={variant}
            >
              <Box
                w={"48px"}
                h={"48px"}
                rounded={"full"}
                bg={"blue.solid"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <P color={"white"} fontWeight={"bold"} fontSize={"sm"}>
                  EX
                </P>
              </Box>
            </Skeleton>

            <VStack align={"stretch"} gap={isLoaded ? "2xs" : "xs"} flex={1}>
              <Skeleton
                h={"16px"}
                w={"70%"}
                rounded={"sm"}
                loaded={isLoaded}
                variant={variant}
              >
                <P fontWeight={"semibold"} fontSize={"sm"}>
                  Exium Senior Member
                </P>
              </Skeleton>

              <Skeleton
                h={"16px"}
                w={"90%"}
                rounded={"sm"}
                loaded={isLoaded}
                variant={variant}
              >
                <P fontSize={"xs"} color={"fg.muted"}>
                  Software Engineer & Architect
                </P>
              </Skeleton>
            </VStack>
          </HStack>

          <Box
            mt={4}
            pt={3}
            borderTop={"1px solid"}
            borderColor={"border.subtle"}
          >
            <Skeleton
              h={"36px"}
              w={"full"}
              rounded={"md"}
              loaded={isLoaded}
              variant={variant}
            >
              <P fontSize={"xs"} color={"fg.subtle"} lineHeight={"tall"}>
                Data pengguna berhasil dimuat secara asynchronous dari server
                API.
              </P>
            </Skeleton>
          </Box>
        </Box>
      );
    },
  },

  alert: {
    key: "alert",
    title: "Alert",
    category: "Feedback & Status",
    description:
      "Komponen pemberitahuan status penting (info, success, warning, error) dengan ikon indikator.",
    importPath:
      'import { Alert } from "@/design-system/components/feedback/ui/alert";',
    component: Alert.Root,
    defaultProps: {
      status: "info",
    },
    propsSpec: [
      {
        name: "status",
        type: '"info" | "success" | "warning" | "error"',
        defaultValue: "info",
        description: "Status jenis peringatan.",
        controlKind: "select",
        options: ["info", "success", "warning", "error"],
      },
    ],
    renderPlayground: (props) => (
      <Box w={"full"} maxW={"420px"}>
        <Alert.Root
          status={
            (props.status as "info" | "success" | "warning" | "error") || "info"
          }
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Informasi Sistem</Alert.Title>
            <Alert.Description>
              Operasi berhasil disinkronkan dengan status{" "}
              {String(props.status || "info")}.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Box>
    ),
  },

  toast: {
    key: "toast",
    title: "Toast Notification",
    category: "Feedback & Status",
    description:
      "Notifikasi mengambang dengan timer otomatis, auto-collapse, riwayat toast, dan queue grouping.",
    importPath: 'import { toast } from "@/design-system/components/toast";',
    component: Box,
    defaultProps: {
      variant: "info",
    },
    propsSpec: [
      {
        name: "variant",
        type: '"success" | "error" | "warning" | "info" | "loading"',
        defaultValue: "info",
        description: "Varian status notifikasi toast.",
        controlKind: "select",
        options: ["success", "error", "warning", "info", "loading"],
      },
    ],
    renderPlayground: (props) => (
      <HStack gap={3} wrap={"wrap"}>
        <Button
          size={"sm"}
          colorPalette={
            props.variant === "success"
              ? "green"
              : props.variant === "error"
                ? "red"
                : props.variant === "warning"
                  ? "orange"
                  : "blue"
          }
          onClick={() => {
            const v =
              (props.variant as
                | "success"
                | "error"
                | "warning"
                | "info"
                | "loading") || "info";
            toast[v](`Contoh Toast ${v.toUpperCase()}`, {
              description: `Ini adalah pesan toast dengan status ${v}.`,
            });
          }}
        >
          Tampilkan Toast {String(props.variant || "info").toUpperCase()}
        </Button>
      </HStack>
    ),
  },

  state_display: {
    key: "state_display",
    title: "State Feedback (No Data)",
    category: "Feedback & Status",
    description:
      "Komponen ilustratif untuk halaman data kosong atau kondisi belum ada data.",
    importPath:
      'import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";',
    component: NoDataState,
    defaultProps: {
      title: "Tidak Ada Data",
      description: "Belum ada item atau rekaman data yang tersedia.",
    },
    propsSpec: [
      {
        name: "title",
        type: "string",
        defaultValue: "Tidak Ada Data",
        description: "Judul teks status kosong.",
        controlKind: "text",
      },
      {
        name: "description",
        type: "string",
        defaultValue: "Belum ada item atau rekaman data yang tersedia.",
        description: "Deskripsi bantuan status kosong.",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <NoDataState
        title={props.title as string}
        description={props.description as string}
      />
    ),
  },

  emoji: {
    key: "emoji",
    title: "Emoji",
    category: "Emoji",
    description:
      "Komponen Emoji berpotongan (sliced SVG) dengan penyesuaian dinamis colorPalette (solid, emphasized, muted, subtle).",
    importPath:
      'import { EmojiSmile, EmojiHappy, EmojiAngry, EmojiCry, EmojiSurprised, EmojiThinking } from "@/design-system/components/emoji";',
    component: EmojiPoker,
    defaultProps: {
      variant: "poker",
      colorPalette: "neutral",
      boxSize: 80,
    },
    propsSpec: [
      {
        name: "variant",
        type: "EmojiVariant",
        defaultValue: "poker",
        description: "Varian sliced emoji SVG.",
        controlKind: "select",
        options: [
          "shout",
          "wicked",
          "angry",
          "funny",
          "speechless",
          "love",
          "cool",
          "laugh",
          "embarassed",
          "rollingEyes",
          "poker",
          "cry",
          "happy",
          "sulk",
          "thinking",
          "thumbUp",
          "scream",
          "surprised",
          "sad",
        ],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "neutral",
        description:
          "Color palette theme (neutral, blue, red, teal, green, amber, purple, etc.).",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
      {
        name: "boxSize",
        type: "number",
        defaultValue: 24,
        description: "Box size emoji.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => {
      const colorPalette = (props.colorPalette as string) || "neutral";
      const boxSize = (props.boxSize as number) || 24;
      const variant = (props.variant as EmojiVariant) || "poker";

      return (
        <Emoji
          variant={variant}
          boxSize={boxSize}
          colorPalette={colorPalette}
        />
      );
    },

  },

  focus_alert: {
    key: "focus_alert",
    title: "Focus Alert Modal",
    category: "Focus Alert",
    description:
      "Modal peringatan terpusat prioritas tinggi dengan animasi ikon besar dan aksi konfirmasi.",
    importPath:
      'import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";',
    component: Box,
    defaultProps: {
      variant: "neutral",
    },
    propsSpec: [
      {
        name: "variant",
        type: '"neutral" | "info" | "warning" | "error" | "success"',
        defaultValue: "neutral",
        description: "Varian alert modal.",
        controlKind: "select",
        options: ["neutral", "info", "warning", "error", "success"],
      },
    ],
    renderPlayground: (props) => <FocusAlertPlaygroundDemo {...props} />,
  },

  data_table: {
    key: "data_table",
    title: "DataView Table",
    category: "Data Display",
    description:
      "Tabel data virtualized responsif dengan sorting, pagination, checkbox batch, dan menu aksi baris.",
    importPath:
      'import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";\nimport { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";',
    component: DataViewTable.Root,
    defaultProps: {
      withNumbering: true,
      canBatchSelect: true,
      fixedItemHeight: true,
      virtualized: true,
      page: 1,
      pageSize: 4,
    },
    propsSpec: [
      {
        name: "headers",
        type: "FormattedTableHeader[]",
        defaultValue: "[]",
        description: "Daftar definisi kolom header tabel (wajib).",
      },
      {
        name: "items",
        type: "FormattedListItem[]",
        defaultValue: "[]",
        description: "Daftar data baris tabel (wajib).",
      },
      {
        name: "itemActions",
        type: "DataViewItemActionsGenerator[]",
        defaultValue: undefined,
        description:
          "Definisi menu aksi per baris data (termasuk modal konfirmasi hapus).",
      },
      {
        name: "batchActions",
        type: "DataViewBatchActionsGenerator[]",
        defaultValue: undefined,
        description:
          "Definisi aksi batch ketika satu atau lebih baris dipilih.",
      },
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Sub-komponen Header dan Body tabel (wajib).",
      },
      {
        name: "withNumbering",
        type: "boolean",
        defaultValue: true,
        description: "Tampilkan kolom nomor urut baris data.",
        controlKind: "boolean",
      },
      {
        name: "canBatchSelect",
        type: "boolean",
        defaultValue: true,
        description: "Aktifkan kotak centang pemilihan batch baris.",
        controlKind: "boolean",
      },
      {
        name: "fixedItemHeight",
        type: "boolean",
        defaultValue: true,
        description: "Kunci tinggi baris data secara konsisten.",
        controlKind: "boolean",
      },
      {
        name: "virtualized",
        type: "boolean",
        defaultValue: true,
        description: "Gunakan rendering virtual DOM untuk data jumlah besar.",
        controlKind: "boolean",
      },
      {
        name: "page",
        type: "number",
        defaultValue: 1,
        description: "Nomor halaman aktif saat ini (minimal 1).",
        controlKind: "number",
      },
      {
        name: "pageSize",
        type: "number",
        defaultValue: 4,
        description: "Jumlah data yang ditampilkan per halaman.",
        controlKind: "select",
        options: [2, 4, 8],
      },
    ],
    renderPlayground: (props, onPropChange) => (
      <DataTablePlaygroundDemo props={props} onPropChange={onPropChange} />
    ),
  },

  clipboard: {
    key: "clipboard",
    title: "Clipboard",
    category: "Data Display",
    description:
      "Komponen salin teks satu klik ke papan klip dengan status umpan balik instan.",
    importPath:
      'import { Clipboard } from "@/design-system/components/data-display/ui/clipboard";',
    component: Clipboard.Root,
    defaultProps: {
      value: "https://volatil.atrbpn.go.id",
      timeout: 2000,
    },
    propsSpec: [
      {
        name: "value",
        type: "string",
        defaultValue: "https://volatil.atrbpn.go.id",
        description: "Nilai string yang akan disalin (wajib).",
        controlKind: "text",
      },
      {
        name: "timeout",
        type: "number",
        defaultValue: 2000,
        description: "Durasi status tersalin aktif dalam milidetik.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => (
      <Clipboard.Root
        value={String(props.value || "https://volatil.atrbpn.go.id")}
        timeout={Number(props.timeout) || 2000}
      >
        <HStack gap={2}>
          <Clipboard.Input />
          <Clipboard.Trigger asChild>
            <Button size={"sm"} variant={"outline"}>
              <AppIcon icon={CopyIcon} size={"sm"} /> Salin
            </Button>
          </Clipboard.Trigger>
        </HStack>
      </Clipboard.Root>
    ),
  },

  countdown: {
    key: "countdown",
    title: "Countdown",
    category: "Data Display",
    description:
      "Penghitung mundur waktu terformat dengan threshold perubahan warna saat mendekati batas akhir.",
    importPath:
      'import { Countdown } from "@/design-system/components/data-display/ui/countdown";',
    component: Countdown,
    defaultProps: {
      warningThresholdDays: 3,
      warningThresholdHours: 24,
    },
    propsSpec: [
      {
        name: "finishedAt",
        type: "string | Date",
        defaultValue: undefined,
        description: "Target waktu batas akhir countdown (wajib).",
        controlKind: "text",
      },
      {
        name: "warningThresholdDays",
        type: "number",
        defaultValue: 3,
        description: "Batas sisa hari sebelum warna berubah menjadi peringatan.",
        controlKind: "number",
      },
      {
        name: "warningThresholdHours",
        type: "number",
        defaultValue: 24,
        description: "Batas sisa jam sebelum warna berubah menjadi peringatan.",
        controlKind: "number",
      },
      {
        name: "finishColor",
        type: "string",
        defaultValue: "fg.error",
        description: "Token warna teks saat waktu countdown habis.",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => {
      const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString();
      return (
        <Countdown
          finishedAt={tomorrow}
          warningThresholdDays={Number(props.warningThresholdDays) || 3}
          warningThresholdHours={Number(props.warningThresholdHours) || 24}
        />
      );
    },
  },

  accordion: {
    key: "accordion",
    title: "Accordion",
    category: "Disclosure & Navigation",
    description:
      "Komponen panel lipat collapsible berlapis untuk menghemat ruang vertikal.",
    importPath:
      'import { Accordion } from "@/design-system/components/disclosure/ui/accordion";',
    component: Accordion.Root,
    defaultProps: {
      collapsible: true,
      multiple: false,
    },
    propsSpec: [
      {
        name: "defaultValue",
        type: "string[]",
        defaultValue: '["item-1"]',
        description: "Item panel yang terbuka secara default.",
        controlKind: "text",
      },
      {
        name: "collapsible",
        type: "boolean",
        defaultValue: true,
        description: "Izinkan semua panel ditutup secara bersamaan.",
        controlKind: "boolean",
      },
      {
        name: "multiple",
        type: "boolean",
        defaultValue: false,
        description: "Izinkan membuka lebih dari satu panel sekaligus.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Accordion.Root
        collapsible={Boolean(props.collapsible)}
        multiple={Boolean(props.multiple)}
        defaultValue={["item-1"]}
        w={"full"}
        maxW={"380px"}
      >
        <Accordion.Item value={"item-1"}>
          <Accordion.ItemTrigger>
            <Span flex={1}>Informasi Dokumen</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              Detail dokumen dan berkas terverifikasi di dalam sistem ATR BPN.
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
        <Accordion.Item value={"item-2"}>
          <Accordion.ItemTrigger>
            <Span flex={1}>Riwayat Sinkronisasi</Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              Sinkronisasi data layer peta spasial GeoServer terakhir berhasil.
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    ),
  },

  tabs: {
    key: "tabs",
    title: "Tabs",
    category: "Disclosure & Navigation",
    description:
      "Navigasi tab switching dengan animasi underline indicator halus.",
    importPath:
      'import { Tabs } from "@/design-system/components/disclosure/ui/tabs";',
    component: Tabs.Root,
    defaultProps: {
      variant: "line",
      size: "md",
      fitted: false,
      colorPalette: "blue",
    },
    propsSpec: [
      {
        name: "defaultValue",
        type: "string",
        defaultValue: "overview",
        description: "Nilai tab yang aktif pertama kali.",
        controlKind: "text",
      },
      {
        name: "variant",
        type: '"line" | "subtle" | "outline" | "enclosed"',
        defaultValue: "line",
        description: "Gaya visual navigasi tab.",
        controlKind: "select",
        options: ["line", "subtle", "outline", "enclosed"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran tombol tab.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "fitted",
        type: "boolean",
        defaultValue: false,
        description: "Ratakan lebar tab memenuhi lebar kontainer.",
        controlKind: "boolean",
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna aksen aktif tab.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
    ],
    renderPlayground: (props) => (
      <Tabs.Root
        defaultValue={"overview"}
        variant={
          (props.variant as "line" | "subtle" | "outline" | "enclosed") ||
          "line"
        }
        size={(props.size as "sm" | "md" | "lg") || "md"}
        fitted={Boolean(props.fitted)}
        colorPalette={(props.colorPalette as string) || "blue"}
        w={"full"}
        maxW={"380px"}
      >
        <Tabs.List>
          <Tabs.Trigger value={"overview"}>Overview</Tabs.Trigger>
          <Tabs.Trigger value={"specs"}>Spesifikasi</Tabs.Trigger>
          <Tabs.Trigger value={"history"}>Riwayat</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={"overview"} pt={3}>
          <P fontSize={"sm"} color={"fg.muted"}>
            Konten tab Overview terpilih.
          </P>
        </Tabs.Content>
        <Tabs.Content value={"specs"} pt={3}>
          <P fontSize={"sm"} color={"fg.muted"}>
            Konten spesifikasi teknis dan rincian.
          </P>
        </Tabs.Content>
        <Tabs.Content value={"history"} pt={3}>
          <P fontSize={"sm"} color={"fg.muted"}>
            Riwayat perubahan data.
          </P>
        </Tabs.Content>
      </Tabs.Root>
    ),
  },

  steps: {
    key: "steps",
    title: "Steps",
    category: "Disclosure & Navigation",
    description: "Indikator alur proses bertahap bertingkat (wizard/stepper).",
    importPath:
      'import { Steps } from "@/design-system/components/disclosure/ui/steps";',
    component: Steps.Root,
    defaultProps: {
      defaultStep: 1,
      count: 3,
      size: "md",
      colorPalette: "blue",
    },
    propsSpec: [
      {
        name: "count",
        type: "number",
        defaultValue: 3,
        description: "Jumlah total langkah proses (wajib).",
        controlKind: "number",
      },
      {
        name: "defaultStep",
        type: "number",
        defaultValue: 1,
        description: "Langkah aktif awal (0-indexed).",
        controlKind: "number",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran indikator lingkaran step.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna aksen langkah aktif.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
    ],
    renderPlayground: (props) => (
      <Steps.Root
        defaultStep={Number(props.defaultStep) || 1}
        count={Number(props.count) || 3}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        colorPalette={(props.colorPalette as string) || "blue"}
        maxW={"380px"}
        w={"full"}
      >
        <Steps.List>
          <Steps.Item index={0} title={"Langkah 1"}>
            <Steps.Indicator />
            <Steps.Title>Biodata</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={1} title={"Langkah 2"}>
            <Steps.Indicator />
            <Steps.Title>Berkas</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
          <Steps.Item index={2} title={"Langkah 3"}>
            <Steps.Indicator />
            <Steps.Title>Selesai</Steps.Title>
          </Steps.Item>
        </Steps.List>
      </Steps.Root>
    ),
  },

  collapsible: {
    key: "collapsible",
    title: "Collapsible",
    category: "Disclosure & Navigation",
    description:
      "Elemen ekspansi buka/tutup sederhana dengan animasi transisi.",
    importPath:
      'import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";',
    component: Collapsible.Root,
    defaultProps: {
      defaultOpen: true,
      unmountOnExit: false,
    },
    propsSpec: [
      {
        name: "defaultOpen",
        type: "boolean",
        defaultValue: true,
        description: "Status awal konten dalam keadaan terbuka.",
        controlKind: "boolean",
      },
      {
        name: "unmountOnExit",
        type: "boolean",
        defaultValue: false,
        description: "Unmount elemen DOM saat ditutup.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Collapsible.Root
        defaultOpen={Boolean(props.defaultOpen)}
        unmountOnExit={Boolean(props.unmountOnExit)}
        w={"full"}
        maxW={"320px"}
      >
        <Collapsible.Trigger asChild>
          <Button variant={"outline"} size={"sm"}>
            Toggle Konten Tambahan
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content pt={3}>
          <Box p={3} rounded={"md"} bg={"bg.subtle"}>
            <P fontSize={"xs"}>
              Ini adalah konten tersembunyi di dalam Collapsible.
            </P>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    ),
  },

  breadcrumb: {
    key: "breadcrumb",
    title: "Breadcrumb",
    category: "Disclosure & Navigation",
    description:
      "Navigasi remah roti untuk menunjukkan hierarki rute halaman pengguna.",
    importPath:
      'import { Breadcrumb } from "@/design-system/components/disclosure/ui/breadcrumb";',
    component: Breadcrumb.Root,
    defaultProps: {
      separator: "/",
      size: "md",
    },
    propsSpec: [
      {
        name: "separator",
        type: "string",
        defaultValue: "/",
        description: "Karakter pemisah antar tingkatan navigasi.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran teks breadcrumb.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
    ],
    renderPlayground: (props) => (
      <Breadcrumb.Root size={(props.size as "sm" | "md" | "lg") || "md"}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href={"#"}>Beranda</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>{String(props.separator || "/")}</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.Link href={"#"}>Manajemen Data</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator>{String(props.separator || "/")}</Breadcrumb.Separator>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>Spasial</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    ),
  },

  carousel: {
    key: "carousel",
    title: "Carousel",
    category: "Disclosure & Navigation",
    description:
      "Slider tayangan bergambar atau konten kartu bergerak dengan navigasi tombol dan indikator titik.",
    importPath:
      'import { Carousel } from "@/design-system/components/disclosure/ui/carousel";',
    component: Carousel.Root,
    defaultProps: {
      slideCount: 4,
      loop: true,
      autoplay: false,
    },
    propsSpec: [
      {
        name: "slideCount",
        type: "number",
        defaultValue: 4,
        description: "Jumlah total item slide (wajib).",
        controlKind: "number",
      },
      {
        name: "loop",
        type: "boolean",
        defaultValue: true,
        description: "Putar kembali slide dari awal setelah slide terakhir.",
        controlKind: "boolean",
      },
      {
        name: "autoplay",
        type: "boolean",
        defaultValue: false,
        description: "Otomatis berpindah slide secara bergantian.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => {
      const carouselImages = [
        "https://images.unsplash.com/photo-1656433031375-5042f5afe894?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2371",
        "https://images.unsplash.com/photo-1587466412525-87497b34fc88?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2673",
        "https://images.unsplash.com/photo-1629581688635-5d88654e5bdd?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2831",
        "https://images.unsplash.com/photo-1661030420948-862787de0056?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2370",
      ];
      const count = Math.min(
        Math.max(1, Number(props.slideCount) || 4),
        carouselImages.length,
      );
      const displayImages = carouselImages.slice(0, count);

      return (
        <Carousel.Root
          loop={Boolean(props.loop)}
          autoplay={Boolean(props.autoplay)}
          slideCount={displayImages.length}
          w={"350px"}
          maxW={"350px"}
          pos={"relative"}
        >
          <Carousel.Control>
            <Carousel.ItemGroup width={"full"}>
              {displayImages.map((src, index) => (
                <Carousel.Item key={index} index={index}>
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    objectFit={"cover"}
                    aspectRatio={16 / 9}
                    w={"full"}
                    rounded={"md"}
                  />
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>

            <HStack
              align={"center"}
              justify={"space-between"}
              w={"full"}
              px={2}
              pos={"absolute"}
              top={"50%"}
              transform={"translateY(-50%)"}
            >
              <Carousel.PrevTrigger asChild>
                <Carousel.ActionButton
                  size={"sm"}
                  color={"white"}
                  borderColor={"border.subtle"}
                  bg={"blackAlpha.600"}
                  _hover={{ bg: "blackAlpha.800" }}
                >
                  <LuArrowLeft />
                </Carousel.ActionButton>
              </Carousel.PrevTrigger>

              <Carousel.NextTrigger asChild>
                <Carousel.ActionButton
                  size={"sm"}
                  color={"white"}
                  borderColor={"border.subtle"}
                  bg={"blackAlpha.600"}
                  _hover={{ bg: "blackAlpha.800" }}
                >
                  <LuArrowRight />
                </Carousel.ActionButton>
              </Carousel.NextTrigger>
            </HStack>

            <Box pos={"absolute"} bottom={2} w={"full"}>
              <Carousel.Indicators
                bg={"whiteAlpha.700"}
                boxSize={1.5}
                transition={"200ms"}
                transformOrigin={"center"}
                _current={{
                  width: 5,
                  opacity: 1,
                  bg: "white",
                }}
              />
            </Box>
          </Carousel.Control>
        </Carousel.Root>
      );
    },
  },

  dialog: {
    key: "dialog",
    title: "Dialog Modal",
    category: "Overlays & Modals",
    description:
      "Komponen modal mengambang dengan transisi, backdrop, dan kontrol tombol tutup.",
    importPath:
      'import { Dialog } from "@/design-system/components/overlay/ui/dialog";',
    component: Dialog.Root,
    defaultProps: {
      size: "md",
      placement: "center",
      scrollBehavior: "inside",
    },
    propsSpec: [
      {
        name: "modalKey",
        type: "string",
        defaultValue: "docs-dialog",
        description: "Kunci identitas unik modal popup (wajib).",
        controlKind: "text",
      },
      {
        name: "opened",
        type: "boolean",
        defaultValue: false,
        description: "Status keterbukaan modal dialog (wajib).",
        controlKind: "boolean",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "full"',
        defaultValue: "md",
        description: "Ukuran lebar modal dialog.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "full"],
      },
      {
        name: "placement",
        type: '"center" | "top"',
        defaultValue: "center",
        description: "Posisi peletakan dialog pada layar.",
        controlKind: "select",
        options: ["center", "top"],
      },
      {
        name: "scrollBehavior",
        type: '"inside" | "outside"',
        defaultValue: "inside",
        description: "Perilaku scroll konten jika melebihi tinggi layar.",
        controlKind: "select",
        options: ["inside", "outside"],
      },
    ],
    renderPlayground: (props) => <DialogPlaygroundDemo {...props} />,
  },

  drawer: {
    key: "drawer",
    title: "Drawer",
    category: "Overlays & Modals",
    description:
      "Panel geser dari tepi layar untuk form samping, filter, atau menu sekunder.",
    importPath:
      'import { Drawer } from "@/design-system/components/overlay/ui/drawer";',
    component: Drawer.Root,
    defaultProps: {
      placement: "end",
      size: "md",
    },
    propsSpec: [
      {
        name: "modalKey",
        type: "string",
        defaultValue: "docs-drawer",
        description: "Kunci identitas unik drawer samping (wajib).",
        controlKind: "text",
      },
      {
        name: "opened",
        type: "boolean",
        defaultValue: false,
        description: "Status visibilitas terbuka drawer (wajib).",
        controlKind: "boolean",
      },
      {
        name: "placement",
        type: '"start" | "end" | "top" | "bottom"',
        defaultValue: "end",
        description: "Sisi tepi layar tempat drawer muncul.",
        controlKind: "select",
        options: ["start", "end", "top", "bottom"],
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "full"',
        defaultValue: "md",
        description: "Dimensi ketebalan drawer.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "full"],
      },
    ],
    renderPlayground: (props) => <DrawerPlaygroundDemo {...props} />,
  },

  popover: {
    key: "popover",
    title: "Popover",
    category: "Overlays & Modals",
    description: "Panel mengambang interaktif terikat pada elemen pemicu.",
    importPath:
      'import { Popover } from "@/design-system/components/overlay/ui/popover";',
    component: Popover.Root,
    defaultProps: {
      modal: false,
      portalled: true,
    },
    propsSpec: [
      {
        name: "modal",
        type: "boolean",
        defaultValue: false,
        description: "Cegah interaksi di luar area popover saat terbuka.",
        controlKind: "boolean",
      },
      {
        name: "portalled",
        type: "boolean",
        defaultValue: true,
        description: "Render popover ke dalam portal body terpisah.",
        controlKind: "boolean",
      },
    ],
    renderPlayground: (props) => (
      <Popover.Root
        modal={Boolean(props.modal)}
        portalled={Boolean(props.portalled)}
      >
        <Popover.Trigger asChild>
          <Button variant={"outline"}>Klik Popover</Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content p={4} maxW={"260px"}>
            <Popover.Header>
              <P fontWeight={"bold"}>Detail Info</P>
            </Popover.Header>
            <Popover.Body>
              <P fontSize={"sm"} color={"fg.muted"}>
                Ini adalah konten informasi di dalam Popover floating box.
              </P>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    ),
  },

  tooltip: {
    key: "tooltip",
    title: "Tooltip",
    category: "Overlays & Modals",
    description:
      "Pesan informasi singkat saat pengguna mengarahkan kursor (hover) di atas elemen.",
    importPath:
      'import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";',
    component: Tooltip,
    defaultProps: {
      content: "Tooltip info bantuan",
      disabled: false,
      openDelay: 300,
      closeDelay: 200,
    },
    propsSpec: [
      {
        name: "content",
        type: "ReactNode",
        defaultValue: "Tooltip info bantuan",
        description: "Teks atau konten isi tooltip (wajib).",
        controlKind: "text",
      },
      {
        name: "children",
        type: "ReactElement",
        defaultValue: undefined,
        description: "Elemen target trigger tooltip (wajib).",
        controlKind: "text",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "Nonaktifkan tampilan tooltip.",
        controlKind: "boolean",
      },
      {
        name: "openDelay",
        type: "number",
        defaultValue: 300,
        description: "Jeda waktu buka tooltip (ms).",
        controlKind: "number",
      },
      {
        name: "closeDelay",
        type: "number",
        defaultValue: 200,
        description: "Jeda waktu tutup tooltip (ms).",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => (
      <Tooltip
        content={String(props.content || "Tooltip info bantuan")}
        disabled={Boolean(props.disabled)}
        openDelay={Number(props.openDelay) || 300}
        closeDelay={Number(props.closeDelay) || 200}
      >
        <Button variant={"outline"}>Arahkan Mouse ke Sini</Button>
      </Tooltip>
    ),
  },

  menu: {
    key: "menu",
    title: "Menu",
    category: "Overlays & Modals",
    description:
      "Menu dropdown aksi pilihan dengan navigasi keyboard dan pemisahan kategori.",
    importPath:
      'import { Menu } from "@/design-system/components/overlay/ui/menu";',
    component: Menu.Root,
    defaultProps: {
      size: "md",
      variant: "subtle",
    },
    propsSpec: [
      {
        name: "size",
        type: '"sm" | "md"',
        defaultValue: "md",
        description: "Ukuran item menu.",
        controlKind: "select",
        options: ["sm", "md"],
      },
      {
        name: "variant",
        type: '"subtle" | "solid"',
        defaultValue: "subtle",
        description: "Gaya visual latar menu terpilih.",
        controlKind: "select",
        options: ["subtle", "solid"],
      },
    ],
    renderPlayground: (props) => (
      <Menu.Root
        size={(props.size as "sm" | "md") || "md"}
        variant={(props.variant as "subtle" | "solid") || "subtle"}
      >
        <Menu.Trigger asChild>
          <Button variant={"outline"}>
            Buka Menu Pilihan <AppIcon icon={ChevronDownIcon} size={"sm"} />
          </Button>
        </Menu.Trigger>
        <Menu.Content minW={"160px"}>
          <Menu.Item value={"profile"}>Profil Saya</Menu.Item>
          <Menu.Item value={"settings"}>Pengaturan</Menu.Item>
          <Menu.Item value={"logout"} color={"fg.error"}>
            Keluar
          </Menu.Item>
        </Menu.Content>
      </Menu.Root>
    ),
  },

  box: {
    key: "box",
    title: "Box",
    category: "Layout & Structure",
    description:
      "Komponen dasar kontainer layout serbaguna dengan dukungan token tema Chakra.",
    importPath:
      'import { Box } from "@/design-system/components/layout/ui/box";',
    component: Box,
    defaultProps: {
      p: 4,
      bg: "bg.subtle",
      rounded: "lg",
    },
    propsSpec: [
      {
        name: "p",
        type: "number | string",
        defaultValue: 4,
        description: "Besaran padding kontainer.",
        controlKind: "number",
      },
      {
        name: "bg",
        type: '"bg.subtle" | "bg.muted" | "bg.panel"',
        defaultValue: "bg.subtle",
        description: "Warna latar kontainer.",
        controlKind: "select",
        options: ["bg.subtle", "bg.muted", "bg.panel"],
      },
      {
        name: "rounded",
        type: '"none" | "sm" | "md" | "lg" | "full"',
        defaultValue: "lg",
        description: "Radius sudut border.",
        controlKind: "select",
        options: ["none", "sm", "md", "lg", "full"],
      },
    ],
    renderPlayground: (props) => (
      <Box
        p={Number(props.p) || 4}
        rounded={(props.rounded as "lg") || "lg"}
        bg={String(props.bg || "bg.subtle")}
        border={"1px solid"}
        borderColor={"border.subtle"}
      >
        <P fontWeight={"semibold"}>Exium Layout Box</P>
        <P fontSize={"sm"} color={"fg.muted"}>
          Kontainer layout dasar serbaguna untuk membangun struktur antarmuka.
        </P>
      </Box>
    ),
  },

  flex_box: {
    key: "flex_box",
    title: "HStack / VStack",
    category: "Layout & Structure",
    description:
      "Kontainer susunan fleksibel vertikal (VStack) atau horizontal (HStack) dengan alignment presisi.",
    importPath:
      'import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";',
    component: HStack,
    defaultProps: {
      direction: "horizontal",
      gap: 3,
      align: "center",
      justify: "start",
    },
    propsSpec: [
      {
        name: "direction",
        type: '"horizontal" | "vertical"',
        defaultValue: "horizontal",
        description: "Arah orientasi stack (HStack horizontal vs VStack vertikal).",
        controlKind: "select",
        options: ["horizontal", "vertical"],
      },
      {
        name: "gap",
        type: "number | string",
        defaultValue: 3,
        description: "Jarak spasi antar anak elemen.",
        controlKind: "number",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: "center",
        description: "Pensejajaran sumbu silang (cross-axis alignment).",
        controlKind: "select",
        options: ["start", "center", "end"],
      },
      {
        name: "justify",
        type: '"start" | "center" | "end" | "space-between"',
        defaultValue: "start",
        description: "Pensejajaran sumbu utama (main-axis alignment).",
        controlKind: "select",
        options: ["start", "center", "end", "space-between"],
      },
    ],
    renderPlayground: (props) => {
      const isVertical = props.direction === "vertical";
      const StackComp = isVertical ? VStack : HStack;

      return (
        <StackComp
          gap={Number(props.gap) || 3}
          align={(props.align as "center") || "center"}
          justify={(props.justify as "start") || "start"}
          w={"full"}
          maxW={isVertical ? "260px" : "380px"}
          p={3}
          border={"1px dashed"}
          borderColor={"border.subtle"}
          rounded={"md"}
        >
          <Box p={3} bg={"blue.subtle"} rounded={"md"} textAlign={"center"} w={isVertical ? "full" : "auto"}>
            <P fontSize={"xs"} fontWeight={"bold"} color={"blue.fg"}>Item 1</P>
          </Box>
          <Box p={3} bg={"teal.subtle"} rounded={"md"} textAlign={"center"} w={isVertical ? "full" : "auto"}>
            <P fontSize={"xs"} fontWeight={"bold"} color={"teal.fg"}>Item 2</P>
          </Box>
          <Box p={3} bg={"purple.subtle"} rounded={"md"} textAlign={"center"} w={isVertical ? "full" : "auto"}>
            <P fontSize={"xs"} fontWeight={"bold"} color={"purple.fg"}>Item 3</P>
          </Box>
        </StackComp>
      );
    },
  },

  grid: {
    key: "grid",
    title: "SimpleGrid",
    category: "Layout & Structure",
    description:
      "Grid responsif yang mudah digunakan untuk menyusun kartu dan elemen multi-kolom.",
    importPath:
      'import { SimpleGrid } from "@/design-system/components/layout/ui/grid";',
    component: SimpleGrid,
    defaultProps: {
      columns: 3,
      gap: 3,
    },
    propsSpec: [
      {
        name: "columns",
        type: "number",
        defaultValue: 3,
        description: "Jumlah kolom grid.",
        controlKind: "number",
      },
      {
        name: "gap",
        type: "number | string",
        defaultValue: 3,
        description: "Jarak spasi antar item.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props) => (
      <SimpleGrid
        columns={Number(props.columns) || 3}
        gap={Number(props.gap) || 3}
        w={"full"}
        maxW={"400px"}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Box
            key={item}
            p={3}
            rounded={"md"}
            bg={"bg.muted"}
            textAlign={"center"}
          >
            <P fontSize={"xs"} fontWeight={"bold"}>
              Item {item}
            </P>
          </Box>
        ))}
      </SimpleGrid>
    ),
  },

  card: {
    key: "card",
    title: "Card",
    category: "Layout & Structure",
    description:
      "Kartu presentasi informasi modular dengan container token styling.",
    importPath:
      'import { Card } from "@/design-system/components/layout/ui/card";',
    component: Card.Root,
    defaultProps: {
      variant: "outline",
      size: "md",
    },
    propsSpec: [
      {
        name: "variant",
        type: '"outline" | "subtle" | "elevated"',
        defaultValue: "outline",
        description: "Gaya visual tampilan kartu.",
        controlKind: "select",
        options: ["outline", "subtle", "elevated"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description: "Ukuran padding dan konten kartu.",
        controlKind: "select",
        options: ["sm", "md", "lg"],
      },
    ],
    renderPlayground: (props) => (
      <Card.Root
        variant={(props.variant as "outline" | "subtle" | "elevated") || "outline"}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        maxW={"320px"}
        w={"full"}
      >
        <Card.Header>
          <P fontWeight={"bold"}>Exium Card</P>
        </Card.Header>
        <Card.Body>
          <P fontSize={"sm"} color={"fg.muted"}>
            Kartu layout dengan styling border, padding, dan background serasi
            tema.
          </P>
        </Card.Body>
      </Card.Root>
    ),
  },

  container: {
    key: "container",
    title: "Container",
    category: "Layout & Structure",
    description:
      "Kontainer pembungkus halaman dengan header terintegrasi dan responsivitas adaptif.",
    importPath:
      'import { Container } from "@/design-system/components/layout/ui/container";',
    component: Container.Root,
    defaultProps: {
      withContext: false,
    },
    propsSpec: [
      {
        name: "withContext",
        type: "boolean",
        defaultValue: false,
        description: "Sediakan konteks dimensi container kepada sub-komponen.",
        controlKind: "boolean",
      },
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Sub-komponen Header dan Body container (wajib).",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <Container.Root
        withContext={Boolean(props.withContext)}
        w={"full"}
        maxW={"380px"}
      >
        <Container.Header title={"Container Title"} />
        <Container.Body p={4}>
          <P fontSize={"sm"} color={"fg.muted"}>
            Isi konten dalam container box.
          </P>
        </Container.Body>
      </Container.Root>
    ),
  },

  separator: {
    key: "separator",
    title: "Separator",
    category: "Layout & Structure",
    description:
      "Garis pemisah visual horizontal atau vertikal antar bagian antarmuka.",
    importPath:
      'import { Separator } from "@/design-system/components/layout/ui/separator";',
    component: Separator,
    defaultProps: {
      orientation: "horizontal",
      size: "sm",
    },
    propsSpec: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: "horizontal",
        description: "Arah garis pemisah.",
        controlKind: "select",
        options: ["horizontal", "vertical"],
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg"',
        defaultValue: "sm",
        description: "Ketebalan garis pemisah.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg"],
      },
    ],
    renderPlayground: (props) => {
      const isVertical = props.orientation === "vertical";
      const size = (props.size as "xs" | "sm" | "md" | "lg") || "sm";

      if (isVertical) {
        return (
          <HStack gap={4} h={"70px"} align={"center"} justify={"center"} p={4} border={"1px dashed"} borderColor={"border.subtle"} rounded={"md"}>
            <P fontSize={"sm"} fontWeight={"medium"}>Sisi Kiri</P>
            <Separator orientation={"vertical"} size={size} h={"40px"} />
            <P fontSize={"sm"} fontWeight={"medium"}>Sisi Kanan</P>
          </HStack>
        );
      }

      return (
        <VStack gap={3} w={"full"} maxW={"300px"} p={4} border={"1px dashed"} borderColor={"border.subtle"} rounded={"md"}>
          <P fontSize={"sm"} fontWeight={"medium"}>Bagian Atas</P>
          <Separator orientation={"horizontal"} size={size} w={"full"} />
          <P fontSize={"sm"} fontWeight={"medium"}>Bagian Bawah</P>
        </VStack>
      );
    },
  },

  sidebar: {
    key: "sidebar",
    title: "Sidebar",
    category: "Navigation & Shell",
    description:
      "Bilah navigasi samping vertikal dengan toggle perluasan (expand/collapse) dan penyimpanan state.",
    importPath:
      'import { Sidebar } from "@/design-system/components/navigation/ui/sidebar";',
    component: Sidebar.Root,
    defaultProps: {
      expanded: true,
      expandable: true,
    },
    propsSpec: [
      {
        name: "expanded",
        type: "boolean",
        defaultValue: true,
        description: "Status buka/tutup bilah navigasi sidebar.",
        controlKind: "boolean",
      },
      {
        name: "expandable",
        type: "boolean",
        defaultValue: true,
        description: "Aktifkan kemampuan expand & collapse sidebar.",
        controlKind: "boolean",
      },
      {
        name: "collapsedWidth",
        type: "number",
        defaultValue: 60,
        description: "Lebar saat sidebar dalam keadaan collapsed.",
        controlKind: "number",
      },
      {
        name: "expandedWidth",
        type: "number",
        defaultValue: 240,
        description: "Lebar saat sidebar dalam keadaan expanded.",
        controlKind: "number",
      },
    ],
    renderPlayground: (props, onPropChange) => {
      const isExpanded = Boolean(props.expanded);
      const isExpandable = Boolean(props.expandable);

      return (
        <Box
          h={"240px"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          rounded={"md"}
          bg={"bg.canvas"}
          pos={"relative"}
        >
          <Sidebar.Root
            sidebarKey={"demo-playground-sidebar"}
            expandable={isExpandable}
            expanded={isExpanded}
            onExpandedChange={(next) => onPropChange?.("expanded", next)}
            collapsedWidth={Number(props.collapsedWidth) || 60}
            expandedWidth={Number(props.expandedWidth) || 240}
          >
            <Sidebar.Header px={3} py={3} justify={isExpanded ? "space-between" : "center"}>
              <HStack gap={2} align={"center"} overflow={"hidden"}>
                <Box
                  boxSize={7}
                  minW={7}
                  rounded={"md"}
                  bg={"blue.solid"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexShrink={0}
                >
                  <AppIcon icon={SparklesIcon} size={"xs"} color={"white"} />
                </Box>
                {isExpanded && (
                  <P fontWeight={"bold"} fontSize={"sm"} truncate>
                    Exium App
                  </P>
                )}
              </HStack>
            </Sidebar.Header>

            <Sidebar.Separator mx={-1} />

            <Sidebar.Body p={2} gap={1} align={isExpanded ? "stretch" : "center"}>
              <Tooltip content={"Beranda"} disabled={isExpanded} positioning={{ placement: "right" }}>
                <HStack
                  p={2}
                  rounded={"md"}
                  bg={"blue.subtle"}
                  color={"blue.fg"}
                  gap={2.5}
                  cursor={"pointer"}
                  w={isExpanded ? "full" : "auto"}
                  justify={isExpanded ? "start" : "center"}
                >
                  <AppIcon icon={HomeIcon} size={"sm"} flexShrink={0} />
                  {isExpanded && (
                    <P fontSize={"xs"} fontWeight={"semibold"} truncate>
                      Beranda
                    </P>
                  )}
                </HStack>
              </Tooltip>

              <Tooltip content={"Pengaturan"} disabled={isExpanded} positioning={{ placement: "right" }}>
                <HStack
                  p={2}
                  rounded={"md"}
                  _hover={{ bg: "bg.muted" }}
                  gap={2.5}
                  cursor={"pointer"}
                  w={isExpanded ? "full" : "auto"}
                  justify={isExpanded ? "start" : "center"}
                >
                  <AppIcon icon={SettingsIcon} size={"sm"} flexShrink={0} />
                  {isExpanded && (
                    <P fontSize={"xs"} color={"fg.muted"} truncate>
                      Pengaturan
                    </P>
                  )}
                </HStack>
              </Tooltip>
            </Sidebar.Body>
          </Sidebar.Root>
        </Box>
      );
    },
  },

  link: {
    key: "link",
    title: "Link",
    category: "Navigation & Shell",
    description:
      "Tautan eksternal dengan target _blank dan styling underline saat di-hover.",
    importPath:
      'import { ExternalLink } from "@/design-system/components/navigation/ui/link";',
    component: ExternalLink,
    defaultProps: {
      href: "https://atrbpn.go.id",
      children: "Kunjungi Situs ATR BPN",
    },
    propsSpec: [
      {
        name: "href",
        type: "string",
        defaultValue: "https://atrbpn.go.id",
        description: "Alamat URL tujuan tautan (wajib).",
        controlKind: "text",
      },
      {
        name: "children",
        type: "ReactNode",
        defaultValue: "Kunjungi Situs ATR BPN",
        description: "Teks atau elemen anak tautan.",
        controlKind: "text",
      },
      {
        name: "target",
        type: '"_blank" | "_self"',
        defaultValue: "_blank",
        description: "Target pembukaan link browser.",
        controlKind: "select",
        options: ["_blank", "_self"],
      },
    ],
    renderPlayground: (props) => (
      <ExternalLink href={String(props.href || "https://atrbpn.go.id")}>
        {String(props.children || "Kunjungi Situs ATR BPN")}
      </ExternalLink>
    ),
  },

  avatar: {
    key: "avatar",
    title: "Avatar",
    category: "Media & Icons",
    description:
      "Gambar profil pengguna dengan fallback inisial nama otomatis dan status pemuatan.",
    importPath:
      'import { Avatar } from "@/design-system/components/media/ui/avatar";',
    component: Avatar,
    defaultProps: {
      name: "Sulenq Jolitos",
      size: "lg",
      src: "",
      shape: "full",
    },
    propsSpec: [
      {
        name: "name",
        type: "string",
        defaultValue: "Sulenq Jolitos",
        description: "Nama pengguna untuk fallback inisial.",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"',
        defaultValue: "lg",
        description: "Ukuran avatar.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      },
      {
        name: "src",
        type: "string",
        defaultValue: "",
        description: "URL gambar foto profil pengguna.",
        controlKind: "text",
      },
      {
        name: "shape",
        type: '"square" | "rounded" | "full"',
        defaultValue: "full",
        description: "Bentuk bingkai avatar.",
        controlKind: "select",
        options: ["square", "rounded", "full"],
      },
      {
        name: "loading",
        type: '"eager" | "lazy"',
        defaultValue: "lazy",
        description: "Strategi pemuatan gambar.",
        controlKind: "select",
        options: ["eager", "lazy"],
      },
    ],
    renderPlayground: (props) => (
      <Avatar
        name={String(props.name || "Sulenq Jolitos")}
        size={(props.size as "lg") || "lg"}
        src={String(props.src || "")}
        shape={(props.shape as "square" | "rounded" | "full") || "full"}
      />
    ),
  },

  image: {
    key: "image",
    title: "Image",
    category: "Media & Icons",
    description:
      "Komponen gambar responsif dengan penanganan rasio aspek dan border rounded.",
    importPath:
      'import { Image } from "@/design-system/components/media/ui/image";',
    component: Image,
    defaultProps: {
      src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      alt: "Contoh Gambar",
      aspectRatio: 1.77,
      withSkeleton: true,
      objectFit: "cover",
    },
    propsSpec: [
      {
        name: "src",
        type: "string",
        defaultValue:
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
        description: "URL tautan sumber gambar (wajib).",
        controlKind: "text",
      },
      {
        name: "alt",
        type: "string",
        defaultValue: "Contoh Gambar",
        description: "Teks alternatif deskripsi gambar (wajib).",
        controlKind: "text",
      },
      {
        name: "aspectRatio",
        type: "number",
        defaultValue: 1.77,
        description: "Rasio aspek gambar (lebar / tinggi).",
        controlKind: "number",
      },
      {
        name: "withSkeleton",
        type: "boolean",
        defaultValue: true,
        description: "Tampilkan skeleton saat gambar dalam proses loading.",
        controlKind: "boolean",
      },
      {
        name: "objectFit",
        type: '"cover" | "contain" | "fill"',
        defaultValue: "cover",
        description: "Perilaku penyesuaian gambar dalam kontainer.",
        controlKind: "select",
        options: ["cover", "contain", "fill"],
      },
    ],
    renderPlayground: (props) => (
      <Image
        src={
          String(
            props.src ||
              "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
          )
        }
        alt={String(props.alt || "Contoh Gambar")}
        aspectRatio={Number(props.aspectRatio) || 1.77}
        withSkeleton={Boolean(props.withSkeleton)}
        objectFit={
          (props.objectFit as "cover" | "contain" | "fill") || "cover"
        }
        w={"260px"}
        rounded={"lg"}
      />
    ),
  },

  app_icon: {
    key: "app_icon",
    title: "App Icon",
    category: "Media & Icons",
    description:
      "Komponen ikon serbaguna pembungkus Lucide & Tabler Icons dengan token saiz seragam.",
    importPath:
      'import { AppIcon } from "@/design-system/components/icon/ui/app-icon";',
    component: AppIcon,
    defaultProps: {
      size: "lg",
      colorPalette: "blue",
    },
    propsSpec: [
      {
        name: "icon",
        type: "ComponentType",
        defaultValue: undefined,
        description: "Komponen SVG Icon dari Lucide atau Tabler Icons (wajib).",
        controlKind: "text",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"',
        defaultValue: "lg",
        description: "Ukuran ikon.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "blue",
        description: "Skema warna ikon.",
        controlKind: "select",
        options: COLOR_PALETTE_OPTIONS,
      },
    ],
    renderPlayground: (props) => (
      <HStack gap={4} colorPalette={(props.colorPalette as string) || "blue"}>
        <AppIcon icon={SparklesIcon} size={(props.size as "lg") || "lg"} />
        <AppIcon icon={InfoIcon} size={(props.size as "lg") || "lg"} />
        <AppIcon icon={BellIcon} size={(props.size as "lg") || "lg"} />
      </HStack>
    ),
  },

  utilities: {
    key: "utilities",
    title: "Utilities & Downloads",
    category: "Utilities & System",
    description:
      "Utilitas pengunduh berkas otomatis (DownloadTrigger) dan helper ekosistem.",
    importPath:
      'import { DownloadTrigger } from "@/design-system/components/utilities/ui/download-trigger";',
    component: Box,
    defaultProps: {
      fileName: "exium-doc.txt",
      mimeType: "text/plain",
    },
    propsSpec: [
      {
        name: "data",
        type: "() => Promise<Blob> | Blob | string",
        defaultValue: undefined,
        description: "Fungsi async atau data Blob yang akan didownload (wajib).",
        controlKind: "text",
      },
      {
        name: "fileName",
        type: "string",
        defaultValue: "exium-doc.txt",
        description: "Nama file berkas yang akan diunduh (wajib).",
        controlKind: "text",
      },
      {
        name: "mimeType",
        type: "string",
        defaultValue: "text/plain",
        description: "Tipe MIME konten file.",
        controlKind: "text",
      },
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Tombol atau elemen pemicu download (wajib).",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <DownloadTrigger
        data={async () =>
          new Blob(["Contoh file download teks Exium DS"], {
            type: String(props.mimeType || "text/plain"),
          })
        }
        fileName={String(props.fileName || "exium-doc.txt")}
        mimeType={String(props.mimeType || "text/plain")}
      >
        <Button variant={"outline"}>
          Download File ({String(props.fileName || "exium-doc.txt")})
        </Button>
      </DownloadTrigger>
    ),
  },
};

const SelectPlaygroundDemo = (props: Record<string, unknown>) => {
  return (
    <Box w={"260px"}>
      <SelectInput
        placeholder={String(props.placeholder || "Pilih status...")}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        disabled={Boolean(props.disabled)}
        options={[
          { label: "Aktif", value: "active" },
          { label: "Menunggu", value: "pending" },
          { label: "Ditangguhkan", value: "suspended" },
        ]}
      />
    </Box>
  );
};

const FocusSelectPlaygroundDemo = (props: Record<string, unknown>) => {
  return (
    <Box w={"260px"}>
      <FocusSelectInput
        modalKey={"docs-focus-select-demo"}
        placeholder={String(props.placeholder || "Pilih kategori...")}
        size={(props.size as "sm" | "md" | "lg") || "md"}
        clearable={Boolean(props.clearable)}
        disabled={Boolean(props.disabled)}
        options={[
          {
            label: "Bidang Tanah",
            value: "bidang",
            description: "Lapisan persil bidang tanah",
          },
          {
            label: "Batas Wilayah",
            value: "wilayah",
            description: "Batas administrasi daerah",
          },
          {
            label: "Zona Nilai Tanah",
            value: "znt",
            description: "Pemetaan valuasi spasial",
          },
        ]}
      />
    </Box>
  );
};

const FocusAlertPlaygroundDemo = (props: Record<string, unknown>) => {
  const { modalKey, open } = usePopModal({ modalKey: "docs-focus-alert-demo" });
  return (
    <VStack gap={3}>
      <Button variant={"outline"} onClick={() => open()}>
        Buka Focus Alert
      </Button>

      <FocusAlertItem
        modalKey={modalKey}
        variant={(props.variant as "neutral") || "neutral"}
        title={"Perhatian Penting"}
        description={
          "Tindakan ini memerlukan perhatian khusus dan konfirmasi pengguna."
        }
      />
    </VStack>
  );
};

const ALL_DEMO_ITEMS: FormattedListItem<TableDemoItem>[] = [
  {
    id: "1",
    data: { name: "Ahmad Dahlan", role: "Surveyor", status: "Aktif" },
    columns: [
      { value: "Ahmad Dahlan", td: "Ahmad Dahlan" },
      { value: "Surveyor", td: "Surveyor" },
      { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
    ],
  },
  {
    id: "2",
    data: { name: "Budi Santoso", role: "Verifikator", status: "Pending" },
    columns: [
      { value: "Budi Santoso", td: "Budi Santoso" },
      { value: "Verifikator", td: "Verifikator" },
      {
        value: "Pending",
        td: <Badge colorPalette={"orange"}>Pending</Badge>,
      },
    ],
  },
  {
    id: "3",
    data: { name: "Citra Lestari", role: "Administrator", status: "Aktif" },
    columns: [
      { value: "Citra Lestari", td: "Citra Lestari" },
      { value: "Administrator", td: "Administrator" },
      { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
    ],
  },
  {
    id: "4",
    data: { name: "Dedi Supriadi", role: "Petugas Ukur", status: "Nonaktif" },
    columns: [
      { value: "Dedi Supriadi", td: "Dedi Supriadi" },
      { value: "Petugas Ukur", td: "Petugas Ukur" },
      { value: "Nonaktif", td: <Badge colorPalette={"gray"}>Nonaktif</Badge> },
    ],
  },
  {
    id: "5",
    data: { name: "Eka Wulandari", role: "Validator", status: "Aktif" },
    columns: [
      { value: "Eka Wulandari", td: "Eka Wulandari" },
      { value: "Validator", td: "Validator" },
      { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
    ],
  },
  {
    id: "6",
    data: { name: "Fajar Pratama", role: "Surveyor", status: "Pending" },
    columns: [
      { value: "Fajar Pratama", td: "Fajar Pratama" },
      { value: "Surveyor", td: "Surveyor" },
      {
        value: "Pending",
        td: <Badge colorPalette={"orange"}>Pending</Badge>,
      },
    ],
  },
  {
    id: "7",
    data: { name: "Gita Permata", role: "Administrator", status: "Aktif" },
    columns: [
      { value: "Gita Permata", td: "Gita Permata" },
      { value: "Administrator", td: "Administrator" },
      { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
    ],
  },
  {
    id: "8",
    data: { name: "Hadi Kusuma", role: "Petugas Ukur", status: "Aktif" },
    columns: [
      { value: "Hadi Kusuma", td: "Hadi Kusuma" },
      { value: "Petugas Ukur", td: "Petugas Ukur" },
      { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
    ],
  },
];

const DataTablePlaygroundDemo = ({
  props,
  onPropChange,
}: {
  props?: Record<string, unknown>;
  onPropChange?: (name: string, value: unknown) => void;
}) => {
  // Props
  const withNumbering =
    props?.withNumbering !== undefined ? Boolean(props.withNumbering) : true;
  const canBatchSelect =
    props?.canBatchSelect !== undefined ? Boolean(props.canBatchSelect) : true;
  const fixedItemHeight =
    props?.fixedItemHeight !== undefined
      ? Boolean(props.fixedItemHeight)
      : true;
  const rawPage = Number(props?.page) || 1;
  const page = Math.max(1, rawPage);
  const pageSize = Math.max(1, Number(props?.pageSize) || 4);

  // Handlers (sync page / pageSize back to playground knobs)
  const setPage = (nextPage: number) => {
    const validPage = Math.max(1, nextPage);
    onPropChange?.("page", validPage);
  };

  const setPageSize = (nextSize: number) => {
    onPropChange?.("pageSize", nextSize);
    onPropChange?.("page", 1);
  };

  // Pagination Slice
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = ALL_DEMO_ITEMS.slice(
    startIndex,
    startIndex + pageSize,
  );
  const totalPage = Math.ceil(ALL_DEMO_ITEMS.length / pageSize);

  // Derived Values — Single useMemo for DataList Table Pattern
  const dataList = useMemo(
    () => ({
      headers: [
        { th: "Nama", sortable: true },
        { th: "Peran", sortable: true },
        { th: "Status", sortable: false },
      ] as FormattedTableHeader[],
      items: paginatedItems,
      batchActions: [] as DataViewBatchActionsGenerator<TableDemoItem>[],
      itemActions: [
        {
          key: "view",
          label: "Lihat Detail",
          icon: EyeIcon,
          onClick: (item: TableDemoItem) => {
            toast.info(`Melihat data ${item.name}`);
          },
        },
        {
          key: "edit",
          label: "Edit Data",
          icon: EditIcon,
          onClick: (item: TableDemoItem) => {
            toast.info(`Mengedit data ${item.name}`);
          },
        },
        {
          key: "delete",
          label: "Hapus",
          icon: Trash2Icon,
          colorPalette: "red",
          modal: {
            triggerComponent: (item: TableDemoItem) => (
              <ConfirmationTrigger
                modalKey={`docs-table-delete-${item.name}`}
                title={"Hapus Data?"}
                description={`Apakah Anda yakin ingin menghapus data ${item.name}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel={"Hapus"}
                colorPalette={"red"}
                onConfirm={() => {
                  toast.success(`Data ${item.name} berhasil dihapus.`);
                }}
              />
            ),
          },
        },
      ] as DataViewItemActionsGenerator<TableDemoItem>[],
    }),
    [paginatedItems],
  );

  return (
    <VStack w={"full"} maxW={"650px"} gap={0} align={"stretch"}>
      <DataViewTable.Root
        headers={dataList.headers}
        items={dataList.items}
        itemActions={dataList.itemActions}
        batchActions={dataList.batchActions}
        withNumbering={withNumbering}
        canBatchSelect={canBatchSelect}
        fixedItemHeight={fixedItemHeight}
        page={page}
        pageSize={pageSize}
      >
        <DataViewTable.Header />
        <DataViewTable.Body />
      </DataViewTable.Root>

      <DataViewFooter
        currentDataLength={dataList.items.length}
        totalData={ALL_DEMO_ITEMS.length}
        totalPage={totalPage}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </VStack>
  );
};

const DrawerPlaygroundDemo = (props?: Record<string, unknown>) => {
  const placement = (props?.placement as "start" | "end" | "top" | "bottom") || "end";
  const size = (props?.size as "xs" | "sm" | "md" | "lg" | "xl" | "full") || "md";

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "docs-drawer",
  });
  return (
    <Drawer.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      placement={placement}
      size={size}
    >
      <Drawer.Trigger asChild>
        <Button variant={"outline"}>Buka Drawer Samping</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <P fontWeight={"bold"} fontSize={"lg"}>
            Drawer Exium
          </P>
        </Drawer.Header>
        <Drawer.Body>
          <P color={"fg.muted"}>
            Panel geser samping untuk form atau info tambahan.
          </P>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant={"ghost"} onClick={close}>
            Tutup
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
};

const DialogPlaygroundDemo = (props?: Record<string, unknown>) => {
  const size = (props?.size as "xs" | "sm" | "md" | "lg" | "xl" | "full") || "md";
  const placement = (props?.placement as "center" | "top") || "center";
  const scrollBehavior = (props?.scrollBehavior as "inside" | "outside") || "inside";

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "docs-dialog",
  });

  return (
    <Dialog.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={size}
      placement={placement}
      scrollBehavior={scrollBehavior}
    >
      <Dialog.Trigger asChild>
        <Button variant={"outline"}>Buka Dialog Preview</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <P fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
            Exium Dialog Title
          </P>
        </Dialog.Header>
        <Dialog.Body>
          <P textAlign={"center"} color={"fg.muted"}>
            Ini adalah contoh dialog modal terpusat dari Exium Design System.
          </P>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant={"ghost"} onClick={close}>
            Tutup
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
