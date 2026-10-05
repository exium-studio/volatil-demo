// src/features/user-guide/components/user-guide.form-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { Input } from "@/design-system/components/input/ui/input";
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VersionInput } from "@/design-system/components/input/ui/version-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import {
  USER_GUIDE_CATEGORY_MAP,
  USER_GUIDE_TARGET_ROLE_OPTIONS,
} from "@/features/user-guide/constants/user-guide.constants";
import {
  useCreateUserGuideMutation,
  useUpdateUserGuideMutation,
} from "@/features/user-guide/hooks/use-user-guide.mutations";
import { userGuideFormSchema } from "@/features/user-guide/schemas/user-guide.schema";
import type {
  CreateUserGuidePayload,
  UpdateUserGuidePayload,
  UserGuideCategory,
  UserGuideFormModalProps,
  UserGuideFormValues,
  UserGuideItem,
  UserGuideTargetRole,
} from "@/features/user-guide/types/user-guide.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export const UserGuideFormModal = (props: UserGuideFormModalProps) => {
  // Props
  const {
    modalKey: customModalKey = "user-guide-form-modal",
    initialData = null,
    mode = "create",
    children,
  } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      {children && <Modal.Trigger>{children}</Modal.Trigger>}

      {isMounted && (
        <UserGuideFormModalContent
          close={close}
          initialData={initialData}
          mode={mode}
          modalKey={modalKey}
        />
      )}
    </Modal.Root>
  );
};

const UserGuideFormModalContent = (props: {
  close: () => void;
  initialData?: UserGuideItem | null;
  mode: "create" | "edit";
  modalKey: string;
}) => {
  // Props
  const { close, initialData, mode, modalKey } = props;

  // Mutations
  const createMutation = useCreateUserGuideMutation();
  const updateMutation = useUpdateUserGuideMutation();

  const isEdit = mode === "edit" && Boolean(initialData);

  // Form (RHF + Zod)
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UserGuideFormValues>({
    resolver: zodResolver(userGuideFormSchema),
    mode: "onChange",
    defaultValues: {
      id: initialData?.id ?? "",
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "manual_book",
      targetRole: initialData?.targetRole ?? "all",
      version: initialData?.version ?? "v1.0.0",
      files: [],
      isPublished: initialData?.isPublished ?? true,
    },
  });

  const watchedFiles = useWatch({ control, name: "files" });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        targetRole: initialData.targetRole,
        version: initialData.version,
        files: [],
        isPublished: initialData.isPublished,
      });
    }
  }, [initialData, reset]);

  // Derived Values
  const existingFiles = useMemo(() => {
    if (isEdit && initialData?.fileName) {
      return [
        {
          id: initialData.id,
          name: initialData.fileName,
          size: initialData.fileSize,
          url: initialData.fileUrl,
          mimeType:
            initialData.fileType === "pdf" ? "application/pdf" : undefined,
        },
      ];
    }
    return [];
  }, [isEdit, initialData]);

  const hasFile = isEdit ? true : watchedFiles.length > 0;
  const isSubmitDisabled = !isValid || !hasFile;

  // Handlers
  const onSubmit = (data: UserGuideFormValues) => {
    const uploadedFile = data.files[0] ?? null;

    if (isEdit && initialData) {
      const payload: UpdateUserGuidePayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        targetRole: data.targetRole,
        version: data.version,
        isPublished: data.isPublished,
        file: uploadedFile,
      };

      updateMutation.mutate(
        {
          id: initialData.id,
          payload,
        },
        {
          onSuccess: () => {
            close();
          },
        },
      );
    } else {
      const payload: CreateUserGuidePayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        targetRole: data.targetRole,
        version: data.version,
        isPublished: data.isPublished,
        file: uploadedFile,
      };

      createMutation.mutate(payload, {
        onSuccess: () => {
          close();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>
            {isEdit ? "Edit Dokumen Panduan" : "Tambah Dokumen Panduan"}
          </Modal.Title>

          <P color={"fg.subtle"} textAlign={"center"}>
            {
              "Kelola buku manual, SOP, dan petunjuk teknis yang dapat diakses pengguna"
            }
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"lg"}>
          {/* Grup 1: Informasi Dokumen */}
          <Fieldset legend={"Informasi Panduan"} containeredContent={true}>
            <VStack align={"stretch"} gap={"md"}>
              {/* Judul Dokumen */}
              <Controller
                control={control}
                name={"title"}
                render={({ field, fieldState }) => (
                  <Field
                    label={"Judul Dokumen Panduan"}
                    errorText={fieldState.error?.message}
                    invalid={Boolean(fieldState.error)}
                  >
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={"Buku Panduan Pengguna Portal Mitra IGT"}
                    />
                  </Field>
                )}
              />

              {/* Deskripsi Dokumen */}
              <Controller
                control={control}
                name={"description"}
                render={({ field, fieldState }) => (
                  <Field
                    label={"Deskripsi / Ringkasan Panduan"}
                    errorText={fieldState.error?.message}
                    invalid={Boolean(fieldState.error)}
                  >
                    <Textarea
                      rows={3}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={
                        "Jelaskan materi yang dimuat dalam dokumen panduan ini..."
                      }
                    />
                  </Field>
                )}
              />

              {/* Versi Dokumen */}
              <Controller
                control={control}
                name={"version"}
                render={({ field, fieldState }) => (
                  <Field
                    label={"Versi Dokumen"}
                    errorText={fieldState.error?.message}
                    invalid={Boolean(fieldState.error)}
                  >
                    <VersionInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </VStack>
          </Fieldset>

          {/* Grup 2: Kategori & Hak Akses */}
          <Fieldset legend={"Klasifikasi & Akses"} containeredContent={true}>
            <VStack align={"stretch"} gap={"md"}>
              {/* Kategori Dokumen via RadioCardInput */}
              <Controller
                control={control}
                name={"category"}
                render={({ field }) => (
                  <Field label={"Kategori Dokumen"}>
                    <RadioCardInput.Root
                      value={field.value}
                      onValueChange={({ value }) => {
                        if (value) {
                          field.onChange(value as UserGuideCategory);
                        }
                      }}
                      w={"full"}
                    >
                      <VStack gap={"xs"} w={"full"}>
                        {Object.entries(USER_GUIDE_CATEGORY_MAP).map(
                          ([key, meta]) => (
                            <RadioCardInput.Item
                              key={key}
                              value={key}
                              w={"full"}
                              p={2.5}
                            >
                              <HStack
                                justify={"space-between"}
                                align={"center"}
                                w={"full"}
                              >
                                <HStack gap={"sm"} align={"center"}>
                                  <AppIcon
                                    icon={meta.icon}
                                    color={`${meta.colorPalette}.fg`}
                                    boxSize={4}
                                  />
                                  <RadioCardInput.ItemText>
                                    {meta.label}
                                  </RadioCardInput.ItemText>
                                </HStack>

                                <RadioCardInput.ItemIndicator />
                              </HStack>
                            </RadioCardInput.Item>
                          ),
                        )}
                      </VStack>
                    </RadioCardInput.Root>
                  </Field>
                )}
              />

              {/* Target Role Audiens */}
              <Controller
                control={control}
                name={"targetRole"}
                render={({ field }) => (
                  <Field label={"Target Audiens / Hak Akses"}>
                    <FocusSelectInput
                      modalKey={`${modalKey}.target-role-select`}
                      options={USER_GUIDE_TARGET_ROLE_OPTIONS}
                      value={field.value}
                      onValueChange={(val) => {
                        if (val) {
                          field.onChange(val as UserGuideTargetRole);
                        }
                      }}
                      title={"Pilih Target Pengguna"}
                    />
                  </Field>
                )}
              />
            </VStack>
          </Fieldset>

          {/* Grup 3: Upload Berkas Dokumen & Publikasi */}
          <Fieldset legend={"Berkas Dokumen"} containeredContent={true}>
            <VStack align={"stretch"} gap={"md"}>
              {/* Upload Berkas FileInput */}
              <Controller
                control={control}
                name={"files"}
                render={({ field }) => (
                  <Field label={"Berkas Panduan (PDF / DOCX)"}>
                    <FileInput
                      accept={[".pdf", ".docx", ".doc"]}
                      maxFiles={1}
                      maxFileSize={25 * 1024 * 1024}
                      value={field.value}
                      existingFiles={existingFiles}
                      onFileAccept={(details) => field.onChange(details.files)}
                    />
                  </Field>
                )}
              />

              {/* Switch Publikasi */}
              <Controller
                control={control}
                name={"isPublished"}
                render={({ field }) => (
                  <Field label={"Status Publikasi"}>
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      gap={"md"}
                      w={"full"}
                      py={1}
                    >
                      <VStack align={"start"} gap={"xs"}>
                        <P fontWeight={"medium"}>
                          {field.value
                            ? "Dipublikasikan (Publik)"
                            : "Draf (Internal Only)"}
                        </P>

                        <P color={"fg.subtle"}>
                          {
                            "Dokumen yang dipublikasikan akan langsung tampil di modal panduan"
                          }
                        </P>
                      </VStack>

                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) =>
                          field.onChange(Boolean(e.checked))
                        }
                      />
                    </HStack>
                  </Field>
                )}
              />
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary={true}
            loading={isPending}
            disabled={isSubmitDisabled || isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isEdit ? "Simpan Perubahan" : "Tambah Dokumen"}
          </Button>

          <Button onClick={close}>{"Batal"}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
