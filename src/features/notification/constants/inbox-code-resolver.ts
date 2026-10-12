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
  const code = item.code;

  switch (code) {
    // ── Kategori Transaksi ───────────────────────────────────────────────────
    case "ORDER_CREATED": {
      const orderRef = meta.orderId ?? meta.billingCode;
      const targetUrl = orderRef
        ? `/mitra/transaction-history?activeModalKey=transaction-detail-${orderRef}`
        : "/mitra/transaction-history";

      return {
        title: `Menunggu Pembayaran: ${meta.orderNumber ?? ""}`,
        message: `Silakan lakukan pembayaran kode billing untuk pesanan ${meta.orderNumber ?? ""}.`,
        actionUrl: targetUrl,
        actionLabel: "Bayar Billing",
        icon: CreditCardIcon,
        colorPalette: "orange",
      };
    }

    case "ORDER_PAID":
      return {
        title: `Pembayaran Berhasil: ${meta.orderNumber ?? ""}`,
        message:
          "Pembayaran terverifikasi. Layanan spasial masuk ke dalam antrean pemrosesan.",
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
        message:
          "Potongan layer spasial selesai diproses dan menunggu verifikasi akhir Tim ATR/BPN.",
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
        message:
          "Seluruh layer data spasial telah aktif dan siap diakses via WMS & WFS.",
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
        message: "Batas waktu pembayaran pesanan telah kedaluwarsa.",
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
        message:
          "Masa aktif akses WMS/WFS telah habis. Silakan aktifkan kembali untuk mengakses layer.",
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
        message: "Petugas telah membalas tiket bantuan Anda.",
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
        message:
          "Dokumen pendaftaran Anda sedang dalam proses verifikasi tim verifikator.",
        actionUrl: "/registration-status",
        actionLabel: "Cek Status",
        icon: ClockIcon,
        colorPalette: "blue",
      };

    case "MITRA_REGISTRATION_VERIFIED":
      return {
        title: "Kemitraan Disetujui!",
        message:
          "Selamat, akun kemitraan Anda telah diverifikasi. Anda sekarang dapat mengakses katalog data.",
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

    case "SECURITY_TOTP_ENABLED":
      return {
        title: "Autentikasi Dua Faktor Aktif",
        message:
          "Keamanan 2FA (TOTP) akun Anda telah berhasil diaktifkan.",
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
        actionLabel: "Review Pesanan",
        icon: ClipboardListIcon,
        colorPalette: "blue",
      };

    case "INTERNAL_NEW_REGISTRATION":
      return {
        title: "Pendaftar Mitra Baru",
        message:
          "Ada pendaftaran mitra baru yang menunggu proses verifikasi berkas.",
        actionUrl: `/internal/mitra-registration/${meta.registrationId ?? ""}`,
        actionLabel: "Verifikasi Berkas",
        icon: UserCheckIcon,
        colorPalette: "purple",
      };

    case "SYSTEM_ANNOUNCEMENT":
      return {
        title: item.title ?? "Pengumuman Sistem",
        message: item.message ?? "Ada pengumuman resmi baru dari sistem.",
        actionUrl: item.actionUrl,
        actionLabel: item.actionLabel ?? "Lihat Pengumuman",
        icon: BellIcon,
        colorPalette: "blue",
      };

    // ── Fallback Aman (Backward-Compatibility) ──────────────────────────────
    default: {
      let fallbackUrl = item.actionUrl;

      // Handle legacy BE URLs pointing to /mitra/orders/:orderId
      if (fallbackUrl?.startsWith("/mitra/orders/")) {
        const orderId = fallbackUrl.replace("/mitra/orders/", "").split("?")[0];
        fallbackUrl = `/mitra/transaction-history?activeModalKey=transaction-detail-${orderId}`;
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
