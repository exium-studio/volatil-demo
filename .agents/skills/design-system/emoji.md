---
name: exium-emoji
description: "Guidelines and API reference for Exium Emoji expressive illustration components."
---

# Exium Emoji Components

Located in `@/design-system/components/emoji/ui/`.

---

## 1. Overview

Exium Emoji provides a set of 19 custom SVG expressive face illustrations designed for rich feedback, celebratory milestones, emotional empty states, and `FocusAlert` banners.

---

## 2. Emoji Component (`emoji.tsx`)

### Import:
```tsx
import { Emoji } from "@/design-system/components/emoji/ui/emoji";
import type { EmojiVariant } from "@/design-system/components/emoji/types/emoji.type";
```

### Key Props:
- `variant?: EmojiVariant`: The emoji face variant (default: `"poker"`).
- `colorPalette?: string`: Color palette token for the emoji theme (e.g. `"green"`, `"blue"`, `"red"`, `"orange"`, `"purple"`, `"teal"`, `"pink"`, `"neutral"`).
- `boxSize?: number`: Dimension in pixels (width and height, default: `24`).
- All `CenterProps` (e.g. `p`, `m`, `opacity`, etc.).

---

## 3. List of Available `EmojiVariant` (19 Variants):

| Variant | Emote / Mood | Recommended Color Palette | Ideal Context |
| :--- | :--- | :--- | :--- |
| `"happy"` | Senang / Sukses | `"green"` | Aksi berhasil, konfirmasi selesai |
| `"thumbUp"` | Jempol / Setuju | `"pink"` / `"green"` | Milestone tercapai, verifikasi data |
| `"celebrate"` / `"happy"` | Selebrasi | `"green"` | Transaksi selesai, aktivasi akun |
| `"cool"` | Santai / Keren | `"blue"` | Fitur premium, integrasi selesai |
| `"love"` | Hati / Cinta | `"pink"` | Feedback pengguna, bookmark |
| `"laugh"` | Tertawa | `"orange"` | Interaksi playful |
| `"funny"` | Lucu | `"orange"` | Tips santai |
| `"thinking"` | Berpikir | `"yellow"` | Panduan, proses kalkulasi |
| `"poker"` | Datar / Netral | `"neutral"` | Info umum tanpa sentimen |
| `"speechless"` | Terdiam | `"teal"` | Data tidak terduga |
| `"embarassed"` | Malu / Canggung | `"teal"` | Warning minor |
| `"rollingEyes"` | Memutar mata | `"orange"` | Batas percobaan tercapai |
| `"surprised"` | Kaget / Terkejut | `"orange"` | Notifikasi mendadak |
| `"shout"` | Berteriak | `"purple"` | Pengumuman penting |
| `"wicked"` | Jahil / Energetik | `"purple"` | Aksi tingkat lanjut |
| `"scream"` | Panik / Darurat | `"blue"` / `"red"` | Gangguan koneksi |
| `"cry"` | Menangis | `"blue"` | Transaksi gagal |
| `"sad"` | Sedih | `"red"` | Data dihapus, error |
| `"sulk"` | Merajuk / Kecewa | `"red"` | Permohonan ditolak |
| `"angry"` | Marah / Fatal | `"red"` | Akses ditolak, error kritis |

---

## 4. Usage Examples:

### Basic Usage:
```tsx
import { Emoji } from "@/design-system/components/emoji/ui/emoji";

// Render happy emoji with green palette
<Emoji variant={"happy"} colorPalette={"green"} boxSize={32} />

// Render thinking emoji with yellow palette
<Emoji variant={"thinking"} colorPalette={"yellow"} boxSize={28} />
```

### Integration with `FocusAlertItem`:
```tsx
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";

<FocusAlertItem
  modalKey={"celebration-alert"}
  emoji={"thumbUp"}
  colorPalette={"green"}
  title={"Pengajuan Berhasil Dikirim!"}
  description={"Dokumen permohonan data IGT Anda telah diterima oleh admin."}
/>
```
