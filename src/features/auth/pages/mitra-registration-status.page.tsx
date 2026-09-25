// src\features\auth\pages\mitra-registration-status.page.tsx

// src\features\auth\pages\mitra-registration-status.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { Box } from "@/design-system/components/layout/ui/box";
import { ConstrainedContainer } from "@/design-system/components/layout/ui/constrained-container";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, PLink } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useRegistrationStatusQuery } from "@/features/auth/hooks/use-mitra-registration.mutation";
import type {
  MitraRegistrationDocumentsMap,
  MitraRegistrationStatus,
} from "@/features/auth/types/mitra-registration.type";
import { MitraRegistrationStatusBadge } from "@/features/shared/components/mitra-registration-status.badge";
import { formatByte } from "@/shared/utils/formatter/byte.formatter";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { Link } from "@tanstack/react-router";
import {
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  DownloadIcon,
  ExternalLinkIcon,
  FileCheckIcon,
  FileTextIcon,
  GlobeIcon,
  LogInIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserCheckIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

// Constants
const STATUS_DESCRIPTIONS: Record<MitraRegistrationStatus, string> = {
  pending_verification:
    "Pengajuan pendaftaran kemitraan Anda sedang ditinjau dan diverifikasi oleh Tim Teknis Kementerian ATR/BPN.",
  verified:
    "Pendaftaran telah diverifikasi & disetujui! Akun SSO telah aktif dan Berkas Perjanjian Kerjasama (PKS) resmi siap diunduh.",
  approved:
    "Pendaftaran telah disetujui! Akun SSO telah aktif dan Berkas Perjanjian Kerjasama (PKS) resmi siap diunduh.",
  rejected:
    "Pengajuan pendaftaran kemitraan tidak dapat disetujui. Silakan periksa catatan alasan penolakan di bawah.",
};

const DOCUMENT_ITEMS: {
  key: keyof MitraRegistrationDocumentsMap;
  label: string;
}[] = [
  { key: "suratPermohonan", label: "Surat Permohonan Kemitraan" },
  { key: "dokumenDik", label: "Dokumen Informasi Kebutuhan (DIK)" },
  { key: "suratPernyataanHukum", label: "Surat Pernyataan Kepatuhan Hukum" },
  { key: "suratKomitmenEvaluasi", label: "Surat Komitmen Evaluasi Berkala" },
  { key: "suratKomitmenPerbaikan", label: "Surat Komitmen Perbaikan Sistem" },
  { key: "proposalTeknis", label: "Proposal Teknis Pemanfaatan Data" },
];

export const MitraRegistrationStatusPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // States
  const [searchInput, setSearchInput] = useState<string>("");
  const [queryRegNumber, setQueryRegNumber] = useState<string>("");

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Queries
  const {
    data: statusData,
    isLoading,
    isError,
    error,
  } = useRegistrationStatusQuery(queryRegNumber, Boolean(queryRegNumber));

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQueryRegNumber(searchInput.trim().toUpperCase());
  };

  // Derived Contract Document Info
  const isApproved =
    statusData?.status === "verified" || statusData?.status === "approved";

  const contractDoc = statusData?.contractDocument;
  const contractUrl =
    typeof contractDoc === "string" ? contractDoc : (contractDoc?.url ?? null);

  const contractFileName =
    typeof contractDoc === "object" && contractDoc
      ? (contractDoc.originalName ??
        contractDoc.fileName ??
        "Dokumen_Kontrak_Kemitraan.pdf")
      : "Dokumen_Kontrak_Kemitraan.pdf";

  const contractFileSize =
    typeof contractDoc === "object" && contractDoc?.size
      ? formatByte(contractDoc.size, { decimals: 1 })
      : null;

  return (
    <PageContainer p={[2, null, 6]} overflowY={"auto"}>
      <ConstrainedContainer py={4}>
        {/* Header */}
        <HStack align={"center"} justify={"space-between"} mb={8} w={"full"}>
          <BackButton />

          <Heading size={"2xl"} textAlign={"center"} flex={1} pr={"40px"}>
            {"Cek Status Kemitraan"}
          </Heading>

          <Box w={"buttonH"} minW={"buttonH"} aria-hidden={true} />
        </HStack>

        <Container.Root
          borderColor={"border.subtle"}
          rounded={theme.radii.container}
        >
          <HeaderContainer p={6}>
            <VStack align={"center"} textAlign={"center"} w={"full"} gap={1}>
              <P fontWeight={"semibold"} fontSize={"md"}>
                {"Pelacakan Pengajuan Kemitraan Publik"}
              </P>

              <P fontSize={"sm"} color={"fg.muted"} maxW={"560px"}>
                {
                  "Masukkan nomor registrasi pendaftaran yang Anda dapatkan saat pendaftaran (format: REG-2026-XXXXX)."
                }
              </P>
            </VStack>
          </HeaderContainer>

          <Separator borderColor={"border.subtle"} />

          <Container.Body p={[4, null, 6]}>
            {/* Search Box */}
            <VStack
              as={"form"}
              onSubmit={handleSearch}
              align={"stretch"}
              gap={4}
              mb={6}
              w={"full"}
            >
              <Field variant={"default"}>
                <HStack gap={2} w={"full"}>
                  <Input
                    placeholder={"Contoh: REG-2026-00003"}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    w={"full"}
                  />

                  <Button
                    primary={true}
                    type={"submit"}
                    loading={isLoading}
                    disabled={!searchInput.trim()}
                  >
                    <AppIcon icon={SearchIcon} />
                    {"Lacak"}
                  </Button>
                </HStack>
              </Field>
            </VStack>

            {/* Loading State */}
            {isLoading && (
              <VStack gap={4} py={4}>
                <Skeleton h={"80px"} w={"full"} />
                <Skeleton h={"140px"} w={"full"} />
                <Skeleton h={"200px"} w={"full"} />
              </VStack>
            )}

            {/* Error State */}
            {isError && (
              <Alert.Root status={"error"} size={"sm"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    {"Nomor Registrasi Tidak Ditemukan"}
                  </Alert.Title>
                  <Alert.Description>
                    {error?.message ||
                      "Mohon pastikan nomor registrasi yang Anda masukkan sudah benar."}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            {/* Results Section */}
            {statusData && (
              <VStack align={"stretch"} gap={"xl"} mt={2}>
                {/* <Separator borderColor={"border.subtle"} /> */}

                {/* 1. Status Overview Header */}
                <VStack align={"stretch"} gap={3}>
                  <HStack
                    justify={"space-between"}
                    align={"start"}
                    wrap={"wrap"}
                    gap={2}
                  >
                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"NOMOR REGISTRASI PENDAFTARAN"}
                      </P>

                      <HStack align={"center"} gap={2}>
                        <Heading size={"xl"} letterSpacing={"wider"}>
                          {statusData.registrationNumber}
                        </Heading>
                        <ClipboardButton
                          value={statusData.registrationNumber}
                          size={"xs"}
                        />
                      </HStack>
                    </VStack>

                    <MitraRegistrationStatusBadge size={"md"} showIcon={true}>
                      {statusData.status}
                    </MitraRegistrationStatusBadge>
                  </HStack>

                  <P fontSize={"sm"} color={"fg.muted"}>
                    {statusData.statusDescription ||
                      STATUS_DESCRIPTIONS[statusData.status] ||
                      "-"}
                  </P>

                  {/* Timestamps Bar */}
                  <HStack
                    gap={4}
                    wrap={"wrap"}
                    color={"fg.subtle"}
                    fontSize={"xs"}
                  >
                    {statusData.createdAt && (
                      <HStack gap={1} align={"center"}>
                        <AppIcon icon={CalendarIcon} size={"xs"} />
                        <P>
                          {`Diajukan: ${formatUtcDateTime(statusData.createdAt, preferredTimezone)}`}
                        </P>
                      </HStack>
                    )}

                    {statusData.verifiedAt && (
                      <HStack gap={1} align={"center"}>
                        <AppIcon icon={CheckCircle2Icon} size={"xs"} />
                        <P>
                          {`Diverifikasi: ${formatUtcDateTime(statusData.verifiedAt, preferredTimezone)}`}
                        </P>
                      </HStack>
                    )}
                  </HStack>
                </VStack>

                {/* 2. Contract Action (If Approved/Verified) */}
                {isApproved && contractUrl && (
                  <Box
                    p={4}
                    rounded={theme.radii.container}
                    bg={"bg.subtle"}
                    // borderWidth={"1px"}
                    borderColor={"border.subtle"}
                  >
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      wrap={"wrap"}
                      gap={4}
                    >
                      <HStack gap={3} align={"center"}>
                        <AppIcon icon={FileCheckIcon} size={"md"} />

                        <VStack align={"start"} gap={0}>
                          <HStack gap={2} align={"center"}>
                            <P fontWeight={"semibold"} fontSize={"sm"}>
                              {"Dokumen Perjanjian Kerjasama (PKS) Resmi"}
                            </P>
                            <Badge size={"xs"}>{"PDF"}</Badge>
                          </HStack>

                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {contractFileName}
                            {contractFileSize ? ` • ${contractFileSize}` : ""}
                          </P>
                        </VStack>
                      </HStack>

                      <HStack gap={2}>
                        <ExternalLink href={contractUrl} download={true}>
                          <Button primary={true} size={"sm"}>
                            <AppIcon icon={DownloadIcon} />
                            {"Unduh Kontrak"}
                          </Button>
                        </ExternalLink>

                        <Link to={"/"}>
                          <Button variant={"outline"} size={"sm"}>
                            <AppIcon icon={LogInIcon} />
                            {"Masuk ke Portal SSO"}
                          </Button>
                        </Link>
                      </HStack>
                    </HStack>
                  </Box>
                )}

                {/* 3. Rejection Reason Banner (If Rejected) */}
                {statusData.status === "rejected" && (
                  <Alert.Root status={"error"} size={"sm"}>
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>{"Catatan / Alasan Penolakan"}</Alert.Title>
                      <Alert.Description>
                        {statusData.rejectionReason ||
                          statusData.statusDescription ||
                          "Persyaratan berkas belum memenuhi kriteria yang ditetapkan."}
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                )}

                {/* <Separator borderColor={"border.subtle"} /> */}

                {/* 4. Detail Data Pengajuan (Instansi & Penanggung Jawab) */}
                <SimpleGrid columns={[1, null, 2]} gap={6}>
                  {/* Instansi Info */}
                  <VStack align={"stretch"} gap={3}>
                    <HStack gap={2} color={"fg.muted"}>
                      <AppIcon icon={Building2Icon} />
                      <Heading size={"sm"}>{"Informasi Instansi"}</Heading>
                    </HStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nama Instansi / Perusahaan"}
                      </P>
                      <P fontWeight={"medium"}>
                        {statusData.organizationName ??
                          statusData.namaInstansi ??
                          "-"}
                      </P>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"NIB"}
                      </P>
                      <P fontWeight={"medium"}>{statusData.nib || "-"}</P>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"NPWP"}
                      </P>
                      <P fontWeight={"medium"}>{statusData.npwp || "-"}</P>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Alamat Kantor"}
                      </P>
                      <P fontSize={"sm"} color={"fg.muted"}>
                        {statusData.officeAddress ??
                          statusData.alamatKantor ??
                          "-"}
                      </P>
                    </VStack>

                    {statusData.website && (
                      <VStack align={"start"} gap={1}>
                        <P fontSize={"xs"} color={"fg.subtle"}>
                          {"Situs Web"}
                        </P>
                        <ExternalLink href={statusData.website}>
                          <HStack gap={1} align={"center"}>
                            <AppIcon icon={GlobeIcon} size={"xs"} />
                            <P fontSize={"sm"}>{statusData.website}</P>
                          </HStack>
                        </ExternalLink>
                      </VStack>
                    )}
                  </VStack>

                  {/* Penanggung Jawab (PIC) Info */}
                  <VStack align={"stretch"} gap={3}>
                    <HStack gap={2} color={"fg.muted"}>
                      <AppIcon icon={UserCheckIcon} />
                      <Heading size={"sm"}>{"Penanggung Jawab (PIC)"}</Heading>
                    </HStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nama Penanggung Jawab"}
                      </P>
                      <P fontWeight={"medium"}>
                        {statusData.picName ??
                          statusData.namaPenanggungJawab ??
                          "-"}
                      </P>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Jabatan"}
                      </P>
                      <P fontWeight={"medium"}>
                        {statusData.position ?? statusData.jabatan ?? "-"}
                      </P>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Email Resmi SSO"}
                      </P>
                      <HStack gap={1} align={"center"}>
                        <AppIcon icon={MailIcon} size={"xs"} />
                        <P fontSize={"sm"}>{statusData.email || "-"}</P>
                      </HStack>
                    </VStack>

                    <VStack align={"start"} gap={1}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nomor Telepon / Kontak"}
                      </P>
                      <HStack gap={1} align={"center"}>
                        <AppIcon icon={PhoneIcon} size={"xs"} />
                        <P fontSize={"sm"}>
                          {statusData.phoneNumber ?? statusData.nomorHp ?? "-"}
                        </P>
                      </HStack>
                    </VStack>
                  </VStack>
                </SimpleGrid>

                {/* 5. Uploaded Documents Checklist */}
                {statusData.documents && (
                  <>
                    {/* <Separator borderColor={"border.subtle"} /> */}

                    <VStack align={"stretch"} gap={3}>
                      <HStack gap={2} color={"fg.muted"}>
                        <AppIcon icon={FileTextIcon} />
                        <Heading size={"sm"}>
                          {"Berkas Persyaratan yang Diunggah"}
                        </Heading>
                      </HStack>

                      <SimpleGrid columns={[1, null, 2]} gap={3}>
                        {DOCUMENT_ITEMS.map((docItem) => {
                          const docFile = statusData.documents?.[docItem.key];
                          const hasDoc = Boolean(docFile?.url);

                          return (
                            <Box
                              key={docItem.key}
                              p={3}
                              rounded={"md"}
                              borderWidth={"1px"}
                              borderColor={"border.subtle"}
                            >
                              <HStack
                                justify={"space-between"}
                                align={"center"}
                                gap={2}
                              >
                                <VStack align={"start"} gap={0} flex={1}>
                                  <P fontSize={"xs"} fontWeight={"medium"}>
                                    {docItem.label}
                                  </P>
                                  {docFile?.size ? (
                                    <P fontSize={"xs"} color={"fg.subtle"}>
                                      {formatByte(docFile.size, {
                                        decimals: 1,
                                      })}
                                    </P>
                                  ) : null}
                                </VStack>

                                {hasDoc && docFile?.url ? (
                                  <ExternalLink
                                    href={docFile.url}
                                    download={true}
                                  >
                                    <Button size={"2xs"} variant={"outline"}>
                                      <AppIcon icon={ExternalLinkIcon} />
                                      {"Lihat"}
                                    </Button>
                                  </ExternalLink>
                                ) : (
                                  <Badge size={"xs"} colorPalette={"gray"}>
                                    {"-"}
                                  </Badge>
                                )}
                              </HStack>
                            </Box>
                          );
                        })}
                      </SimpleGrid>
                    </VStack>
                  </>
                )}
              </VStack>
            )}
          </Container.Body>
        </Container.Root>

        {/* Footer Links */}
        <VStack align={"center"} mt={6} gap={2}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {"Belum mengajukan kemitraan? "}
            <Link to={"/register"}>
              <PLink fontWeight={"semibold"}>{"Daftar Kemitraan Baru"}</PLink>
            </Link>
          </P>

          <P fontSize={"sm"} color={"fg.muted"}>
            {"Sudah memiliki akun aktif? "}
            <Link to={"/"}>
              <PLink fontWeight={"semibold"}>{"Halaman Masuk"}</PLink>
            </Link>
          </P>
        </VStack>
      </ConstrainedContainer>
    </PageContainer>
  );
};
