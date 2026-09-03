// src/features/auth/pages/mitra-register.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { ConstrainedContainer } from "@/design-system/components/layout/ui/constrained-container";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, PLink } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useMitraRegistrationMutation } from "@/features/auth/hooks/use-mitra-registration.mutation";
import { createMitraRegistrationSchema } from "@/features/auth/schemas/mitra-registration.schema";
import type {
  MitraRegistrationCreatedData,
  MitraRegistrationFormValues,
} from "@/features/auth/types/mitra-registration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import {
  Building2Icon,
  CheckCircle2Icon,
  FileCheckIcon,
  FileTextIcon,
  SendIcon,
  ShieldCheckIcon,
  UserCheckIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const MitraRegisterPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // States
  const [successData, setSuccessData] =
    useState<MitraRegistrationCreatedData | null>(null);

  // Mutations
  const registerMutation = useMitraRegistrationMutation();

  // Schemas
  const formSchema = useMemo(() => createMitraRegistrationSchema(), []);

  // Forms
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MitraRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaInstansi: "",
      nib: "",
      npwp: "",
      alamatKantor: "",
      website: "",
      namaPenanggungJawab: "",
      jabatan: "",
      email: "",
      nomorHp: "",
      password: "",
      suratPermohonan: [],
      dokumenDik: [],
      suratPernyataanHukum: [],
      suratKomitmenEvaluasi: [],
      suratKomitmenPerbaikan: [],
      proposalTeknis: [],
    },
  });

  // Handlers
  const onSubmit = (values: MitraRegistrationFormValues) => {
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        setSuccessData(data);
      },
    });
  };

  return (
    <PageContainer p={[2, null, 6]} overflowY={"auto"}>
      <ConstrainedContainer py={4}>
        {/* Header Bar */}
        <HStack
          align={"center"}
          justify={"space-between"}
          gap={"sm"}
          mb={8}
          w={"full"}
        >
          <BackButton />

          <Heading size={"2xl"} textAlign={"center"} flex={1} pr={"40px"}>
            {"Pendaftaran Akun Kemitraan"}
          </Heading>

          <Box w={"buttonH"} minW={"buttonH"} aria-hidden={true} />
        </HStack>

        {successData ? (
          /* Success Screen */
          <Container.Root rounded={theme.radii.container}>
            <VStack align={"center"} gap={"lg"} textAlign={"center"} py={8}>
              <Box color={"fg.muted"}>
                <AppIcon icon={CheckCircle2Icon} size={"xl"} />
              </Box>

              <VStack gap={"xs"}>
                <Heading size={"xl"}>{"Permohonan Berhasil Dikirim"}</Heading>
                <P color={"fg.muted"} maxW={"600px"}>
                  {
                    "Terima kasih telah mengajukan permohonan kemitraan dengan Kementerian ATR/BPN. Berkas Anda akan diverifikasi oleh tim internal kami."
                  }
                </P>
              </VStack>

              <Box
                p={4}
                bg={"bg.subtle"}
                rounded={"md"}
                borderWidth={"1px"}
                borderColor={"border.subtle"}
                w={"full"}
                maxW={"480px"}
              >
                <VStack gap={1}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"NOMOR REGISTRASI PERMOHONAN"}
                  </P>
                  <P
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                    letterSpacing={"wider"}
                  >
                    {successData.registrationNumber}
                  </P>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {
                      "Simpan nomor ini untuk melakukan pengecekan status verifikasi & kontrak."
                    }
                  </P>
                </VStack>
              </Box>

              <HStack gap={3} mt={4}>
                <Link to={"/registration-status"}>
                  <Button primary={true}>
                    <AppIcon icon={FileCheckIcon} />
                    {"Pantau Status Registrasi"}
                  </Button>
                </Link>
                <Link to={"/"}>
                  <Button variant={"outline"}>{"Kembali ke Beranda"}</Button>
                </Link>
              </HStack>
            </VStack>
          </Container.Root>
        ) : (
          /* Registration Form */
          <Container.Root
            as={"form"}
            onSubmit={handleSubmit(onSubmit)}
            rounded={theme.radii.container}
          >
            <HeaderContainer p={6}>
              <VStack align={"center"} textAlign={"center"} w={"full"} gap={1}>
                <P fontWeight={"semibold"} fontSize={"md"}>
                  {"Formulir Permohonan & Berkas Dokumen Kemitraan"}
                </P>
                <P fontSize={"sm"} color={"fg.muted"} maxW={"560px"}>
                  {
                    "Lengkapi data identitas instansi pemohon serta unggah seluruh dokumen persyaratan sesuai ketentuan Kementerian ATR/BPN."
                  }
                </P>
              </VStack>
            </HeaderContainer>

            <Separator borderColor={"border.subtle"} />

            <Container.Body p={[4, null, 8]}>
              <VStack align={"stretch"} gap={"xl"}>
                {/* Section 1: Profil Instansi */}
                <Fieldset>
                  <HStack gap={2} mb={2} color={"fg.muted"}>
                    <AppIcon icon={Building2Icon} />
                    <P fontWeight={"semibold"} fontSize={"sm"}>
                      {"1. DATA PROFIL INSTANSI / PERUSAHAAN"}
                    </P>
                  </HStack>

                  <SimpleGrid columns={[1, null, 2]} gap={4}>
                    <Field
                      label={"Nama Instansi / Perusahaan"}
                      invalid={Boolean(errors.namaInstansi)}
                      errorText={errors.namaInstansi?.message}
                    >
                      <Input
                        placeholder={"PT Sumber Makmur Nusantara"}
                        {...register("namaInstansi")}
                      />
                    </Field>

                    <Field
                      label={"Nomor Induk Berusaha (NIB)"}
                      invalid={Boolean(errors.nib)}
                      errorText={errors.nib?.message}
                    >
                      <Input
                        placeholder={"Contoh: 1234567890123"}
                        {...register("nib")}
                      />
                    </Field>

                    <Field
                      label={"Nomor Pokok Wajib Pajak (NPWP)"}
                      invalid={Boolean(errors.npwp)}
                      errorText={errors.npwp?.message}
                    >
                      <Input
                        placeholder={"Contoh: 01.234.567.8-901.000"}
                        {...register("npwp")}
                      />
                    </Field>

                    <Field
                      label={"Situs Web Instansi (Opsional)"}
                      invalid={Boolean(errors.website)}
                      errorText={errors.website?.message}
                    >
                      <Input
                        placeholder={"https://perusahaan.co.id"}
                        {...register("website")}
                      />
                    </Field>

                    <Box gridColumn={[null, null, "span 2"]}>
                      <Field
                        label={"Alamat Kantor Operasional"}
                        invalid={Boolean(errors.alamatKantor)}
                        errorText={errors.alamatKantor?.message}
                      >
                        <Input
                          placeholder={
                            "Jl. Jenderal Sudirman No. Kav 52-53, Jakarta Selatan"
                          }
                          {...register("alamatKantor")}
                        />
                      </Field>
                    </Box>
                  </SimpleGrid>
                </Fieldset>

                <Separator borderColor={"border.subtle"} />

                {/* Section 2: Penanggung Jawab */}
                <Fieldset>
                  <HStack gap={2} mb={2} color={"fg.muted"}>
                    <AppIcon icon={UserCheckIcon} />
                    <P fontWeight={"semibold"} fontSize={"sm"}>
                      {"2. PENANGGUNG JAWAB & AKUN SSO"}
                    </P>
                  </HStack>

                  <SimpleGrid columns={[1, null, 2]} gap={4}>
                    <Field
                      label={"Nama Lengkap Penanggung Jawab"}
                      invalid={Boolean(errors.namaPenanggungJawab)}
                      errorText={errors.namaPenanggungJawab?.message}
                    >
                      <Input
                        placeholder={"Budi Santoso"}
                        {...register("namaPenanggungJawab")}
                      />
                    </Field>

                    <Field
                      label={"Jabatan"}
                      invalid={Boolean(errors.jabatan)}
                      errorText={errors.jabatan?.message}
                    >
                      <Input
                        placeholder={"Direktur Utama / Kepala Divisi GIS"}
                        {...register("jabatan")}
                      />
                    </Field>

                    <Field
                      label={"Email Resmi (Untuk Login / SSO)"}
                      invalid={Boolean(errors.email)}
                      errorText={errors.email?.message}
                      helperText={
                        "Email ini akan digunakan untuk aktivasi akun dan notifikasi."
                      }
                    >
                      <Input
                        type={"email"}
                        placeholder={"budi@perusahaan.co.id"}
                        {...register("email")}
                      />
                    </Field>

                    <Field
                      label={"Nomor HP / WhatsApp"}
                      invalid={Boolean(errors.nomorHp)}
                      errorText={errors.nomorHp?.message}
                      helperText={"Format: +628... atau 08..."}
                    >
                      <Input
                        placeholder={"+6281234567890"}
                        {...register("nomorHp")}
                      />
                    </Field>

                    <Field
                      label={"Kata Sandi Akun (Opsional)"}
                      invalid={Boolean(errors.password)}
                      errorText={errors.password?.message}
                      helperText={"Dapat diset saat ini atau saat aktivasi SSO"}
                    >
                      <PasswordInput
                        placeholder={"Minimal 6 karakter"}
                        {...register("password")}
                      />
                    </Field>
                  </SimpleGrid>
                </Fieldset>

                <Separator borderColor={"border.subtle"} />

                {/* Section 3: 6 Berkas Dokumen Wajib */}
                <Fieldset>
                  <HStack gap={2} mb={2} color={"fg.muted"}>
                    <AppIcon icon={FileTextIcon} />
                    <P fontWeight={"semibold"} fontSize={"sm"}>
                      {"3. ENAM (6) BERKAS PERSYARATAN WAJIB"}
                    </P>
                  </HStack>

                  <Alert.Root status={"info"} size={"sm"} mb={3}>
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Description>
                        {
                          "Unggah seluruh 6 dokumen berikut dalam format PDF/Docx/Gambar (Maks. 10MB per file). Seluruh dokumen wajib diisi."
                        }
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  <SimpleGrid columns={[1, null, 2]} gap={6}>
                    <Field
                      label={"1. Surat Permohonan Kemitraan"}
                      invalid={Boolean(errors.suratPermohonan)}
                      errorText={errors.suratPermohonan?.message}
                    >
                      <Controller
                        name={"suratPermohonan"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Surat Permohonan Kerjasama (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>

                    <Field
                      label={"2. Dokumen DIK"}
                      invalid={Boolean(errors.dokumenDik)}
                      errorText={errors.dokumenDik?.message}
                    >
                      <Controller
                        name={"dokumenDik"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Dokumen DIK (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>

                    <Field
                      label={"3. Surat Pernyataan Hukum"}
                      invalid={Boolean(errors.suratPernyataanHukum)}
                      errorText={errors.suratPernyataanHukum?.message}
                    >
                      <Controller
                        name={"suratPernyataanHukum"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Surat Pernyataan Hukum (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>

                    <Field
                      label={"4. Surat Komitmen Evaluasi (Lampiran III)"}
                      invalid={Boolean(errors.suratKomitmenEvaluasi)}
                      errorText={errors.suratKomitmenEvaluasi?.message}
                    >
                      <Controller
                        name={"suratKomitmenEvaluasi"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Surat Komitmen Evaluasi (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>

                    <Field
                      label={"5. Surat Komitmen Perbaikan (Lampiran IV)"}
                      invalid={Boolean(errors.suratKomitmenPerbaikan)}
                      errorText={errors.suratKomitmenPerbaikan?.message}
                    >
                      <Controller
                        name={"suratKomitmenPerbaikan"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Surat Komitmen Perbaikan (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>

                    <Field
                      label={"6. Proposal Teknis Pemanfaatan IGT"}
                      invalid={Boolean(errors.proposalTeknis)}
                      errorText={errors.proposalTeknis?.message}
                    >
                      <Controller
                        name={"proposalTeknis"}
                        control={control}
                        render={({ field }) => (
                          <FileInput
                            label={"Unggah Proposal Teknis Pemanfaatan IGT (.pdf/.docx)"}
                            accept={[".pdf", ".doc", ".docx", ".jpg", ".png"]}
                            maxFiles={1}
                            onFileAccept={(details) =>
                              field.onChange(details.files)
                            }
                          />
                        )}
                      />
                    </Field>
                  </SimpleGrid>
                </Fieldset>
              </VStack>
            </Container.Body>

            <Separator borderColor={"border.subtle"} />

            <VStack
              align={"center"}
              justify={"center"}
              p={6}
              gap={4}
              w={"full"}
            >
              <HStack gap={3} justify={"center"} w={"full"}>
                <Link to={"/"}>
                  <Button variant={"outline"}>{"Batal"}</Button>
                </Link>

                <Button
                  primary={true}
                  type={"submit"}
                  loading={registerMutation.isPending}
                >
                  <AppIcon icon={SendIcon} />
                  {"Kirim Permohonan Mitra"}
                </Button>
              </HStack>

              <HStack gap={2} justify={"center"}>
                <AppIcon
                  icon={ShieldCheckIcon}
                  color={"fg.subtle"}
                  size={"sm"}
                />
                <P fontSize={"xs"} color={"fg.muted"} textAlign={"center"}>
                  {
                    "Data permohonan akan diproses secara resmi oleh Kementerian ATR/BPN."
                  }
                </P>
              </HStack>
            </VStack>
          </Container.Root>
        )}

        {/* Footer Note */}
        <VStack align={"center"} mt={6} gap={2}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {"Sudah mengajukan permohonan? "}
            <Link to={"/registration-status"}>
              <PLink fontWeight={"semibold"}>{"Cek Status Pengajuan"}</PLink>
            </Link>
          </P>

          <P fontSize={"sm"} color={"fg.muted"}>
            {"Sudah memiliki akun kemitraan aktif? "}
            <Link to={"/"}>
              <PLink fontWeight={"semibold"}>{"Masuk ke Portal Mitra"}</PLink>
            </Link>
          </P>
        </VStack>
      </ConstrainedContainer>
    </PageContainer>
  );
};
