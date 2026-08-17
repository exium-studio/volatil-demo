// src/features/mitra/support-ticket/constants/dummy-tickets.ts

import type {
  TicketItem,
  TicketStatistics,
} from "@/features/mitra/support-ticket/types/support-ticket.type";

export const DUMMY_TICKET_STATISTICS: TicketStatistics = {
  totalTickets: 12,
  activeTickets: 5,
  resolvedTickets: 7,
  breakdown: {
    open: 3,
    inProgress: 2,
    closed: 7,
  },
};

export const DUMMY_TICKETS: TicketItem[] = [
  {
    id: 1,
    userId: 1,
    title: "Kendala Sinyal di Titik Pos A",
    description: "Terjadi penurunan kualitas sinyal sejak pagi hari...",
    status: "in_progress",
    attachments: [
      {
        originalName: "foto-kondisi.jpg",
        fileName: "1723871234567-foto-kondisi.jpg",
        mimeType: "image/jpeg",
        size: 245120,
        url: "https://volatil-be.exium.web.id/uploads/1723871234567-foto-kondisi.jpg",
      },
    ],
    createdAt: "2026-08-17T05:20:00.000Z",
    updatedAt: "2026-08-17T05:30:00.000Z",
    user: {
      id: 1,
      name: "Mitra User Demo",
      email: "mitra@demo.com",
      role: "mitra",
    },
    responses: [
      {
        id: 1,
        ticketId: 1,
        adminId: 2,
        message: "Laporan telah kami terima dan tim teknis sedang menuju lokasi.",
        attachments: [
          {
            originalName: "surat-tugas.pdf",
            fileName: "1723871999999-surat-tugas.pdf",
            mimeType: "application/pdf",
            size: 102400,
            url: "https://volatil-be.exium.web.id/uploads/1723871999999-surat-tugas.pdf",
          },
        ],
        createdAt: "2026-08-17T05:30:00.000Z",
        admin: {
          id: 2,
          name: "Internal Admin Demo",
          email: "internal@demo.com",
          role: "internal",
        },
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    title: "Laporan Kerusakan Perangkat",
    description: "Perangkat sensor mati total setelah pemadaman listrik...",
    status: "open",
    attachments: [
      {
        originalName: "foto1.jpg",
        fileName: "1723872222222-foto1.jpg",
        mimeType: "image/jpeg",
        size: 312000,
        url: "https://volatil-be.exium.web.id/uploads/1723872222222-foto1.jpg",
      },
    ],
    createdAt: "2026-08-17T05:35:00.000Z",
    updatedAt: "2026-08-17T05:35:00.000Z",
    user: {
      id: 1,
      name: "Mitra User Demo",
      email: "mitra@demo.com",
      role: "mitra",
    },
    responses: [],
  },
  {
    id: 3,
    userId: 1,
    title: "Permohonan Pengajuan Ulang Akses Layer WFS",
    description: "Layer WFS ZNT Kabupaten Badung mengalami kegagalan autentikasi token.",
    status: "resolved",
    attachments: [],
    createdAt: "2026-08-16T10:15:00.000Z",
    updatedAt: "2026-08-16T11:00:00.000Z",
    user: {
      id: 1,
      name: "Mitra User Demo",
      email: "mitra@demo.com",
      role: "mitra",
    },
    responses: [
      {
        id: 2,
        ticketId: 3,
        adminId: 2,
        message: "Perangkat telah diganti dengan unit baru dan berfungsi normal kembali.",
        attachments: [
          {
            originalName: "berita-acara.pdf",
            fileName: "1723873333333-berita-acara.pdf",
            mimeType: "application/pdf",
            size: 512000,
            url: "https://volatil-be.exium.web.id/uploads/1723873333333-berita-acara.pdf",
          },
        ],
        createdAt: "2026-08-16T11:00:00.000Z",
        admin: {
          id: 2,
          name: "Internal Admin Demo",
          email: "internal@demo.com",
          role: "internal",
        },
      },
    ],
  },
];
