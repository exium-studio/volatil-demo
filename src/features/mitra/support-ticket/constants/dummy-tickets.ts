// src/features/mitra/support-ticket/constants/dummy-tickets.ts

import type {
  TicketItem,
  TicketSummaryMetrics,
} from "@/features/mitra/support-ticket/types/support-ticket.type";

export const DUMMY_TICKET_METRICS: TicketSummaryMetrics = {
  activeCount: 12,
  resolvedCount: 8,
  totalCount: 20,
};

export const DUMMY_TICKETS: TicketItem[] = [
  {
    id: "ticket-1",
    authorName: "Pemerintah Semarang",
    isCurrentUser: true,
    createdAt: "30 Juni 2026",
    status: "active",
    title: "Pembayaran Gagal, Saldo Terpotong!",
    description:
      "Saya sudah membayar lunas mengenai data yang saya bayar, akan tetapi bidangnya tetap belum berhasil dibayar! Bagaimana solusi terbaiknya?",
    attachments: [
      { id: "att-1", fileName: "Screenshoot1.png", fileType: "image" },
      { id: "att-2", fileName: "Videoshoot1.mp4", fileType: "video" },
    ],
    upvotesCount: 5,
    isUpvoted: true,
    replies: [
      {
        id: "reply-1",
        authorName: "Kementerian ATR/BPN",
        authorRole: "admin",
        isVerified: true,
        createdAt: "30 Juni 2026",
        content:
          "Mohon maaf atas tidak kenyamanan tersebut! Kami akan segera melakukan pembenahan. Mohon tunggu sebentar!",
      },
    ],
  },
  {
    id: "ticket-2",
    authorName: "Pemerintah Bandung",
    isCurrentUser: false,
    createdAt: "30 Juni 2026",
    status: "pending",
    title: "Pembayaran Berhasil, Saldo Tidak Terpotong!",
    description:
      "Saya sudah membayar lunas mengenai data yang saya bayar, akan tetapi saldo saya tidak terpotong sama sekali! Bagaimana solusi terbaiknya?",
    attachments: [
      { id: "att-3", fileName: "Screenshoot1.png", fileType: "image" },
      { id: "att-4", fileName: "Videoshoot1.mp4", fileType: "video" },
    ],
    upvotesCount: 5,
    isUpvoted: false,
    replies: [],
  },
  {
    id: "ticket-3",
    authorName: "Pemerintah Sleman",
    isCurrentUser: false,
    createdAt: "28 Juni 2026",
    status: "resolved",
    title: "Kueri Layer RTRW Terlalu Lambat Saat Dimuat",
    description:
      "Saat memuat layer WFS RTRW Kabupaten Sleman, respon GeoServer memerlukan waktu sekitar 10 detik. Apakah ada optimasi batas bbox?",
    attachments: [
      { id: "att-5", fileName: "GeoServer_Log.png", fileType: "image" },
    ],
    upvotesCount: 12,
    isUpvoted: false,
    replies: [
      {
        id: "reply-2",
        authorName: "Kementerian ATR/BPN",
        authorRole: "admin",
        isVerified: true,
        createdAt: "29 Juni 2026",
        content:
          "Halo Pemerintah Sleman, kami telah melakukan pengindeksan ulang spasial PostGIS pada layer RTRW Sleman. Silakan dicoba kembali!",
      },
    ],
  },
];
