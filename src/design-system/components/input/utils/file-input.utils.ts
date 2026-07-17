// src/design-system/components/input/utils/file-input.utils.ts

import {
  IconArchive,
  IconCode,
  IconCsv,
  IconFile,
  IconFileAnalytics,
  IconFileCertificate,
  IconFileCode,
  IconFileDatabase,
  IconFileDescription,
  IconFileDigit,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypePdf,
  IconFileTypeSql,
  IconFileTypeSvg,
  IconFileWord,
  IconMarkdown,
  IconMusic,
  IconPresentation,
  IconVideo,
} from "@tabler/icons-react";
import { ImageIcon } from "lucide-react";

export function getFileIcon(mimeType?: string) {
  switch (mimeType) {
    // Images
    case "image/jpeg":
    case "image/jpg":
    case "image/png":
    case "image/gif":
    case "image/webp":
    case "image/avif":
    case "image/bmp":
    case "image/tiff":
    case "image/heic":
    case "image/heif":
    case "image/x-icon":
      return ImageIcon;

    case "image/svg+xml":
      return IconFileTypeSvg;

    // PDFs
    case "application/pdf":
      return IconFileTypePdf;

    // Word
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return IconFileWord;

    // Excel
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return IconFileSpreadsheet;

    // PowerPoint
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return IconPresentation;

    // Text
    case "text/plain":
      return IconFileText;

    case "text/markdown":
      return IconMarkdown;

    case "text/csv":
      return IconCsv;

    case "text/html":
    case "text/css":
    case "text/javascript":
    case "application/javascript":
    case "application/typescript":
    case "text/typescript":
    case "application/json":
    case "application/ld+json":
    case "application/xml":
    case "text/xml":
    case "application/yaml":
    case "text/yaml":
    case "application/x-yaml":
      return IconCode;

    // Source code
    case "text/x-java":
    case "text/x-python":
    case "text/x-c":
    case "text/x-c++":
    case "text/x-csharp":
    case "text/x-go":
    case "text/x-rust":
    case "text/x-php":
    case "application/x-httpd-php":
      return IconFileCode;

    // SQL
    case "application/sql":
    case "text/sql":
      return IconFileTypeSql;

    // Database
    case "application/vnd.sqlite3":
    case "application/x-sqlite3":
      return IconFileDatabase;

    // Video
    case "video/mp4":
    case "video/webm":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/x-matroska":
    case "video/mpeg":
    case "video/3gpp":
      return IconVideo;

    // Audio
    case "audio/mpeg":
    case "audio/mp3":
    case "audio/wav":
    case "audio/ogg":
    case "audio/flac":
    case "audio/aac":
    case "audio/x-m4a":
      return IconMusic;

    // Archives
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/x-7z-compressed":
    case "application/x-rar-compressed":
    case "application/gzip":
    case "application/x-tar":
    case "application/x-bzip2":
      return IconArchive;

    // Certificates
    case "application/x-x509-ca-cert":
    case "application/pkix-cert":
      return IconFileCertificate;

    // Numbers
    case "application/vnd.oasis.opendocument.spreadsheet":
      return IconFileDigit;

    // Documents
    case "application/vnd.oasis.opendocument.text":
      return IconFileDescription;

    // Analytics
    case "application/vnd.ms-access":
      return IconFileAnalytics;

    default:
      return IconFile;
  }
}
