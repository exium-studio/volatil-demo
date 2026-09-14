// src/features/design-system-docs/config/components-registry.tsx

import { BrandWatermark } from "@/design-system/components/branding/ui/brand-watermark";
import { Logo } from "@/design-system/components/branding/ui/logo";
import { Button } from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { Clipboard } from "@/design-system/components/data-display/ui/clipboard";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Breadcrumb } from "@/design-system/components/disclosure/ui/breadcrumb";
import { Carousel } from "@/design-system/components/disclosure/ui/carousel";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Steps } from "@/design-system/components/disclosure/ui/steps";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { FaceEmoji } from "@/design-system/components/feedback/ui/face-emoji";
import {
  EmojiSmile,
  EmojiHappy,
  EmojiAngry,
  EmojiCry,
  EmojiSurprised,
  EmojiThinking,
} from "@/design-system/components/emoji";
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
import { COLOR_PALETTES_LIST } from "@/design-system/constants/colors";
import type { ComponentDocSpec } from "@/features/design-system-docs/types/ds-docs-spec.type";
import {
  BellIcon,
  ChevronDownIcon,
  CopyIcon,
  InfoIcon,
  SparklesIcon,
} from "lucide-react";

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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => <BrandWatermark />,
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
        options: COLOR_PALETTES_LIST.map((c) => c.palette),
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
        options: COLOR_PALETTES_LIST.map((c) => c.palette),
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
        options: COLOR_PALETTES_LIST.map((c) => c.palette),
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
        options: COLOR_PALETTES_LIST.map((c) => c.palette),
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
    },
    propsSpec: [],
    renderPlayground: () => (
      <RadioInput
        defaultValue={"opt1"}
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
    },
    propsSpec: [],
    renderPlayground: () => (
      <RadioCardInput.Root defaultValue={"standard"} maxW={"420px"} w={"full"}>
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
    },
    propsSpec: [],
    renderPlayground: () => (
      <SegmentGroupInput
        defaultValue={"grid"}
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
        options: COLOR_PALETTES_LIST.map((c) => c.palette),
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => <NoDataState />,
  },

  face_emoji: {
    key: "face_emoji",
    title: "Face Emoji",
    category: "Feedback & Status",
    description:
      "Animasi ekspresi wajah interaktif untuk status visual dan feedback emosional antarmuka.",
    importPath:
      'import { FaceEmoji } from "@/design-system/components/feedback/ui/face-emoji";',
    component: FaceEmoji,
    defaultProps: {
      variant: "smile",
      size: "lg",
    },
    propsSpec: [
      {
        name: "variant",
        type: '"smile" | "happy" | "angry" | "cry" | "embarrassed" | "surprised" | "wronged" | "shout" | "flushed" | "yummy" | "complacent" | "drool" | "scream" | "weep" | "speechless" | "funnyface" | "laughwithtears" | "wicked" | "facewithrollingeyes" | "sulk" | "thinking" | "lovely" | "greedy"',
        defaultValue: "smile",
        description: "Ekspresi wajah emoji.",
        controlKind: "select",
        options: [
          "smile",
          "happy",
          "angry",
          "cry",
          "embarrassed",
          "surprised",
          "wronged",
          "shout",
          "flushed",
          "yummy",
          "complacent",
          "drool",
          "scream",
          "weep",
          "speechless",
          "funnyface",
          "laughwithtears",
          "wicked",
          "facewithrollingeyes",
          "sulk",
          "thinking",
          "lovely",
          "greedy",
        ],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        defaultValue: "lg",
        description: "Ukuran emoji.",
        controlKind: "select",
        options: ["sm", "md", "lg", "xl"],
      },
    ],
    renderPlayground: (props) => (
      <FaceEmoji
        variant={(props.variant as "smile") || "smile"}
        size={(props.size as "lg") || "lg"}
      />
    ),
  },

  emoji: {
    key: "emoji",
    title: "Emoji Component (Sliced SVG)",
    category: "Emoji",
    description:
      "Komponen Emoji berpotongan (sliced SVG) dengan penyesuaian dinamis colorPalette (solid, emphasized, muted, subtle).",
    importPath:
      'import { EmojiSmile, EmojiHappy, EmojiAngry, EmojiCry, EmojiSurprised, EmojiThinking } from "@/design-system/components/emoji";',
    component: EmojiSmile,
    defaultProps: {
      emoji: "EmojiSmile",
      colorPalette: "neutral",
      size: "md",
    },
    propsSpec: [
      {
        name: "emoji",
        type: '"EmojiSmile" | "EmojiHappy" | "EmojiAngry" | "EmojiCry" | "EmojiSurprised" | "EmojiThinking"',
        defaultValue: "EmojiSmile",
        description: "Varian sliced emoji SVG.",
        controlKind: "select",
        options: [
          "EmojiSmile",
          "EmojiHappy",
          "EmojiAngry",
          "EmojiCry",
          "EmojiSurprised",
          "EmojiThinking",
        ],
      },
      {
        name: "colorPalette",
        type: "string",
        defaultValue: "neutral",
        description:
          "Color palette theme (neutral, blue, red, teal, green, amber, purple, etc.).",
        controlKind: "select",
        options: ["neutral", "blue", "red", "teal", "green", "amber", "purple"],
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        defaultValue: "md",
        description: "Ukuran dimensi emoji.",
        controlKind: "select",
        options: ["sm", "md", "lg", "xl"],
      },
    ],
    renderPlayground: (props) => {
      const cp = (props.colorPalette as string) || "neutral";
      const sz = (props.size as "md") || "md";
      const sel = (props.emoji as string) || "EmojiSmile";

      if (sel === "EmojiHappy")
        return <EmojiHappy colorPalette={cp} size={sz} />;
      if (sel === "EmojiAngry")
        return <EmojiAngry colorPalette={cp} size={sz} />;
      if (sel === "EmojiCry") return <EmojiCry colorPalette={cp} size={sz} />;
      if (sel === "EmojiSurprised")
        return <EmojiSurprised colorPalette={cp} size={sz} />;
      if (sel === "EmojiThinking")
        return <EmojiThinking colorPalette={cp} size={sz} />;
      return <EmojiSmile colorPalette={cp} size={sz} />;
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
      'import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";',
    component: DataViewTable.Root,
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => <DataTablePlaygroundDemo />,
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
    },
    propsSpec: [
      {
        name: "value",
        type: "string",
        defaultValue: "https://volatil.atrbpn.go.id",
        description: "Nilai string yang akan disalin.",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <Clipboard.Root
        value={String(props.value || "https://volatil.atrbpn.go.id")}
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => {
      const tomorrow = new Date(Date.now() + 86400000).toISOString();
      return <Countdown finishedAt={tomorrow} />;
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Accordion.Root
        collapsible
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Tabs.Root defaultValue={"overview"} w={"full"} maxW={"380px"}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Steps.Root defaultStep={1} count={3} maxW={"380px"} w={"full"}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Collapsible.Root defaultOpen w={"full"} maxW={"320px"}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href={"#"}>Beranda</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Link href={"#"}>Manajemen Data</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
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
      "Slider tayangan bergambar atau konten kartu bergerak dengan kendali navigasi.",
    importPath:
      'import { Carousel } from "@/design-system/components/disclosure/ui/carousel";',
    component: Carousel.Root,
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Carousel.Root slideCount={3} w={"320px"} maxW={"320px"}>
        <Carousel.Control>
          <Carousel.ItemGroup width={"full"}>
            {[1, 2, 3].map((num) => (
              <Carousel.Item key={num} index={num - 1}>
                <Box
                  h={"140px"}
                  bg={"blue.subtle"}
                  rounded={"lg"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <P fontWeight={"bold"} color={"blue.fg"}>
                    Slide Banner {num}
                  </P>
                </Box>
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>
        </Carousel.Control>
      </Carousel.Root>
    ),
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
      modalKey: "docs-dialog",
    },
    propsSpec: [
      {
        name: "modalKey",
        type: "string",
        defaultValue: "docs-dialog",
        description: "Kunci identifikasi modal.",
        controlKind: "text",
      },
    ],
    renderPlayground: () => <DialogPlaygroundDemo />,
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => <DrawerPlaygroundDemo />,
  },

  popover: {
    key: "popover",
    title: "Popover",
    category: "Overlays & Modals",
    description: "Panel mengambang interaktif terikat pada elemen pemicu.",
    importPath:
      'import { Popover } from "@/design-system/components/overlay/ui/popover";',
    component: Popover.Root,
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Popover.Root>
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
    },
    propsSpec: [
      {
        name: "content",
        type: "string",
        defaultValue: "Tooltip info bantuan",
        description: "Teks isi tooltip.",
        controlKind: "text",
      },
    ],
    renderPlayground: (props) => (
      <Tooltip content={String(props.content || "Tooltip info bantuan")}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Menu.Root>
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
      bg: "bg.muted",
      rounded: "md",
    },
    propsSpec: [
      {
        name: "children",
        type: "ReactNode",
        defaultValue: undefined,
        description: "Konten di dalam Box.",
        controlKind: "text",
      },
    ],
    renderPlayground: () => (
      <Box
        p={6}
        rounded={"lg"}
        bg={"bg.subtle"}
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
    title: "Flex / HStack / VStack",
    category: "Layout & Structure",
    description:
      "Kontainer susunan fleksibel vertikal (VStack) atau horizontal (HStack) dengan alignment presisi.",
    importPath:
      'import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";',
    component: HStack,
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <VStack gap={3} align={"start"}>
        <HStack gap={3}>
          <Box p={3} bg={"blue.subtle"} rounded={"md"}>
            <P fontSize={"xs"}>HStack 1</P>
          </Box>
          <Box p={3} bg={"blue.subtle"} rounded={"md"}>
            <P fontSize={"xs"}>HStack 2</P>
          </Box>
          <Box p={3} bg={"blue.subtle"} rounded={"md"}>
            <P fontSize={"xs"}>HStack 3</P>
          </Box>
        </HStack>
      </VStack>
    ),
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
        type: "number",
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Card.Root maxW={"320px"} w={"full"}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Container.Root w={"full"} maxW={"380px"}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <VStack gap={3} w={"full"} maxW={"300px"}>
        <P fontSize={"sm"}>Bagian Atas</P>
        <Separator w={"full"} />
        <P fontSize={"sm"}>Bagian Bawah</P>
      </VStack>
    ),
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <Box
        h={"220px"}
        w={"240px"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Sidebar.Root sidebarKey={"demo-sidebar"} defaultExpanded>
          <Sidebar.Header p={3}>
            <P fontWeight={"bold"} fontSize={"sm"}>
              Exium App
            </P>
          </Sidebar.Header>
          <Sidebar.Body p={3}>
            <P fontSize={"xs"} color={"fg.muted"}>
              Navigasi sidebar modul aplikasi.
            </P>
          </Sidebar.Body>
        </Sidebar.Root>
      </Box>
    ),
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
        name: "children",
        type: "ReactNode",
        defaultValue: "Kunjungi Situs ATR BPN",
        description: "Teks tautan.",
        controlKind: "text",
      },
    ],
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
        type: '"sm" | "md" | "lg" | "xl"',
        defaultValue: "lg",
        description: "Ukuran avatar.",
        controlKind: "select",
        options: ["sm", "md", "lg", "xl"],
      },
    ],
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
    },
    propsSpec: [],
    renderPlayground: () => (
      <Image
        src={
          "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80"
        }
        alt={"Contoh Gambar"}
        w={"260px"}
        h={"140px"}
        objectFit={"cover"}
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
    },
    propsSpec: [
      {
        name: "size",
        type: '"xs" | "sm" | "md" | "lg" | "xl" | "2xl"',
        defaultValue: "lg",
        description: "Ukuran ikon.",
        controlKind: "select",
        options: ["xs", "sm", "md", "lg", "xl", "2xl"],
      },
    ],
    renderPlayground: (props) => (
      <HStack gap={4}>
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
    defaultProps: {},
    propsSpec: [],
    renderPlayground: () => (
      <DownloadTrigger
        data={async () =>
          new Blob(["Contoh file download teks Exium DS"], {
            type: "text/plain",
          })
        }
        fileName={"exium-doc.txt"}
        mimeType={"text/plain"}
      >
        <Button variant={"outline"}>Download File Contoh</Button>
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

const DataTablePlaygroundDemo = () => {
  const headers = [
    { th: "Nama", sortable: true },
    { th: "Peran", sortable: true },
    { th: "Status", sortable: false },
  ];
  const items = [
    {
      id: "1",
      data: { name: "Ahmad", role: "Surveyor", status: "Aktif" },
      columns: [
        { value: "Ahmad", td: "Ahmad" },
        { value: "Surveyor", td: "Surveyor" },
        { value: "Aktif", td: <Badge colorPalette={"green"}>Aktif</Badge> },
      ],
    },
    {
      id: "2",
      data: { name: "Budi", role: "Verifikator", status: "Pending" },
      columns: [
        { value: "Budi", td: "Budi" },
        { value: "Verifikator", td: "Verifikator" },
        {
          value: "Pending",
          td: <Badge colorPalette={"orange"}>Pending</Badge>,
        },
      ],
    },
  ];

  return (
    <Box w={"full"} maxW={"500px"}>
      <DataViewTable.Root headers={headers} items={items}>
        <DataViewTable.Header />
        <DataViewTable.Body />
      </DataViewTable.Root>
    </Box>
  );
};

const DrawerPlaygroundDemo = () => {
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "docs-drawer",
  });
  return (
    <Drawer.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
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

const DialogPlaygroundDemo = () => {
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "docs-dialog",
  });

  return (
    <Dialog.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
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
