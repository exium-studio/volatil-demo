# Panduan Integrasi Frontend: Standarisasi Inbox Code (SSOT)

> **Dokumen Resmi Kontrak & Integrasi Frontend Volatil**  
> **Status:** Final Specification & Standard  
> **Target Pengguna:** Frontend Developer (Volatil Web App)  
> **Tech Stack FE:** TanStack Router, Chakra UI v3, Lucide Icons, Paraglide JS  

---

## 1. Latar Belakang & Filosofi Arsitektur

### Masalah Desain Lama (URL & Label dari BE)
Sebelumnya backend mengirim field `actionUrl` (contoh: `"/mitra/my-data/abc-123"`) dan `actionLabel` (contoh: `"Buka Data Saya"`).
Hal ini menimbulkan masalah arsitektur yang serius:
1. **Tight Coupling Routing:** Backend tidak boleh mengetahui struktur URL routing frontend. Jika route TanStack Router diubah (misal dari `/mitra/my-data/$workspaceId` menjadi `/workspace/$workspaceId`), semua data notifikasi di database menghasilkan *broken link (404)*.
2. **Parsing Hack di FE:** Frontend terpaksa melakukan parsing string URL secara rapuh (contoh: `rawUrl.replace("/mitra/my-data/", "")`) hanya untuk mendapatkan ID entitas.
3. **Terkunci dari i18n & Redaksi:** Judul (`title`) dan pesan (`message`) di-hardcode dalam bahasa Indonesia oleh backend, sehingga frontend tidak dapat menggunakan sistem translasi (Paraglide JS) atau menyesuaikan redaksi antarmuka.

### Solusi Baru: Single Source of Truth (SSOT)
- **Backend (SSOT):** Hanya menentukan **apa yang terjadi** melalui properti **`code`** (Enum string baku) dan menyertakan entitas dinamis di dalam **`metadata`** (contoh: `orderId`, `billingCode`, `workspaceId`, `ticketId`).
- **Frontend (Resolver):** Bertanggung jawab penuh menerjemahkan `code` + `metadata` menjadi:
  - URL tujuan (`actionUrl`) yang valid sesuai TanStack Router tree.
  - Label tombol aksi (`actionLabel`).
  - Judul teks (`title`) dan deskripsi (`message`).
  - Ikon (Lucide Icons).
  - Skema warna (Chakra UI v3 `colorPalette`).

---

## 2. Struktur Payload API `GET /api/inbox`

Setiap item notifikasi yang diterima frontend memiliki struktur:

```typescript
export type InboxCategory =
  | "transaksi"
  | "kedaluwarsa"
  | "bantuan"
  | "akun"
  | "sistem";

export type InboxItem = {
  id: string;
  code: InboxCode;                    // SSOT pemicu event dari BE
  category: InboxCategory;            // Kategori notifikasi untuk filtering/tab
  isRead: boolean;
  metadata: InboxItemMetadata;        // Payload entity dinamis
  createdAt: string;                  // ISO 8601 Timestamp
  readAt?: string | null;

  // Backward-compatibility fallback:
  // Backend sementara tetap mengirim field di bawah sebagai fallback transisi.
  title?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
};
```

---

## 3. Katalog Baku `InboxCode`, Metadata & Rute TanStack Router

Berikut adalah daftar event resmi backend beserta pemetaan rute TanStack Router di frontend (`volatil-frontend`):

### 3.1 Kategori `transaksi`

| `code` | Pemicu (Trigger) | Isi `metadata` dari BE | Target Rute TanStack Router | Rekomendasi `actionLabel` |
|---|---|---|---|---|
| `ORDER_CREATED` | Pesanan dibuat, billing PNBP aktif | `{ orderId, orderNumber, billingCode, totalAmount }` | `/mitra/billing/${meta.billingCode}` (atau `/mitra/transaction-history`) | `"Bayar Billing"` |
| `ORDER_PAID` | Pembayaran PNBP terverifikasi | `{ orderId, orderNumber, transactionNumber }` | `/mitra/transaction-history` | `"Lihat Riwayat"` |
| `ORDER_PROVISIONING` | Layer sedang dibentuk GeoServer | `{ orderId, orderNumber, workspaceId, workspaceName }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Pantau Status"` |
| `ORDER_PENDING_REVIEW` | Potongan layer menunggu ACC admin | `{ orderId, orderNumber, workspaceId, workspaceName }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Cek Verifikasi"` |
| `ORDER_PENDING_TTE` | Invoice menunggu TTE Pejabat | `{ orderId, orderNumber, workspaceId, workspaceName }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Lihat Status TTE"` |
| `ORDER_READY` | WMS/WFS aktif & siap pakai di peta | `{ orderId, orderNumber, workspaceId, workspaceName }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Buka di Peta"` |
| `ORDER_REJECTED` | Pesanan ditolak verifikator | `{ orderId, orderNumber, reason }` | `/mitra/transaction-history` | `"Lihat Alasan"` |
| `ORDER_CANCELLED` | Pesanan kedaluwarsa/dibatalkan | `{ orderId, orderNumber }` | `/mitra/cart` | `"Pesan Ulang"` |

---

### 3.2 Kategori `kedaluwarsa`

| `code` | Pemicu (Trigger) | Isi `metadata` dari BE | Target Rute TanStack Router | Rekomendasi `actionLabel` |
|---|---|---|---|---|
| `WORKSPACE_EXPIRING_H7` | Sisa aktif 7 hari (H-7) | `{ workspaceId, workspaceName, daysRemaining: 7, expiresAt }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Perpanjang Layanan"` |
| `WORKSPACE_EXPIRING_H3` | Sisa aktif 3 hari (H-3) | `{ workspaceId, workspaceName, daysRemaining: 3, expiresAt }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Perpanjang Segera"` |
| `WORKSPACE_EXPIRING_H1` | Sisa aktif 1 hari (H-1) | `{ workspaceId, workspaceName, daysRemaining: 1, expiresAt }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Perpanjang Hari Ini"` |
| `WORKSPACE_EXPIRED` | Akses WMS/WFS dicabut | `{ workspaceId, workspaceName, expiredAt }` | `/mitra/my-data/${meta.workspaceId \|\| meta.workspaceName}` | `"Aktifkan Kembali"` |

---

### 3.3 Kategori `bantuan`

| `code` | Pemicu (Trigger) | Isi `metadata` dari BE | Target Rute TanStack Router | Rekomendasi `actionLabel` |
|---|---|---|---|---|
| `TICKET_CREATED` | Tiket bantuan dibuat | `{ ticketId, ticketNumber, subject }` | `/mitra/help-center/${meta.ticketId}` | `"Lihat Tiket"` |
| `TICKET_REPLIED` | CS membalas tiket | `{ ticketId, ticketNumber, senderName }` | `/mitra/help-center/${meta.ticketId}` | `"Baca Balasan"` |
| `TICKET_RESOLVED` | Tiket diselesaikan petugas | `{ ticketId, ticketNumber }` | `/mitra/help-center/${meta.ticketId}` | `"Beri Rating"` |
| `TICKET_CLOSED` | Tiket ditutup permanen | `{ ticketId, ticketNumber }` | `/mitra/help-center/${meta.ticketId}` | `"Detail Tiket"` |

---

### 3.4 Kategori `akun`

| `code` | Pemicu (Trigger) | Isi `metadata` dari BE | Target Rute TanStack Router | Rekomendasi `actionLabel` |
|---|---|---|---|---|
| `MITRA_REGISTRATION_SUBMITTED` | Berkas registrasi dikirim | `{ registrationId, companyName }` | `/registration-status` | `"Cek Status"` |
| `MITRA_REGISTRATION_VERIFIED` | Registrasi disetujui | `{ registrationId }` | `/mitra/home` | `"Mulai Eksplorasi"` |
| `MITRA_REGISTRATION_REJECTED` | Registrasi ditolak | `{ registrationId, reason }` | `/registration-status` | `"Perbaiki Berkas"` |
| `SECURITY_PASSWORD_CHANGED` | Kata sandi diperbarui | `{ changedAt }` | `/mitra/home` | `"Dashboard"` |
| `SECURITY_TOTP_ENABLED` | 2FA aktif | `{ enabledAt }` | `/mitra/home` | `"Dashboard"` |

---

### 3.5 Kategori `sistem` (Internal Dashboard ATR/BPN)

| `code` | Pemicu (Trigger) | Isi `metadata` dari BE | Target Rute TanStack Router | Rekomendasi `actionLabel` |
|---|---|---|---|---|
| `INTERNAL_NEW_ORDER_REVIEW` | Ada order spasial perlu ACC | `{ orderId, orderNumber, mitraName }` | `/internal/order-review/${meta.orderId}` | `"Review Pesanan"` |
| `INTERNAL_NEW_REGISTRATION` | Ada berkas pendaftar mitra baru | `{ registrationId, companyName }` | `/internal/mitra-registration/${meta.registrationId}` | `"Verifikasi Berkas"` |
| `SYSTEM_ANNOUNCEMENT` | Pengumuman pemeliharaan sistem | `{ announcementId }` | `undefined` (Modal popup) | `undefined` |

---

## 4. Implementasi di Frontend (Copy-Paste Ready)

### 4.1 Pembaruan Type Definition
Lokasi: `src/features/notification/types/inbox.type.ts`

Tambahkan union type `InboxCode`:

```typescript
export type InboxCode =
  // Transaksi
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "ORDER_PROVISIONING"
  | "ORDER_PENDING_REVIEW"
  | "ORDER_PENDING_TTE"
  | "ORDER_READY"
  | "ORDER_REJECTED"
  | "ORDER_CANCELLED"
  // Kedaluwarsa
  | "WORKSPACE_EXPIRING_H7"
  | "WORKSPACE_EXPIRING_H3"
  | "WORKSPACE_EXPIRING_H1"
  | "WORKSPACE_EXPIRED"
  // Bantuan
  | "TICKET_CREATED"
  | "TICKET_REPLIED"
  | "TICKET_RESOLVED"
  | "TICKET_CLOSED"
  // Akun
  | "MITRA_REGISTRATION_SUBMITTED"
  | "MITRA_REGISTRATION_VERIFIED"
  | "MITRA_REGISTRATION_REJECTED"
  | "SECURITY_PASSWORD_CHANGED"
  | "SECURITY_TOTP_ENABLED"
  // Internal
  | "INTERNAL_NEW_ORDER_REVIEW"
  | "INTERNAL_NEW_REGISTRATION"
  | "SYSTEM_ANNOUNCEMENT";

export type InboxItemMetadata = {
  orderId?: string;
  orderNumber?: string;
  billingCode?: string;
  workspaceId?: string;
  workspaceName?: string;
  daysRemaining?: number;
  expiresAt?: string;
  expiredAt?: string;
  ticketId?: string;
  ticketNumber?: string;
  registrationId?: string;
  reason?: string;
  [key: string]: unknown;
};

export type InboxItem = {
  id: string;
  code?: InboxCode;
  category: InboxCategory;
  isRead: boolean;
  metadata?: InboxItemMetadata;
  createdAt: string;
  readAt?: string | null;

  // Fallback transisi
  title?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
};
```

---

### 4.2 Helper Resolver UI
Lokasi: `src/features/notification/constants/inbox-code-resolver.ts`

```typescript
// src/features/notification/constants/inbox-code-resolver.ts

import type { InboxItem } from "@/features/notification/types/inbox.type";
import {
  AlertTriangleIcon,
  BellIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  CreditCardIcon,
  FileTextIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";
import type { ElementType } from "react";

export type InboxResolvedUI = {
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  icon: ElementType;
  colorPalette: "blue" | "green" | "orange" | "red" | "purple" | "gray";
};

export const resolveInboxUI = (item: InboxItem): InboxResolvedUI => {
  const meta = item.metadata ?? {};
  const code = item.code;

  switch (code) {
    // ── Kategori Transaksi ───────────────────────────────────────────────────
    case "ORDER_CREATED":
      return {
        title: `Menunggu Pembayaran: ${meta.orderNumber ?? ""}`,
        message: `Silakan lakukan pembayaran kode billing untuk pesanan ${meta.orderNumber ?? ""}.`,
        actionUrl: meta.billingCode
          ? `/mitra/billing/${meta.billingCode}`
          : "/mitra/transaction-history",
        actionLabel: "Bayar Billing",
        icon: CreditCardIcon,
        colorPalette: "orange",
      };

    case "ORDER_PAID":
      return {
        title: `Pembayaran Berhasil: ${meta.orderNumber ?? ""}`,
        message: `Pembayaran terverifikasi. Layanan spasial masuk ke dalam antrean pemrosesan.`,
        actionUrl: "/mitra/transaction-history",
        actionLabel: "Lihat Riwayat",
        icon: CheckCircle2Icon,
        colorPalette: "green",
      };

    case "ORDER_PROVISIONING":
      return {
        title: `Sedang Diproses: ${meta.orderNumber ?? ""}`,
        message: `Layer spasial pesanan ${meta.orderNumber ?? ""} sedang dibentuk di GeoServer.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Pantau Status",
        icon: ClockIcon,
        colorPalette: "blue",
      };

    case "ORDER_PENDING_REVIEW":
      return {
        title: `Menunggu Verifikasi Admin: ${meta.orderNumber ?? ""}`,
        message: `Potongan layer spasial selesai diproses dan menunggu verifikasi akhir Tim ATR/BPN.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Cek Verifikasi",
        icon: ClipboardListIcon,
        colorPalette: "purple",
      };

    case "ORDER_PENDING_TTE":
      return {
        title: `Menunggu TTE: ${meta.orderNumber ?? ""}`,
        message: `Dokumen invoice pesanan ${meta.orderNumber ?? ""} sedang dalam proses Tanda Tangan Elektronik.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Lihat Status TTE",
        icon: FileTextIcon,
        colorPalette: "blue",
      };

    case "ORDER_READY":
      return {
        title: `Layanan Aktif: ${meta.orderNumber ?? ""}`,
        message: `Seluruh layer data spasial telah aktif dan siap diakses via WMS & WFS.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Buka di Peta",
        icon: CheckCircle2Icon,
        colorPalette: "green",
      };

    case "ORDER_REJECTED":
      return {
        title: `Pesanan Ditolak: ${meta.orderNumber ?? ""}`,
        message: `Pesanan Anda ditolak. Alasan: ${meta.reason ?? "Silakan periksa riwayat transaksi."}`,
        actionUrl: "/mitra/transaction-history",
        actionLabel: "Lihat Alasan",
        icon: XCircleIcon,
        colorPalette: "red",
      };

    case "ORDER_CANCELLED":
      return {
        title: `Pesanan Dibatalkan: ${meta.orderNumber ?? ""}`,
        message: `Batas waktu pembayaran pesanan telah kedaluwarsa.`,
        actionUrl: "/mitra/cart",
        actionLabel: "Pesan Ulang",
        icon: XCircleIcon,
        colorPalette: "red",
      };

    // ── Kategori Kedaluwarsa ────────────────────────────────────────────────
    case "WORKSPACE_EXPIRING_H7":
    case "WORKSPACE_EXPIRING_H3":
    case "WORKSPACE_EXPIRING_H1":
      return {
        title: `Masa Aktif Hampir Habis: Sisa ${meta.daysRemaining ?? ""} Hari`,
        message: `Layanan data spasial pada workspace '${meta.workspaceName ?? ""}' akan segera berakhir. Segera lakukan perpanjangan.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Perpanjang Layanan",
        icon: AlertTriangleIcon,
        colorPalette: "orange",
      };

    case "WORKSPACE_EXPIRED":
      return {
        title: `Layanan Kedaluwarsa: ${meta.workspaceName ?? ""}`,
        message: `Masa aktif akses WMS/WFS telah habis. Silakan aktifkan kembali untuk mengakses layer.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Aktifkan Kembali",
        icon: XCircleIcon,
        colorPalette: "red",
      };

    // ── Kategori Bantuan ────────────────────────────────────────────────────
    case "TICKET_CREATED":
      return {
        title: `Tiket Dibuat: #${meta.ticketNumber ?? ""}`,
        message: `Tiket bantuan #${meta.ticketNumber ?? ""} berhasil dibuat. Petugas kami akan segera menanggapi.`,
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Lihat Tiket",
        icon: HelpCircleIcon,
        colorPalette: "blue",
      };

    case "TICKET_REPLIED":
      return {
        title: `Balasan Tiket #${meta.ticketNumber ?? ""}`,
        message: `Petugas telah membalas tiket bantuan Anda.`,
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Baca Balasan",
        icon: HelpCircleIcon,
        colorPalette: "blue",
      };

    case "TICKET_RESOLVED":
    case "TICKET_CLOSED":
      return {
        title: `Tiket Selesai: #${meta.ticketNumber ?? ""}`,
        message: `Kendala tiket #${meta.ticketNumber ?? ""} telah diselesaikan oleh petugas.`,
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Detail Tiket",
        icon: CheckCircle2Icon,
        colorPalette: "green",
      };

    // ── Kategori Akun ───────────────────────────────────────────────────────
    case "MITRA_REGISTRATION_SUBMITTED":
      return {
        title: "Pendaftaran Kemitraan Diajukan",
        message: "Dokumen pendaftaran Anda sedang dalam proses verifikasi tim verifikator.",
        actionUrl: "/registration-status",
        actionLabel: "Cek Status",
        icon: ClockIcon,
        colorPalette: "blue",
      };

    case "MITRA_REGISTRATION_VERIFIED":
      return {
        title: "Kemitraan Disetujui!",
        message: "Selamat, akun kemitraan Anda telah diverifikasi. Anda sekarang dapat mengakses katalog data.",
        actionUrl: "/mitra/home",
        actionLabel: "Mulai Akses Data",
        icon: UserCheckIcon,
        colorPalette: "green",
      };

    case "MITRA_REGISTRATION_REJECTED":
      return {
        title: "Pendaftaran Kemitraan Ditolak",
        message: `Pengajuan kemitraan ditolak. Alasan: ${meta.reason ?? "Dokumen tidak sesuai."}`,
        actionUrl: "/registration-status",
        actionLabel: "Perbaiki Berkas",
        icon: XCircleIcon,
        colorPalette: "red",
      };

    case "SECURITY_PASSWORD_CHANGED":
      return {
        title: "Kata Sandi Diperbarui",
        message: "Kata sandi akun Anda baru saja berhasil diperbarui.",
        actionUrl: "/mitra/home",
        actionLabel: "Dashboard",
        icon: ShieldCheckIcon,
        colorPalette: "blue",
      };

    // ── Kategori Internal ───────────────────────────────────────────────────
    case "INTERNAL_NEW_ORDER_REVIEW":
      return {
        title: `Pesanan Perlu Review: ${meta.orderNumber ?? ""}`,
        message: `Mitra mengajukan pesanan yang memerlukan verifikasi layer spasial.`,
        actionUrl: `/internal/order-review/${meta.orderId ?? ""}`,
        actionLabel: "Review Pesanan",
        icon: ClipboardListIcon,
        colorPalette: "blue",
      };

    case "INTERNAL_NEW_REGISTRATION":
      return {
        title: "Pendaftar Mitra Baru",
        message: "Ada pendaftaran mitra baru yang menunggu proses verifikasi berkas.",
        actionUrl: `/internal/mitra-registration/${meta.registrationId ?? ""}`,
        actionLabel: "Verifikasi Berkas",
        icon: UserCheckIcon,
        colorPalette: "purple",
      };

    // ── Fallback Aman (Backward-Compatibility) ──────────────────────────────
    default:
      return {
        title: item.title ?? "Pemberitahuan",
        message: item.message ?? "Anda memiliki pesan notifikasi baru.",
        actionUrl: item.actionUrl,
        actionLabel: item.actionLabel ?? "Buka",
        icon: BellIcon,
        colorPalette: "gray",
      };
  }
};
```

---

### 4.3 Contoh Integrasi Komponen `InboxCardItem`
Lokasi: `src/features/notification/components/notification.inbox.data-view.tsx`

```tsx
import { resolveInboxUI } from "@/features/notification/constants/inbox-code-resolver";
import { useMemo } from "react";

// Di dalam komponen InboxCardItem:
const InboxCardItem = memo((props: InboxCardItemProps) => {
  const { item, onMarkAsRead, onDelete } = props;

  // Stores & Hooks
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  // Derived Values
  const resolved = useMemo(() => resolveInboxUI(item), [item]);
  const IconComponent = resolved.icon;
  const colorPalette = resolved.colorPalette;
  const hasAction = Boolean(resolved.actionUrl);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isRead) {
      onMarkAsRead(item.id);
    }
    if (resolved.actionUrl) {
      void navigate({ href: resolved.actionUrl });
    }
  };

  return (
    <HStack
      align={"start"}
      justify={"space-between"}
      p={"sm"}
      gap={["sm", null, "md"]}
      bg={item.isRead ? "bg.body" : "bg.subtle"}
      shadow={"xs"}
      rounded={theme.radii.container}
      w={"full"}
      cursor={hasAction ? "pointer" : "default"}
      onClick={handleActionClick}
    >
      <Circle
        w={"28px"}
        h={"28px"}
        bg={item.isRead ? "bg.muted" : `${colorPalette}.muted`}
        color={item.isRead ? "fg.muted" : `${colorPalette}.fg`}
      >
        <AppIcon icon={IconComponent} size={"sm"} />
      </Circle>

      <VStack flex={1} align={"stretch"} gap={"xs"}>
        <HStack justify={"space-between"}>
          <ClampedP fontWeight={item.isRead ? "medium" : "semibold"}>
            {resolved.title}
          </ClampedP>
          <Badge colorPalette={colorPalette} size={"xs"}>
            {item.category}
          </Badge>
        </HStack>

        <P color={"fg.muted"} fontSize={"sm"}>
          {resolved.message}
        </P>

        {hasAction && (
          <Button
            size={"xs"}
            variant={"outline"}
            colorPalette={colorPalette}
            onClick={handleActionClick}
          >
            {resolved.actionLabel}
          </Button>
        )}
      </VStack>
    </HStack>
  );
});
```

---

## 5. Ringkasan Keuntungan Bagi Frontend

1. **Routing Kebal Perubahan**: Frontend bebas mengatur dan merestrukturisasi TanStack Router tree tanpa khawatir link notifikasi di database lama menjadi *broken link*.
2. **Support Multibahasa (i18n)**: String teks di `inbox-code-resolver.ts` dapat langsung dibungkus fungsi Paraglide JS (`m.order_created_title()`, dll).
3. **Pembersihan Logika Komponen**: Tidak ada lagi parsing URL regex atau substring hack di komponen UI.
