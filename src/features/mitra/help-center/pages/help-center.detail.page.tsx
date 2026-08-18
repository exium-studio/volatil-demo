// src/features/mitra/help-center/pages/help-center.detail.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { HelpCenterModalReply } from "@/features/mitra/help-center/components/help-center.modal.reply";
import { useHelpCenterDetailQuery } from "@/features/mitra/help-center/hooks/use-help-center.query";
import type {
  HelpCenterAttachment,
  HelpCenterResponse,
  HelpCenterStatus,
} from "@/features/mitra/help-center/types/help-center.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/features/mitra/my-data/utils/my-data-date";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  DownloadIcon,
  FileIcon,
  ImageIcon,
  MessageSquarePlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { useMemo } from "react";

const STATUS_CONFIG_MAP: Record<
  HelpCenterStatus,
  { label: string; color: string }
> = {
  submitted: { label: "Diajukan", color: "blue" },
  in_review: { label: "Ditinjau", color: "yellow" },
  in_progress: { label: "Diproses", color: "orange" },
  resolved: { label: "Selesai", color: "green" },
  rejected: { label: "Ditolak", color: "red" },
};

export const HelpCenterDetailPage = () => {
  // Navigation & Params
  const { ticketId } = useParams({ strict: false });
  const router = useRouter();

  // Stores
  const { theme } = useThemeStore();
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const { data: ticket, isLoading, isFetching } =
    useHelpCenterDetailQuery(ticketId ?? "");

  const statusConfig =
    ticket?.status && STATUS_CONFIG_MAP[ticket.status]
      ? STATUS_CONFIG_MAP[ticket.status]
      : {
          label: ticket?.status ?? "Diajukan",
          color: "blue",
        };

  const replies: HelpCenterResponse[] =
    ticket?.responses ?? ticket?.replies ?? [];
  const attachments: HelpCenterAttachment[] = ticket?.attachments ?? [];

  if (isLoading) {
    return (
      <PanelContentContainer gap={PADDING.sm} p={PADDING.sm}>
        <Skeleton h={"80px"} w={"full"} />
        <Skeleton h={"260px"} w={"full"} />
        <Skeleton h={"300px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  if (!ticket) {
    return (
      <PanelContentContainer gap={PADDING.sm} p={PADDING.sm}>
        <Container.Root withContext={true}>
          <Container.Body p={PADDING.lg} align={"center"}>
            <P fontSize={"lg"} fontWeight={"bold"} mb={2}>
              {"Laporan Tidak Ditemukan"}
            </P>
            <P color={"fg.muted"} mb={4}>
              {"Tiket dengan ID ini tidak tersedia atau telah dihapus."}
            </P>
            <Button onClick={() => router.history.back()}>
              <AppIcon icon={ArrowLeftIcon} />
              {"Kembali ke Daftar Laporan"}
            </Button>
          </Container.Body>
        </Container.Root>
      </PanelContentContainer>
    );
  }

  const reporterName =
    ticket.reporter?.name ?? ticket.user?.name ?? "Pelapor";
  const reporterOrg =
    ticket.reporter?.organizationName ??
    ticket.user?.organizationName ??
    "";
  const reporterEmail =
    ticket.reporter?.email ?? ticket.user?.email ?? "";

  return (
    <PanelContentContainer
      overflowY={"auto"}
      gap={PADDING.sm}
      p={PADDING.sm}
      position={"relative"}
    >
      <TopBarLoader isFetching={isFetching} />

      {/* Header Container */}
      <Container.Root withContext={true}>
        <Container.Body p={PADDING.md}>
          <HStack
            align={"center"}
            justify={"space-between"}
            wrap={"wrap"}
            gap={SPACING.md}
            w={"full"}
          >
            <HStack gap={SPACING.md} align={"center"}>
              <Button
                variant={"subtle"}
                size={"sm"}
                onClick={() => router.history.back()}
              >
                <AppIcon icon={ArrowLeftIcon} />
                {"Kembali"}
              </Button>

              <VStack align={"start"} gap={0}>
                <HStack gap={2} align={"center"}>
                  <P fontSize={"xl"} fontWeight={"bold"} color={"fg.default"}>
                    {ticket.title}
                  </P>
                  <Badge colorPalette={statusConfig.color} variant={"subtle"}>
                    {statusConfig.label}
                  </Badge>
                  {ticket.priority && (
                    <Badge variant={"outline"} colorPalette={"gray"}>
                      {`Prioritas: ${ticket.priority.toUpperCase()}`}
                    </Badge>
                  )}
                </HStack>

                <P fontSize={"xs"} color={"fg.subtle"}>
                  {`ID Laporan: #${ticket.id} • Dibuat pada ${formatUtcDateTime(
                    ticket.createdAt,
                    preferredTimezone,
                  )}`}
                </P>
              </VStack>
            </HStack>

            <HelpCenterModalReply
              ticketId={ticket.id}
              currentStatus={ticket.status}
              trigger={
                <Button primary={true}>
                  <AppIcon icon={MessageSquarePlusIcon} />
                  {"Balas Laporan"}
                </Button>
              }
            />
          </HStack>
        </Container.Body>
      </Container.Root>

      {/* Original Issue Content Container */}
      <Container.Root withContext={true}>
        <Container.Body p={0}>
          <VStack align={"stretch"} gap={0}>
            <HStack
              justify={"space-between"}
              align={"center"}
              p={PADDING.md}
              bg={"bg.subtle"}
            >
              <HStack gap={SPACING.sm} align={"center"}>
                <Circle p={2} bg={"bg.muted"} color={"fg.muted"}>
                  <AppIcon icon={UserIcon} />
                </Circle>
                <VStack align={"start"} gap={0}>
                  <P fontWeight={"semibold"}>{reporterName}</P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {[reporterEmail, reporterOrg].filter(Boolean).join(" • ")}
                  </P>
                </VStack>
              </HStack>

              <P fontSize={"xs"} color={"fg.subtle"}>
                {formatUtcDateTime(ticket.createdAt, preferredTimezone)}
              </P>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            <VStack align={"start"} gap={SPACING.md} p={PADDING.md}>
              <P color={"fg.default"} whiteSpace={"pre-wrap"} lineHeight={"tall"}>
                {ticket.description}
              </P>

              {/* Attachments Section */}
              {attachments.length > 0 && (
                <VStack align={"start"} gap={2} w={"full"} pt={2}>
                  <P fontSize={"xs"} fontWeight={"bold"} color={"fg.subtle"}>
                    {`LAMPIRAN (${attachments.length})`}
                  </P>

                  <HStack wrap={"wrap"} gap={2} w={"full"}>
                    {attachments.map((att, idx) => {
                      const fileName =
                        att.originalFileName ??
                        att.originalName ??
                        att.storedFileName ??
                        att.fileName ??
                        `Lampiran-${idx + 1}`;
                      const fileUrl = att.fileUrl ?? att.url;
                      const isImage =
                        att.mimeType?.startsWith("image/") ||
                        att.fileType?.startsWith("image/");

                      return (
                        <Box
                          key={att.id || String(idx)}
                          p={PADDING.sm}
                          border={"1px solid"}
                          borderColor={"border.subtle"}
                          rounded={theme.radii.component}
                          bg={"bg.body"}
                        >
                          <HStack gap={SPACING.sm} align={"center"}>
                            <AppIcon
                              icon={isImage ? ImageIcon : FileIcon}
                              size={"sm"}
                              color={"fg.muted"}
                            />
                            <P fontSize={"sm"} fontWeight={"medium"}>
                              {fileName}
                            </P>

                            {fileUrl && (
                              <Button
                                asChild
                                variant={"ghost"}
                                size={"2xs"}
                              >
                                <a
                                  href={fileUrl}
                                  target={"_blank"}
                                  rel={"noreferrer"}
                                  download
                                >
                                  <AppIcon icon={DownloadIcon} size={"xs"} />
                                </a>
                              </Button>
                            )}
                          </HStack>
                        </Box>
                      );
                    })}
                  </HStack>
                </VStack>
              )}
            </VStack>
          </VStack>
        </Container.Body>
      </Container.Root>

      {/* Timeline of Replies */}
      <Container.Root withContext={true}>
        <Container.Body p={0}>
          <VStack align={"stretch"} gap={0}>
            <HStack p={PADDING.md} justify={"space-between"} align={"center"}>
              <P fontSize={"md"} fontWeight={"semibold"}>
                {`Riwayat Tanggapan & Balasan (${replies.length})`}
              </P>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {replies.length === 0 ? (
              <Box p={PADDING.xl} textAlign={"center"}>
                <P color={"fg.subtle"}>
                  {"Belum ada balasan untuk laporan ini. Klik tombol 'Balas Laporan' di atas untuk memberikan tanggapan."}
                </P>
              </Box>
            ) : (
              <VStack align={"stretch"} gap={0} p={PADDING.md}>
                {replies.map((reply, idx) => {
                  const replyUserName =
                    reply.admin?.name ?? reply.user?.name ?? "Admin Internal";
                  const replyUserRole =
                    reply.admin?.role ?? reply.user?.role ?? "internal";
                  const isInternal = replyUserRole === "internal";
                  const replyAttachments = reply.attachments ?? [];

                  return (
                    <Box
                      key={reply.id || String(idx)}
                      p={PADDING.md}
                      bg={isInternal ? "bg.subtle" : "bg.body"}
                      rounded={theme.radii.container}
                      border={"1px solid"}
                      borderColor={"border.subtle"}
                      mb={SPACING.sm}
                    >
                      <VStack align={"stretch"} gap={SPACING.sm}>
                        <HStack
                          justify={"space-between"}
                          align={"center"}
                          w={"full"}
                        >
                          <HStack gap={SPACING.sm} align={"center"}>
                            <Circle
                              p={1.5}
                              bg={
                                isInternal
                                  ? `${theme.colorPalette}.subtle`
                                  : "bg.muted"
                              }
                              color={
                                isInternal
                                  ? `${theme.colorPalette}.fg`
                                  : "fg.muted"
                              }
                            >
                              <AppIcon
                                icon={isInternal ? ShieldCheckIcon : UserIcon}
                                size={"xs"}
                              />
                            </Circle>

                            <P fontWeight={"bold"}>{replyUserName}</P>

                            {isInternal && (
                              <Badge
                                colorPalette={theme.colorPalette}
                                variant={"subtle"}
                                size={"xs"}
                              >
                                {"Admin ATR/BPN"}
                              </Badge>
                            )}
                          </HStack>

                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {formatUtcDateTime(
                              reply.createdAt,
                              preferredTimezone,
                            )}
                          </P>
                        </HStack>

                        <VStack pl={"36px"} align={"start"} gap={2}>
                          <P
                            color={"fg.default"}
                            whiteSpace={"pre-wrap"}
                            lineHeight={"tall"}
                          >
                            {reply.message}
                          </P>

                          {replyAttachments.length > 0 && (
                            <HStack wrap={"wrap"} gap={2} pt={1}>
                              {replyAttachments.map((att, attIdx) => {
                                const attName =
                                  att.originalFileName ??
                                  att.originalName ??
                                  `Lampiran-${attIdx + 1}`;
                                const attUrl = att.fileUrl ?? att.url;

                                return (
                                  <Badge
                                    key={att.id || String(attIdx)}
                                    variant={"outline"}
                                    colorPalette={"gray"}
                                  >
                                    <AppIcon icon={FileIcon} size={"xs"} />
                                    {attName}
                                    {attUrl && (
                                      <Button
                                        asChild
                                        variant={"ghost"}
                                        size={"2xs"}
                                        p={0}
                                        ml={1}
                                      >
                                        <a
                                          href={attUrl}
                                          target={"_blank"}
                                          rel={"noreferrer"}
                                          download
                                        >
                                          <AppIcon
                                            icon={DownloadIcon}
                                            size={"xs"}
                                          />
                                        </a>
                                      </Button>
                                    )}
                                  </Badge>
                                );
                              })}
                            </HStack>
                          )}
                        </VStack>
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </VStack>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
