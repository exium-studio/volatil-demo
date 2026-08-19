// src/features/mitra/help-center/pages/help-center.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
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
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { HelpCenterAttachmentItem } from "@/features/mitra/help-center/components/help-center.attachment-item";
import { HelpCenterModalReplyTrigger } from "@/features/mitra/help-center/components/help-center.modal.reply";
import { HelpCenterModalResolveRejectTrigger } from "@/features/mitra/help-center/components/help-center.modal.resolve-reject";
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
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  MessageSquarePlusIcon,
  ShieldCheckIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

const STATUS_CONFIG_MAP: Record<
  HelpCenterStatus,
  { label: string; color: string }
> = {
  submitted: { label: "Diajukan", color: "orange" },
  in_review: { label: "Ditinjau", color: "blue" },
  in_progress: { label: "Diproses", color: "blue" },
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
  const currentUser = useMemo(() => getUserSession(), []);
  const isInternalAdmin = currentUser?.role === "internal";

  // Queries
  const {
    data: ticket,
    isLoading,
    isFetching,
  } = useHelpCenterDetailQuery(ticketId ?? "");

  const statusConfig =
    ticket?.status && STATUS_CONFIG_MAP[ticket.status]
      ? STATUS_CONFIG_MAP[ticket.status]
      : {
          label: ticket?.status ?? "Diajukan",
          color: "orange",
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

  const reporterName = ticket.user?.name ?? "?";
  const reporterEmail = ticket.user?.email ?? "?";

  return (
    <PanelContentContainer
      overflowY={"auto"}
      gap={PADDING.sm}
      p={PADDING.sm}
      position={"relative"}
    >
      <TopBarLoader isFetching={isFetching} />

      {/* Header container */}
      <Container.Root withContext={true}>
        <Container.Body>
          <VStack w={"full"}>
            <HStack gap={SPACING.md} align={"center"} p={PADDING.md}>
              <BackButton />

              <VStack align={"start"}>
                <HStack gap={2} align={"center"}>
                  <Heading>{ticket.title}</Heading>

                  <Badge colorPalette={statusConfig.color} variant={"subtle"}>
                    {statusConfig.label}
                  </Badge>

                  {ticket.priority && (
                    <Badge variant={"outline"} colorPalette={"gray"}>
                      {`Prioritas: ${ticket.priority.toUpperCase()}`}
                    </Badge>
                  )}
                </HStack>

                <P fontSize={"sm"} color={"fg.subtle"}>
                  {`ID Laporan: #${ticket.id} • Dibuat pada ${formatUtcDateTime(
                    ticket.createdAt,
                    preferredTimezone,
                  )}`}
                </P>
              </VStack>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            <HStack align={"center"} gap={2} p={PADDING.md}>
              {isInternalAdmin && ticket.status !== "rejected" && (
                <HelpCenterModalResolveRejectTrigger
                  ticketId={ticket.id}
                  actionType={"reject"}
                >
                  <Button colorPalette={"red"} variant={"outline"} flex={1}>
                    <AppIcon icon={XCircleIcon} />
                    {"Tolak Laporan"}
                  </Button>
                </HelpCenterModalResolveRejectTrigger>
              )}

              {isInternalAdmin && ticket.status !== "resolved" && (
                <HelpCenterModalResolveRejectTrigger
                  ticketId={ticket.id}
                  actionType={"resolve"}
                >
                  <Button colorPalette={"green"} variant={"outline"} flex={1}>
                    <AppIcon icon={CheckCircle2Icon} />
                    {"Selesaikan Laporan"}
                  </Button>
                </HelpCenterModalResolveRejectTrigger>
              )}

              <HelpCenterModalReplyTrigger ticketId={ticket.id}>
                <Button primary={true} flex={1}>
                  <AppIcon icon={MessageSquarePlusIcon} />
                  {"Balas Laporan"}
                </Button>
              </HelpCenterModalReplyTrigger>
            </HStack>
          </VStack>
        </Container.Body>
      </Container.Root>

      {/* Original issue content - from Mitra */}
      <Container.Root withContext={true}>
        <Container.Body>
          <VStack>
            <HStack justify={"space-between"} align={"center"} p={PADDING.md}>
              <HStack gap={SPACING.md} align={"center"}>
                <Circle
                  aspectRatio={1}
                  w={"40px"}
                  bg={"bg.muted"}
                  color={"fg.muted"}
                >
                  <AppIcon icon={UserIcon} />
                </Circle>

                <VStack align={"start"}>
                  <P fontWeight={"semibold"}>{reporterName}</P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {[reporterEmail, reporterEmail].filter(Boolean).join(" • ")}
                  </P>
                </VStack>
              </HStack>

              <P fontSize={"sm"} color={"fg.subtle"}>
                {formatUtcDateTime(ticket.createdAt, preferredTimezone)}
              </P>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            <VStack align={"start"} gap={SPACING.md} p={PADDING.md}>
              <P whiteSpace={"pre-wrap"} lineHeight={"tall"}>
                {ticket.description}
              </P>

              {/* Attachments Section */}
              {attachments.length > 0 && (
                <VStack align={"start"} gap={2} w={"full"} pt={2}>
                  <HStack wrap={"wrap"} gap={2} w={"full"}>
                    {attachments.map((att, idx) => (
                      <HelpCenterAttachmentItem
                        key={att.id || String(idx)}
                        attachment={att}
                        index={idx}
                      />
                    ))}
                  </HStack>
                </VStack>
              )}
            </VStack>
          </VStack>
        </Container.Body>
      </Container.Root>

      {/* Replies */}
      <Container.Root withContext={true}>
        <Container.Body>
          <VStack>
            <HStack p={PADDING.md} justify={"space-between"} align={"center"}>
              <P fontSize={"md"} fontWeight={"semibold"}>
                {`Riwayat Tanggapan & Balasan (${replies.length})`}
              </P>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {replies.length === 0 ? (
              <Box p={PADDING.xl} textAlign={"center"}>
                <P color={"fg.subtle"}>
                  {
                    "Belum ada balasan untuk laporan ini. Klik tombol 'Balas Laporan' di atas untuk memberikan tanggapan."
                  }
                </P>
              </Box>
            ) : (
              <VStack gap={SPACING.xs} w={"full"} bg={"bg.canvas"}>
                {replies.map((reply, idx) => {
                  const replyUserName =
                    reply.admin?.name ?? reply.user?.name ?? "Admin Internal";
                  const replyUserRole =
                    reply.admin?.role ?? reply.user?.role ?? "internal";
                  const isInternal = replyUserRole === "internal";
                  const replyAttachments = reply.attachments ?? [];
                  const isLast = idx === replies.length - 1;

                  return (
                    <Box
                      key={reply.id || String(idx)}
                      p={PADDING.md}
                      bg={"bg.body"}
                      roundedTop={0}
                      roundedBottom={isLast ? theme.radii.container : 0}
                      w={"full"}
                    >
                      <VStack gap={SPACING.sm}>
                        <HStack
                          justify={"space-between"}
                          align={"center"}
                          w={"full"}
                        >
                          <HStack gap={SPACING.sm} align={"center"}>
                            <Circle
                              p={1.5}
                              bg={isInternal ? `purple.subtle` : "bg.muted"}
                              color={isInternal ? `purple.fg` : "fg.muted"}
                            >
                              <AppIcon
                                icon={isInternal ? ShieldCheckIcon : UserIcon}
                                size={"sm"}
                              />
                            </Circle>

                            <P fontWeight={"medium"}>{replyUserName}</P>

                            <Badge
                              colorPalette={isInternal ? "purple" : "blue"}
                              variant={"subtle"}
                            >
                              {isInternal ? "Admin Internal" : "Mitra"}
                            </Badge>
                          </HStack>

                          <P fontSize={"sm"} color={"fg.subtle"}>
                            {formatUtcDateTime(
                              reply.createdAt,
                              preferredTimezone,
                            )}
                          </P>
                        </HStack>

                        <VStack pl={"36px"} align={"start"} gap={2} w={"full"}>
                          <P
                            color={"fg.muted"}
                            whiteSpace={"pre-wrap"}
                            lineHeight={"tall"}
                          >
                            {reply.message}
                          </P>

                          {replyAttachments.length > 0 && (
                            <HStack wrap={"wrap"} gap={2} pt={1}>
                              {replyAttachments.map((att, attIdx) => (
                                <HelpCenterAttachmentItem
                                  key={att.id || String(attIdx)}
                                  attachment={att}
                                  index={attIdx}
                                />
                              ))}
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
