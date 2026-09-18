---
name: design-system-input
description: "Guidelines, component APIs, RHF integrations, and usage rules for Input, NumberInput, Switch, Checkbox, Textarea, PasswordInput, FocusSelect, Select, FileInput, DateInput, Slider, PinInput, Field, and SegmentGroup."
---

# Design System Input Components

Located in `@/design-system/components/input/ui/`.

---

## 1. NumberInput (`number-input.tsx`)

### 🔴 Critical Rule: DILARANG menggunakan `<Input type="number" />`!
Selalu gunakan `NumberInput` dari `@/design-system/components/input/ui/number-input`.

### Components:
- `NumberInput`: Standar input angka dengan tombol increment/decrement dan format pemisah ribuan.
- `SteppedNumberInput`: Input angka horizontal kompak dengan kontrol `-` dan `+`.

### Key Props:
- `value: string | number`
- `min?: number`, `max?: number`, `step?: number`
- `onValueChange?: (details: { value: number; formattedValue: string }) => void`
- `size?: "xs" | "sm" | "md" | "lg"`
- `allowNegative?: boolean`

### Example:
```tsx
import { NumberInput } from "@/design-system/components/input/ui/number-input";

<NumberInput
  size={"sm"}
  min={0}
  max={100}
  step={1}
  value={field.value}
  onValueChange={(e) => field.onChange(e.value)}
/>
```

---

## 2. Text Input & Search (`input.tsx`, `search-input.tsx`, `focus-search.tsx`)

- `Input`: Standar text field dengan `clearable`, icon prefix/suffix, dan addon.
- `SearchInput`: Search bar dengan debounced typing dan instant clear button.
- `FocusSearch`: Search overlay trigger yang membuka dialog pencarian global.

```tsx
import { Input } from "@/design-system/components/input/ui/input";
import { SearchIcon } from "lucide-react";

<Input
  placeholder={"Cari data..."}
  clearable
  leftIcon={SearchIcon}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onClear={() => setSearchQuery("")}
/>
```

---

## 3. PasswordInput (`password-input.tsx`)

Input password dengan tombol show/hide otomatis.

```tsx
import { PasswordInput } from "@/design-system/components/input/ui/password-input";

<PasswordInput
  placeholder={"Masukkan kata sandi..."}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

---

## 4. FocusSelect & Select (`focus-select.tsx`, `select.tsx`)

- `FocusSelect`: Dropdown seleksi dengan pencarian interaktif yang dimuat via overlay URL `modalKey`.
  - 🔴 **Wajib**: Turunkan `modalKey` jika berada di dalam modal (`modalKey={`${parentModalKey}.select-name`}`).
- `Select`: Standar select dropdown popover Chakra UI.

```tsx
import { FocusSelect } from "@/design-system/components/input/ui/focus-select";

<FocusSelect
  modalKey={`${parentModalKey}.district-select`}
  label={"Pilih Kecamatan"}
  items={districtOptions}
  value={selectedDistrict}
  onValueChange={(val) => setSelectedDistrict(val)}
/>
```

---

## 5. FileInput (`file-input.tsx`)

Drag-and-drop file upload dengan validasi tipe file (misal `.shp`, `.geojson`, `.pdf`, `.zip`), progress upload, dan preview list.

```tsx
import { FileInput } from "@/design-system/components/input/ui/file-input";

<FileInput
  accept={".zip,.shp,.geojson"}
  maxFileSizeMb={50}
  value={files}
  onFilesChange={(newFiles) => setFiles(newFiles)}
/>
```

---

## 6. DateInput & DatePicker (`date-input.tsx`, `date-picker.tsx`, `chakra-date-picker.tsx`)

Input tanggal dengan parsing kalender lokal dan format tanggal Indonesia/Inggris.

```tsx
import { DateInput } from "@/design-system/components/input/ui/date-input";

<DateInput
  value={selectedDate}
  onValueChange={(d) => setSelectedDate(d)}
  placeholder={"Pilih tanggal batas..."}
/>
```

---

## 7. Switch & Checkbox (`switch.tsx`, `checkbox.tsx`)

- `Switch`: Toggle boolean dengan label.
- `Checkbox`: Checkbox pilihan ganda / single check.

```tsx
import { Switch } from "@/design-system/components/input/ui/switch";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";

<Switch
  checked={isActive}
  onCheckedChange={(e) => setIsActive(e.checked)}
  colorPalette={"blue"}
>
  {"Status Aktif"}
</Switch>

<Checkbox
  checked={isAgreed}
  onCheckedChange={(e) => setIsAgreed(Boolean(e.checked))}
>
  {"Saya menyetujui syarat & ketentuan"}
</Checkbox>
```

---

## 8. RadioInput & RadioCardInput (`radio-input.tsx`, `radio-card-input.tsx`)

- `RadioInput`: Standar opsi radio.
- `RadioCardInput`: Kartu seleksi interaktif dengan indikator visual.

```tsx
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";

<RadioCardInput.Root value={basis} onValueChange={(e) => setBasis(e.value)} colorPalette={"blue"}>
  <SimpleGrid columns={2} gap={2}>
    <RadioCardInput.Item value={"bidang"}>
      <RadioCardInput.ItemControl>
        <RadioCardInput.ItemIndicator />
        <RadioCardInput.ItemText>{"Berbasis Bidang"}</RadioCardInput.ItemText>
      </RadioCardInput.ItemControl>
    </RadioCardInput.Item>
    <RadioCardInput.Item value={"kawasan"}>
      <RadioCardInput.ItemControl>
        <RadioCardInput.ItemIndicator />
        <RadioCardInput.ItemText>{"Berbasis Kawasan"}</RadioCardInput.ItemText>
      </RadioCardInput.ItemControl>
    </RadioCardInput.Item>
  </SimpleGrid>
</RadioCardInput.Root>
```

---

## 9. Textarea (`textarea.tsx`)

Multiline text input dengan auto-resize.

```tsx
import { Textarea } from "@/design-system/components/input/ui/textarea";

<Textarea
  placeholder={"Keterangan tambahan..."}
  autoresize
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

---

## 10. Field & Fieldset (`field.tsx`, `fieldset.tsx`)

Container form label, helper text, dan error message terintegrasi dengan RHF.

```tsx
import { Field } from "@/design-system/components/input/ui/field";

<Field
  label={"Nama Lengkap"}
  required
  errorText={errors.fullName?.message}
  helperText={"Sesuai kartu identitas"}
>
  <Input {...register("fullName")} />
</Field>
```

---

## 11. Slider & PinInput (`slider.tsx`, `pin-input.tsx`)

- `Slider`: Range slider dengan tooltip nilai aktif.
- `PinInput`: Input digit OTP / PIN verifikasi.

---

## 12. SegmentGroup (`segment-group.tsx`, `segment-group-input.tsx`)

Pilihan opsi segmented button horizontal (misal tab switch view list/grid).
