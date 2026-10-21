// src/features/notification/constants/inbox-code-resolver.ts

import type {
  InboxItem,
  InboxResolvedUI,
} from "@/features/notification/types/inbox.type";
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

export const resolveInboxUI = (item: InboxItem): InboxResolvedUI => {
  const meta = item.metadata ?? {};

  // Infer real code if BE sends generic SYSTEM_ANNOUNCEMENT or missing code
  let code = item.code;
  if (!code || code === "SYSTEM_ANNOUNCEMENT") {
    const title = item.title ?? "";
    const metaBillingCode = meta.billingCode;
    const metaWorkspaceId = meta.workspaceId;
    const metaWorkspaceName = meta.workspaceName;
    const metaDays = meta.daysRemaining;

    if (item.category === "kedaluwarsa" || metaWorkspaceId || metaWorkspaceName || title.includes("Masa Aktif")) {
      if (metaDays === 7 || title.includes("H-7") || title.includes("1 Minggu")) {
        code = "WORKSPACE_EXPIRING_H7";
      } else if (metaDays === 3 || title.includes("H-3")) {
        code = "WORKSPACE_EXPIRING_H3";
      } else if (metaDays === 1 || title.includes("H-1")) {
        code = "WORKSPACE_EXPIRING_H1";
      } else if (title.includes("Kedaluwarsa") || title.includes("Habis")) {
        code = "WORKSPACE_EXPIRED";
      } else {
        code = "WORKSPACE_EXPIRING_H7";
      }
    } else if (title.startsWith("Pembayaran Berhasil")) {
      code = "ORDER_PAID";
    } else if (
      title.startsWith("Verifikasi Layer Spasial") ||
      item.actionLabel?.toLowerCase().includes("verifikasi") ||
      meta.orderStatus === "pending_review"
    ) {
      code = "ORDER_PENDING_REVIEW";
    } else if (
      title.startsWith("Menunggu Pembayaran") ||
      title.startsWith("Kode Billing Diterbitkan") ||
      title.toLowerCase().includes("kode billing") ||
      (metaBillingCode && !meta.paidAt)
    ) {
      code = "ORDER_CREATED";
    } else if (
      title.startsWith("Layanan Data Spasial Aktif") ||
      title.startsWith("Layanan Aktif") ||
      meta.orderStatus === "ready"
    ) {
      code = "ORDER_READY";
    } else if (title.includes("TTE") || meta.orderStatus === "pending_tte") {
      code = "ORDER_PENDING_TTE";
    } else if (title.includes("Ditolak") || meta.orderStatus === "rejected") {
      code = "ORDER_REJECTED";
    } else if (title.includes("Dibatalkan") || meta.orderStatus === "cancelled") {
      code = "ORDER_CANCELLED";
    }
  }

  switch (code) {
    // ── Kategori Transaksi ───────────────────────────────────────────────────
    case "ORDER_CREATED": {
      const billingCode = meta.billingCode;
      const orderRef = meta.orderId ?? billingCode;
      const targetUrl = billingCode
        ? `/mitra/billing/${billingCode}`
        : orderRef
          ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
          : "/mitra/transaction-history";

      return {
        title: item.title ?? `Menunggu Pembayaran: ${meta.orderNumber ?? ""}`,
        message:
          item.message ??
          `Silakan lakukan pembayaran kode billing untuk pesanan ${meta.orderNumber ?? ""}.`,
        actionUrl: targetUrl,
        actionLabel: "Bayar sekarang",
        icon: CreditCardIcon,
        colorPalette: "orange",
      };
    }

    case "ORDER_PAID": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Pembayaran Berhasil: ${meta.orderNumber ?? ""}`,
        message:
          "Pembayaran terverifikasi. Layanan spasial masuk ke dalam antrean pemrosesan.",
        actionUrl: targetUrl,
        actionLabel: "Lihat detail transaksi",
        icon: CheckCircle2Icon,
        colorPalette: "blue",
      };
    }

    case "ORDER_PROVISIONING": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Sedang Diproses: ${meta.orderNumber ?? ""}`,
        message: `Layer spasial pesanan ${meta.orderNumber ?? ""} sedang dibentuk di GeoServer.`,
        actionUrl: targetUrl,
        actionLabel: "Pantau status",
        icon: ClockIcon,
        colorPalette: "blue",
      };
    }

    case "ORDER_PENDING_REVIEW": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Verifikasi Layer Spasial: ${meta.orderNumber ?? ""}`,
        message:
          "Potongan layer spasial selesai diproses dan menunggu verifikasi akhir Tim ATR/BPN.",
        actionUrl: targetUrl,
        actionLabel: "Cek status verifikasi",
        icon: ClipboardListIcon,
        colorPalette: "purple",
      };
    }

    case "ORDER_PENDING_TTE": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Menunggu TTE: ${meta.orderNumber ?? ""}`,
        message: `Dokumen invoice pesanan ${meta.orderNumber ?? ""} sedang dalam proses Tanda Tangan Elektronik.`,
        actionUrl: targetUrl,
        actionLabel: "Lihat status TTE",
        icon: FileTextIcon,
        colorPalette: "blue",
      };
    }

    case "ORDER_READY": {
      const workspaceRef = meta.workspaceId ?? meta.workspaceName;
      const targetUrl = workspaceRef
        ? `/mitra/my-data/${workspaceRef}`
        : meta.orderId
          ? `/mitra/transaction-history?activeModalKey=transaction-detail-${meta.orderId}`
          : "/mitra/my-data";

      return {
        title: item.title ?? `Layanan Aktif: ${meta.orderNumber ?? ""}`,
        message:
          item.message ??
          "Seluruh layer data spasial telah aktif dan siap diakses via WMS & WFS.",
        actionUrl: targetUrl,
        actionLabel: "Buka data saya",
        icon: CheckCircle2Icon,
        colorPalette: "green",
      };
    }

    case "ORDER_REJECTED": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Pesanan Ditolak: ${meta.orderNumber ?? ""}`,
        message: `Pesanan Anda ditolak. Alasan: ${meta.reason ?? "Silakan periksa riwayat transaksi."}`,
        actionUrl: targetUrl,
        actionLabel: "Lihat alasan",
        icon: XCircleIcon,
        colorPalette: "red",
      };
    }

    case "ORDER_CANCELLED": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Pesanan Dibatalkan: ${meta.orderNumber ?? ""}`,
        message: "Batas waktu pembayaran pesanan telah kedaluwarsa.",
        actionUrl: targetUrl,
        actionLabel: "Detail pesanan",
        icon: XCircleIcon,
        colorPalette: "red",
      };
    }

    // ── Kategori Kedaluwarsa ────────────────────────────────────────────────
    case "WORKSPACE_EXPIRING_H7":
    case "WORKSPACE_EXPIRING_H3":
    case "WORKSPACE_EXPIRING_H1":
      return {
        title:
          item.title ??
          `Masa Aktif Hampir Habis: Sisa ${meta.daysRemaining ?? ""} Hari`,
        message:
          item.message ??
          `Layanan data spasial pada workspace '${meta.workspaceName ?? ""}' akan segera berakhir. Segera lakukan perpanjangan.`,
        actionUrl: `/mitra/my-data/${meta.workspaceId ?? meta.workspaceName ?? ""}`,
        actionLabel: "Perpanjang layanan",
        icon: AlertTriangleIcon,
        colorPalette: "orange",
      };

    case "WORKSPACE_EXPIRED":
      return {
        title: item.title ?? `Layanan Kedaluwarsa: ${meta.workspaceName ?? ""}`,
        message:
          item.message ??
          "Masa aktif akses WMS/WFS telah habis dan tidak dapat diperpanjang atau diaktifkan kembali.",
        icon: XCircleIcon,
        colorPalette: "red",
      };

    // ── Kategori Bantuan ────────────────────────────────────────────────────
    case "TICKET_CREATED":
      return {
        title: `Tiket Dibuat: #${meta.ticketNumber ?? ""}`,
        message: `Tiket bantuan #${meta.ticketNumber ?? ""} berhasil dibuat. Petugas kami akan segera menanggapi.`,
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Lihat tiket",
        icon: HelpCircleIcon,
        colorPalette: "blue",
      };

    case "TICKET_REPLIED":
      return {
        title: `Balasan Tiket #${meta.ticketNumber ?? ""}`,
        message: "Petugas telah membalas tiket bantuan Anda.",
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Baca balasan",
        icon: HelpCircleIcon,
        colorPalette: "blue",
      };

    case "TICKET_RESOLVED":
    case "TICKET_CLOSED":
      return {
        title: `Tiket Selesai: #${meta.ticketNumber ?? ""}`,
        message: `Kendala tiket #${meta.ticketNumber ?? ""} telah diselesaikan oleh petugas.`,
        actionUrl: `/mitra/help-center/${meta.ticketId ?? ""}`,
        actionLabel: "Detail tiket",
        icon: CheckCircle2Icon,
        colorPalette: "green",
      };

    // ── Kategori Akun ───────────────────────────────────────────────────────
    case "MITRA_REGISTRATION_SUBMITTED":
      return {
        title: "Pendaftaran Kemitraan Diajukan",
        message:
          "Dokumen pendaftaran Anda sedang dalam proses verifikasi tim verifikator.",
        actionUrl: "/registration-status",
        actionLabel: "Cek status",
        icon: ClockIcon,
        colorPalette: "blue",
      };

    case "MITRA_REGISTRATION_VERIFIED":
      return {
        title: "Kemitraan Disetujui!",
        message:
          "Selamat, akun kemitraan Anda telah diverifikasi. Anda sekarang dapat mengakses katalog data.",
        actionUrl: "/mitra/home",
        actionLabel: "Mulai akses data",
        icon: UserCheckIcon,
        colorPalette: "green",
      };

    case "MITRA_REGISTRATION_REJECTED":
      return {
        title: "Pendaftaran Kemitraan Ditolak",
        message: `Pengajuan kemitraan ditolak. Alasan: ${meta.reason ?? "Dokumen tidak sesuai."}`,
        actionUrl: "/registration-status",
        actionLabel: "Perbaiki berkas",
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

    case "SECURITY_TOTP_ENABLED":
      return {
        title: "Autentikasi Dua Faktor Aktif",
        message: "Keamanan 2FA (TOTP) akun Anda telah berhasil diaktifkan.",
        actionUrl: "/mitra/home",
        actionLabel: "Dashboard",
        icon: ShieldCheckIcon,
        colorPalette: "green",
      };

    // ── Kategori Internal ───────────────────────────────────────────────────
    case "INTERNAL_NEW_ORDER_REVIEW":
      return {
        title: `Pesanan Perlu Review: ${meta.orderNumber ?? ""}`,
        message:
          "Mitra mengajukan pesanan yang memerlukan verifikasi layer spasial.",
        actionUrl: `/internal/order-review/${meta.orderId ?? ""}`,
        actionLabel: "Review pesanan",
        icon: ClipboardListIcon,
        colorPalette: "blue",
      };

    case "INTERNAL_NEW_REGISTRATION":
      return {
        title: "Pendaftar Mitra Baru",
        message:
          "Ada pendaftaran mitra baru yang menunggu proses verifikasi berkas.",
        actionUrl: `/internal/mitra-registration/${meta.registrationId ?? ""}`,
        actionLabel: "Verifikasi berkas",
        icon: UserCheckIcon,
        colorPalette: "purple",
      };

    case "SYSTEM_ANNOUNCEMENT":
      return {
        title: item.title ?? "Pengumuman Sistem",
        message: item.message ?? "Ada pengumuman resmi baru dari sistem.",
        actionUrl: item.actionUrl,
        actionLabel: item.actionLabel ?? "Lihat pengumuman",
        icon: BellIcon,
        colorPalette: "blue",
      };

    // ── Fallback Aman (Backward-Compatibility) ──────────────────────────────
    default: {
      let fallbackUrl = item.actionUrl;

      // Handle legacy BE URLs
      if (fallbackUrl?.startsWith("/mitra/orders/")) {
        const orderId = fallbackUrl.replace("/mitra/orders/", "").split("?")[0];
        fallbackUrl = `/mitra/transaction-history?activeModalKey=transaction-detail-${orderId}`;
      } else if (
        (item.actionLabel === "Cek Status Verifikasi" ||
          item.title?.includes("Verifikasi Layer Spasial")) &&
        (meta.orderId || meta.billingCode)
      ) {
        const orderRef = meta.orderId ?? meta.billingCode;
        fallbackUrl = `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`;
      }

      return {
        title: item.title ?? "Pemberitahuan",
        message: item.message ?? "Anda memiliki pesan notifikasi baru.",
        actionUrl: fallbackUrl,
        actionLabel: item.actionLabel ?? "Buka",
        icon: BellIcon,
        colorPalette: "gray",
      };
    }
  }
};
