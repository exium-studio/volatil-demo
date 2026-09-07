// src/features/mitra/help-center/pages/help-center.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box, Circle } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
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
  formatAdaptiveDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useLocale } from "@/shared/libs/i18n/locale-provider";
import { isEmptyArray } from "@/shared/utils/data/array";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
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
  const { locale } = useLocale();
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
      <AppContentContainer>
        <Skeleton w={"full"} p={"md"} />
      </AppContentContainer>
    );
  }

  if (!ticket) {
    return (
      <AppContentContainer h={"auto"}>
        <Container.Root withContext={true} flex={1}>
          <Container.Body p={"lg"} align={"center"}>
            <P fontSize={"lg"} fontWeight={"semibold"} mb={2}>
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
      </AppContentContainer>
    );
  }

  const reporterName = ticket.user?.name ?? "?";
  const reporterEmail = ticket.user?.email ?? "?";

  return (
    <AppContentContainer flex={1} overflowY={"auto"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Root withContext={true} flex={1} overflowY={"auto"}>
        <Container.Body overflowY={"auto"}>
          {/* Header Bar */}
          <HeaderContainer pl={"xs"}>
            <HStack
              justify={"space-between"}
              align={"center"}
              w={"full"}
              wrap={"wrap"}
              gap={"sm"}
            >
              <HStack flex={1} gap={3} align={"center"}>
                <BackButton />

                <HStack flex={1} wrap={"wrap"} align={"center"} gap={"sm"}>
                  <Heading>{ticket.title}</Heading>

                  <P fontSize={"sm"} color={"fg.subtle"}>
                    {[
                      `ID Laporan: #${ticket.id}`,
                      ticket.orderNumber || ticket.transactionId
                        ? `Transaksi: ${ticket.orderNumber ?? ticket.transactionId}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </P>

                  <Badge
                    colorPalette={statusConfig.color}
                    variant={"subtle"}
                    ml={"auto"}
                  >
                    {statusConfig.label}
                  </Badge>

                  {ticket.priority && (
                    <Badge variant={"outline"} colorPalette={"gray"}>
                      {`Prioritas: ${ticket.priority.toUpperCase()}`}
                    </Badge>
                  )}
                </HStack>
              </HStack>

              {ticket.status !== "resolved" && ticket.status !== "rejected" && (
                <HStack align={"center"} gap={2}>
                  {isInternalAdmin && (
                    <HelpCenterModalResolveRejectTrigger
                      ticketId={ticket.id}
                      actionType={"reject"}
                    >
                      <Button colorPalette={"red"} variant={"outline"}>
                        <AppIcon icon={XCircleIcon} />
                        {"Tolak Laporan"}
                      </Button>
                    </HelpCenterModalResolveRejectTrigger>
                  )}

                  {isInternalAdmin && (
                    <HelpCenterModalResolveRejectTrigger
                      ticketId={ticket.id}
                      actionType={"resolve"}
                    >
                      <Button colorPalette={"green"} variant={"outline"}>
                        <AppIcon icon={CheckCircleIcon} />
                        {"Selesaikan Laporan"}
                      </Button>
                    </HelpCenterModalResolveRejectTrigger>
                  )}

                  <HelpCenterModalReplyTrigger ticketId={ticket.id}>
                    <Button primary={true}>
                      <AppIcon icon={MessageSquarePlusIcon} />
                      {"Balas Laporan"}
                    </Button>
                  </HelpCenterModalReplyTrigger>
                </HStack>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Original issue content - from Reporter */}
          <VStack align={"stretch"} gap={0} w={"full"}>
            <HStack justify={"space-between"} align={"center"} p={"md"}>
              <HStack gap={"md"} align={"center"}>
                <Circle
                  aspectRatio={1}
                  p={1.5}
                  bg={"bg.muted"}
                  color={"fg.muted"}
                >
                  <AppIcon icon={UserIcon} size={"sm"} />
                </Circle>

                <VStack align={"start"}>
                  <P fontWeight={"semibold"}>{reporterName}</P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {[reporterEmail, reporterEmail].filter(Boolean).join(" • ")}
                  </P>
                </VStack>
              </HStack>

              <P fontSize={"sm"} color={"fg.subtle"}>
                {formatAdaptiveDateTime(ticket.createdAt, {
                  timeZone: preferredTimezone,
                  locale,
                })}
              </P>
            </HStack>

            <VStack align={"start"} gap={"md"} p={"md"} pl={"58px"} pt={0}>
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

          <Separator borderColor={"bg.canvas"} />

          {/* Replies */}
          <VStack align={"stretch"} gap={0} w={"full"}>
            <HStack p={"md"} justify={"space-between"} align={"center"}>
              <P fontSize={"md"} fontWeight={"semibold"}>
                {`Riwayat Tanggapan & Balasan (${replies.length})`}
              </P>
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {isEmptyArray(replies) ? (
              <Box p={"xl"} textAlign={"center"}>
                <P color={"fg.subtle"}>
                  {
                    "Belum ada balasan untuk laporan ini. Klik tombol 'Balas Laporan' di atas untuk memberikan tanggapan."
                  }
                </P>
              </Box>
            ) : (
              <VStack gap={"xs"} w={"full"} bg={"bg.canvas"}>
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
                      p={"md"}
                      bg={"bg.body"}
                      roundedTop={0}
                      roundedBottom={isLast ? theme.radii.container : 0}
                      w={"full"}
                    >
                      <VStack gap={"sm"}>
                        <HStack
                          justify={"space-between"}
                          align={"center"}
                          w={"full"}
                        >
                          <HStack gap={"sm"} align={"center"}>
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
                            {formatAdaptiveDateTime(reply.createdAt, {
                              timeZone: preferredTimezone,
                              locale,
                            })}
                          </P>
                        </HStack>

                        <VStack pl={"40px"} align={"start"} gap={2} w={"full"}>
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
    </AppContentContainer>
  );
};
