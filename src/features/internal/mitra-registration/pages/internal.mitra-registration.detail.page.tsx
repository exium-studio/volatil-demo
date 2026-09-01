// src/features/internal/mitra-registration/pages/internal.mitra-registration.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { FileIcon } from "@/design-system/components/data-display/ui/file-item";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalMitraRegistrationApproveTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal";
import { InternalMitraRegistrationRejectTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.reject-modal";
import { useInternalMitraRegistrationDetailQuery } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  MitraRegistrationDocumentItem,
  MitraRegistrationStatus,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Building2Icon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  SquareArrowUpRightIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

const STATUS_CONFIG: Record<
  MitraRegistrationStatus,
  { label: string; colorPalette: string; icon: typeof CheckCircle2Icon }
> = {
  pending_verification: {
    label: "Menunggu Verifikasi",
    colorPalette: "orange",
    icon: ClockIcon,
  },
  approved: {
    label: "Disetujui",
    colorPalette: "green",
    icon: CheckCircle2Icon,
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: XCircleIcon,
  },
};

export function InternalMitraRegistrationDetailPage() {
  // Hooks
  const { registrationId } = useParams({ strict: false }) as {
    registrationId: string;
  };
  const navigate = useNavigate();

  // Queries
  const { data: registration, isLoading } =
    useInternalMitraRegistrationDetailQuery(registrationId);

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const documents: MitraRegistrationDocumentItem[] = useMemo(() => {
    if (!registration) return [];
    const docs = registration.documents;
    return [
      {
        title: "1. Surat Permohonan Kemitraan",
        url: docs?.suratPermohonan?.url ?? registration.suratPermohonan,
        desc:
          docs?.suratPermohonan?.originalName ??
          "Surat resmi pengajuan kerjasama kemitraan",
        mimeType: docs?.suratPermohonan?.mimeType ?? "application/pdf",
        fileName: docs?.suratPermohonan?.fileName,
        size: docs?.suratPermohonan?.size,
      },
      {
        title: "2. Dokumen DIK",
        url: docs?.dokumenDik?.url ?? registration.dokumenDik,
        desc:
          docs?.dokumenDik?.originalName ?? "Dokumen Informasi Kebutuhan Data",
        mimeType: docs?.dokumenDik?.mimeType ?? "application/pdf",
        fileName: docs?.dokumenDik?.fileName,
        size: docs?.dokumenDik?.size,
      },
      {
        title: "3. Surat Pernyataan Hukum",
        url:
          docs?.suratPernyataanHukum?.url ?? registration.suratPernyataanHukum,
        desc:
          docs?.suratPernyataanHukum?.originalName ??
          "Surat pernyataan tunduk pada ketentuan hukum",
        mimeType: docs?.suratPernyataanHukum?.mimeType ?? "application/pdf",
        fileName: docs?.suratPernyataanHukum?.fileName,
        size: docs?.suratPernyataanHukum?.size,
      },
      {
        title: "4. Surat Komitmen Evaluasi (Lampiran III)",
        url:
          docs?.suratKomitmenEvaluasi?.url ??
          registration.suratKomitmenEvaluasi,
        desc:
          docs?.suratKomitmenEvaluasi?.originalName ??
          "Komitmen evaluasi berkala pemanfaatan IGT",
        mimeType: docs?.suratKomitmenEvaluasi?.mimeType ?? "application/pdf",
        fileName: docs?.suratKomitmenEvaluasi?.fileName,
        size: docs?.suratKomitmenEvaluasi?.size,
      },
      {
        title: "5. Surat Komitmen Perbaikan (Lampiran IV)",
        url:
          docs?.suratKomitmenPerbaikan?.url ??
          registration.suratKomitmenPerbaikan,
        desc:
          docs?.suratKomitmenPerbaikan?.originalName ??
          "Komitmen perbaikan mutu & kepatuhan data",
        mimeType: docs?.suratKomitmenPerbaikan?.mimeType ?? "application/pdf",
        fileName: docs?.suratKomitmenPerbaikan?.fileName,
        size: docs?.suratKomitmenPerbaikan?.size,
      },
      {
        title: "6. Proposal Teknis Pemanfaatan IGT",
        url: docs?.proposalTeknis?.url ?? registration.proposalTeknis,
        desc:
          docs?.proposalTeknis?.originalName ??
          "Proposal teknis rencana pemanfaatan spasial",
        mimeType: docs?.proposalTeknis?.mimeType ?? "application/pdf",
        fileName: docs?.proposalTeknis?.fileName,
        size: docs?.proposalTeknis?.size,
      },
    ];
  }, [registration]);

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <Skeleton h={"200px"} w={"full"} />
        <Skeleton h={"400px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  if (!registration) {
    return (
      <PanelContentContainer h={"auto"}>
        <Center flex={1} p={"xl"}>
          <P color={"fg.muted"}>{"Data permohonan mitra tidak ditemukan."}</P>
        </Center>
      </PanelContentContainer>
    );
  }

  const statusConfig =
    STATUS_CONFIG[registration.status] || STATUS_CONFIG.pending_verification;

  return (
    <PanelContentContainer flex={1} position={"relative"}>
      <Container.Root withContext flex={1}>
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
              <HStack gap={3} align={"center"}>
                <BackButton
                  onClick={() => {
                    void navigate({ to: "/internal/mitra-registration" });
                  }}
                />

                <VStack align={"start"} gap={"2xs"}>
                  <Heading size={"md"}>
                    {registration.organizationName ?? registration.namaInstansi}
                  </Heading>

                  <HStack gap={2} align={"center"}>
                    <P fontSize={"xs"} color={"fg.muted"} mb={"3px"}>
                      {"No. Registrasi:"}
                    </P>

                    <Badge size={"xs"} variant={"surface"}>
                      {registration.registrationNumber}
                    </Badge>
                  </HStack>
                </VStack>
              </HStack>

              {/* Action Buttons for Pending Registrations */}
              {registration.status === "pending_verification" && (
                <HStack gap={2}>
                  <InternalMitraRegistrationRejectTrigger
                    registration={registration}
                    onSuccessRedirect={() => {
                      void navigate({ to: "/internal/mitra-registration" });
                    }}
                  >
                    <Button variant={"outline"} colorPalette={"red"}>
                      <AppIcon icon={XCircleIcon} />
                      {"Tolak"}
                    </Button>
                  </InternalMitraRegistrationRejectTrigger>

                  <InternalMitraRegistrationApproveTrigger
                    registration={registration}
                    onSuccessRedirect={() => {
                      void navigate({ to: "/internal/mitra-registration" });
                    }}
                  >
                    <Button primary={true} colorPalette={"green"}>
                      <AppIcon icon={CheckCircle2Icon} />
                      {"Setujui & Unggah Kontrak"}
                    </Button>
                  </InternalMitraRegistrationApproveTrigger>
                </HStack>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Status & Metadata Bar */}
          <HStack gap={"md"} wrap={"wrap"} align={"center"} px={"md"} py={"sm"}>
            <Badge
              size={"sm"}
              colorPalette={statusConfig.colorPalette}
              variant={"subtle"}
            >
              {statusConfig.label}
            </Badge>

            <P fontSize={"xs"} color={"fg.muted"}>
              {`Diajukan: ${formatUtcDateTime(registration.createdAt, preferredTimezone)}`}
            </P>

            {registration.verifiedAt && (
              <P fontSize={"xs"} color={"fg.muted"}>
                {`Diverifikasi: ${formatUtcDateTime(registration.verifiedAt, preferredTimezone)}`}
              </P>
            )}
          </HStack>

          <Separator borderColor={"bg.canvas"} />

          {/* If Rejected Alert */}
          {registration.status === "rejected" &&
            registration.rejectionReason && (
              <Box p={"md"}>
                <Alert.Root status={"error"} size={"sm"}>
                  <Alert.Indicator />

                  <Alert.Content>
                    <Alert.Title>{"Alasan Penolakan Permohonan:"}</Alert.Title>
                    <Alert.Description>
                      {registration.rejectionReason}
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              </Box>
            )}

          {/* If Approved & Has Contract */}
          {registration.status === "approved" &&
            registration.contractDocument && (
              <Box p={"md"} pb={0}>
                <Alert.Root status={"success"} size={"sm"}>
                  <Alert.Indicator />

                  <Alert.Content>
                    <Alert.Title>
                      {"Berkas Kontrak Kemitraan Resmi Telah Terbit"}
                    </Alert.Title>

                    <Alert.Description>
                      <HStack
                        justify={"space-between"}
                        align={"center"}
                        w={"full"}
                        mt={2}
                        wrap={"wrap"}
                        gap={2}
                      >
                        <P fontSize={"xs"}>
                          {
                            "Salinan kontrak kerjasama telah diunggah dan dikirimkan ke mitra."
                          }
                        </P>
                        <ExternalLink
                          href={registration.contractDocument}
                          download={true}
                        >
                          <Button
                            size={"xs"}
                            variant={"outline"}
                            colorPalette={"green"}
                          >
                            <AppIcon icon={DownloadIcon} />
                            {"Unduh Kontrak"}
                          </Button>
                        </ExternalLink>
                      </HStack>
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              </Box>
            )}

          {/* Main Info Sections */}
          <VStack p={"md"} gap={"lg"} align={"stretch"}>
            {/* Section 1: Data Perusahaan */}
            <VStack align={"stretch"} gap={"md"}>
              <HStack align={"center"} gap={2}>
                <AppIcon icon={Building2Icon} color={"fg.muted"} />
                <Heading>{"Informasi Instansi / Perusahaan"}</Heading>
              </HStack>

              <SimpleGrid columns={[1, null, 2]} gap={"md"}>
                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nama Instansi / Perusahaan"}
                  </P>
                  <P fontWeight={"medium"}>
                    {registration.organizationName ??
                      registration.namaInstansi ??
                      "-"}
                  </P>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor Induk Berusaha (NIB)"}
                  </P>
                  <P fontWeight={"medium"}>{registration.nib || "-"}</P>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor Pokok Wajib Pajak (NPWP)"}
                  </P>
                  <P fontWeight={"medium"}>{registration.npwp || "-"}</P>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Situs Web"}
                  </P>
                  {registration.website ? (
                    <ExternalLink
                      href={
                        registration.website.startsWith("http")
                          ? registration.website
                          : `https://${registration.website}`
                      }
                    >
                      <HStack gap={1} align={"center"}>
                        <P fontWeight={"medium"}>{registration.website}</P>
                        <AppIcon
                          icon={ExternalLinkIcon}
                          size={"xs"}
                          color={"fg.muted"}
                        />
                      </HStack>
                    </ExternalLink>
                  ) : (
                    <P color={"fg.muted"}>{"-"}</P>
                  )}
                </VStack>

                <VStack
                  align={"start"}
                  gap={"2xs"}
                  gridColumn={[null, null, "span 2"]}
                >
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Alamat Kantor Operasional"}
                  </P>
                  <P fontWeight={"medium"}>
                    {registration.officeAddress ??
                      registration.alamatKantor ??
                      "-"}
                  </P>
                </VStack>
              </SimpleGrid>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            {/* Section 2: Penanggung Jawab */}
            <VStack align={"stretch"} gap={"md"}>
              <HStack align={"center"} gap={2}>
                <AppIcon icon={UserCheckIcon} color={"fg.muted"} />
                <Heading>{"Penanggung Jawab & Kontak"}</Heading>
              </HStack>

              <SimpleGrid columns={[1, null, 2]} gap={"md"}>
                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nama Penanggung Jawab"}
                  </P>
                  <P fontWeight={"medium"}>
                    {registration.picName ??
                      registration.namaPenanggungJawab ??
                      "-"}
                  </P>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Jabatan"}
                  </P>
                  <P fontWeight={"medium"}>
                    {registration.position ?? registration.jabatan ?? "-"}
                  </P>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Email Resmi (SSO)"}
                  </P>

                  <HStack align={"center"} gap={1.5}>
                    <AppIcon icon={MailIcon} size={"xs"} color={"fg.muted"} />
                    <P fontWeight={"medium"}>{registration.email || "-"}</P>
                  </HStack>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor HP / WhatsApp"}
                  </P>
                  <HStack gap={1.5}>
                    <AppIcon icon={PhoneIcon} size={"xs"} color={"fg.muted"} />
                    <P fontWeight={"medium"}>
                      {registration.phoneNumber ?? registration.nomorHp ?? "-"}
                    </P>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </VStack>

            <Separator borderColor={"bg.canvas"} />

            {/* Section 3: 6 Berkas Dokumen Persyaratan */}
            <VStack align={"stretch"} gap={"md"}>
              <HStack align={"center"} gap={2}>
                <AppIcon icon={FileTextIcon} color={"fg.muted"} />
                <Heading>{"Berkas Dokumen Persyaratan"}</Heading>
              </HStack>

              <VStack gap={0} w={"full"} align={"stretch"}>
                {documents.map((doc, idx) => (
                  <HStack
                    key={doc.title}
                    w={"full"}
                    py={3}
                    justify={"space-between"}
                    align={"center"}
                    gap={"md"}
                    borderBottom={
                      idx < documents.length - 1 ? "1px solid" : "none"
                    }
                    borderColor={"border.subtle"}
                  >
                    <HStack gap={3} flex={1} minW={0} align={"center"}>
                      <FileIcon
                        mimeType={doc.mimeType ?? "application/pdf"}
                        size={"lg"}
                        color={"fg.muted"}
                        flexShrink={0}
                      />

                      <VStack align={"start"} gap={"2xs"} flex={1} minW={0}>
                        <ClampedP
                          fontWeight={"medium"}
                          fontSize={"sm"}
                          title={doc.title}
                        >
                          {doc.title}
                        </ClampedP>

                        <ClampedP
                          fontSize={"xs"}
                          color={"fg.muted"}
                          title={doc.desc}
                        >
                          {doc.desc}
                        </ClampedP>
                      </VStack>
                    </HStack>

                    {doc.url ? (
                      <ExternalLink href={doc.url} download={true}>
                        <Button size={"xs"} variant={"outline"}>
                          <AppIcon icon={SquareArrowUpRightIcon} />
                          {"Tinjau Dokumen"}
                        </Button>
                      </ExternalLink>
                    ) : (
                      <Badge
                        colorPalette={"gray"}
                        variant={"subtle"}
                        size={"xs"}
                      >
                        {"Belum Diunggah"}
                      </Badge>
                    )}
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </VStack>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
}
