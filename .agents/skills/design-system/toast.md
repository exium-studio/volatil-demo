---
name: exium-toast
description: "Guidelines and API reference for Exium Toast notification system: toast.success, toast.error, toast.info, toast.warning, Toaster, and NotificationCenter."
---

# Exium Toast System

Located in `@/design-system/components/toast/`.

---

## 1. Programmatic Toast API

Trigger notifications anywhere in mutations, queries, or event handlers:

```tsx
import { toast } from "@/design-system/components/toast";

// Success Toast
toast.success({
  title: "Perubahan Disimpan",
  description: "Konfigurasi GeoServer berhasil diperbarui.",
});

// Error Toast
toast.error({
  title: "Gagal Menyimpan Data",
  description: error.message,
});

// Warning Toast
toast.warning({
  title: "Batas Kuota",
  description: "Sisa kuota unduh Anda tersisa 1 kali lagi.",
});

// Info Toast
toast.info({
  title: "Sinkronisasi Berjalan",
  description: "Data layer sedang dimuat di latar belakang.",
});

// Custom Duration & Dismiss
const id = toast.create({
  title: "Memproses Permohonan...",
  duration: 5000,
});
toast.dismiss(id);
```

---

## 2. Toaster Mounting (`toaster.tsx`)

Mounted once at root layout (`src/routes/__root.tsx`) inside the Chakra theme provider:
```tsx
import { Toaster } from "@/design-system/components/toast/ui/toaster";

<Toaster />
```

---

## 3. NotificationCenter (`notification-center.tsx`) & ToastHistory

- `NotificationCenter`: Slide-over drawer displaying persistent toast history logs.
- `useToastHistory()`: Hook to inspect past toasts, read/unread states, and clear history.
