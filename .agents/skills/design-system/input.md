---
name: design-system-input
description: "Guidelines, component APIs, RHF integrations, and usage rules for Input, NumberInput, Switch, Checkbox, Textarea, PasswordInput, RadioInput, RadioCardInput, and FocusSelect."
---

# Design System Input Components

This guide details all input components in `@/design-system/components/input/ui/`.
Always import from `@/design-system/components/input/ui/<component-name>`.

---

## 1. NumberInput (`number-input.tsx`)

### 🔴 Critical Rule: Never use `<Input type="number" />`!
Always use `NumberInput` or `SteppedNumberInput` from `@/design-system/components/input/ui/number-input`.

### Components
- `NumberInput`: Standard numeric input with increment/decrement triggers and support for min/max/step.
- `SteppedNumberInput`: Compact horizontal stepper with segmented `-` and `+` buttons.

### Key Props & API
- `value`: `string`
- `min?: number`, `max?: number`, `step?: number`
- `onValueChange?: (details: { value: number; formattedValue: string }) => void`
- `size?: "xs" | "sm" | "md" | "lg"`
- `inputProps`: Props passed down to the underlying input element (used by React Hook Form `register`).

### Usage Example:
```tsx
import { NumberInput } from "@/design-system/components/input/ui/number-input";

<NumberInput
  size={"sm"}
  min={0}
  max={100}
  step={5}
  value={String(field.value ?? 0)}
  onValueChange={(details) => field.onChange(details.value)}
/>
```

---

## 2. Input (`input.tsx`)

Text input with built-in clear button (`clearable`), prefix/suffix icons, addon text, and debounce support.

### Key Props
- `clearable?: boolean`
- `leftIcon?: LucideIcon`, `rightIcon?: LucideIcon`
- `startAddon?: ReactNode`, `endAddon?: ReactNode`
- `onClear?: () => void`

### Usage Example:
```tsx
import { Input } from "@/design-system/components/input/ui/input";

<Input
  placeholder={"Search user..."}
  clearable
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onClear={() => setQuery("")}
/>
```

---

## 3. Switch (`switch.tsx`)

Toggle switch component for boolean flags.

### Key Props
- `checked?: boolean`
- `onCheckedChange?: (details: { checked: boolean }) => void`
- `colorPalette?: string`
- `size?: "sm" | "md" | "lg"`

### Usage Example:
```tsx
import { Switch } from "@/design-system/components/input/ui/switch";

<Switch
  checked={field.value}
  onCheckedChange={(e) => field.onChange(e.checked)}
  colorPalette={"blue"}
>
  Active Status
</Switch>
```

---

## 4. Checkbox (`checkbox.tsx`)

Checkbox input supporting indeterminate state and rich color palettes.

### Key Props
- `checked?: boolean | "indeterminate"`
- `onCheckedChange?: (details: { checked: boolean | "indeterminate" }) => void`
- `colorPalette?: string`

### Usage Example:
```tsx
import { Checkbox } from "@/design-system/components/input/ui/checkbox";

<Checkbox
  checked={isSelected}
  onCheckedChange={(e) => setSelected(Boolean(e.checked))}
>
  Agree to terms
</Checkbox>
```

---

## 5. PasswordInput (`password-input.tsx`)

Password input with visibility toggle.

### Key Props
- `placeholder?: string`
- Standard `InputProps` (`size`, `disabled`, `errorText`, etc.)

---

## 6. Textarea (`textarea.tsx`)

Multiline text input with auto-resize capability.

### Key Props
- `autoresize?: boolean`
- Standard textarea attributes.

---

## 7. RadioCardInput (`radio-card-input.tsx`) & RadioInput (`radio-input.tsx`)

- `RadioInput`: Standard Chakra radio list.
- `RadioCardInput`: Card-like interactive selectables (`RadioCardInput.Root`, `RadioCardInput.Item`, `RadioCardInput.ItemControl`, `RadioCardInput.ItemIndicator`, `RadioCardInput.ItemText`).

### Usage Example:
```tsx
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";

<RadioCardInput.Root
  value={val}
  onValueChange={(e) => setVal(e.value)}
  colorPalette={"blue"}
>
  <SimpleGrid columns={2} gap={2}>
    {options.map((opt) => (
      <RadioCardInput.Item key={opt.value} value={opt.value}>
        <RadioCardInput.ItemControl>
          <RadioCardInput.ItemIndicator />
          <RadioCardInput.ItemText>{opt.label}</RadioCardInput.ItemText>
        </RadioCardInput.ItemControl>
      </RadioCardInput.Item>
    ))}
  </SimpleGrid>
</RadioCardInput.Root>
```

---

## 8. FocusSelectInput (`focus-select.tsx`)

Searchable select that opens in an overlay/drawer with instant filtering.
Always provide a unique `modalKey` (see `modal.md` for rules on nesting).
