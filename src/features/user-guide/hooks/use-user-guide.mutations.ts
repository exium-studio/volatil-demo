// src/features/user-guide/hooks/use-user-guide.mutations.ts

import { toast } from "@/design-system/components/toast";
import { userGuideService } from "@/features/user-guide/services/user-guide.service";
import type {
  CreateUserGuidePayload,
  UpdateUserGuidePayload,
} from "@/features/user-guide/types/user-guide.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserGuidePayload) =>
      userGuideService.createGuide(payload),
    onSuccess: () => {
      toast.success("Dokumen Berhasil Ditambahkan", {
        description: "Dokumen panduan baru telah berhasil disimpan dan dipublikasikan.",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
    },
    onError: (error) => {
      toast.error("Gagal Menambahkan Dokumen", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengunggah dokumen panduan.",
      });
    },
  });
};

export const useUpdateUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserGuidePayload;
    }) => userGuideService.updateGuide(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Perubahan Berhasil Disimpan", {
        description: "Informasi dan berkas panduan berhasil diperbarui.",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error("Gagal Menyimpan Perubahan", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui dokumen panduan.",
      });
    },
  });
};

export const useDeleteUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userGuideService.deleteGuide(id),
    onSuccess: () => {
      toast.success("Dokumen Dihapus", {
        description: "Dokumen panduan berhasil dihapus dari sistem.",
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
    },
    onError: (error) => {
      toast.error("Gagal Menghapus Dokumen", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus dokumen panduan.",
      });
    },
  });
};

export const useTogglePublishUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isPublished,
    }: {
      id: string;
      isPublished: boolean;
    }) => userGuideService.updateGuide(id, { isPublished }),
    onSuccess: (data) => {
      toast.success(
        data.isPublished ? "Dokumen Dipublikasikan" : "Dokumen Diarsipkan",
        {
          description: data.isPublished
            ? "Dokumen kini dapat diakses oleh pengguna."
            : "Dokumen dialihkan ke draf internal.",
        },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.detail(data.id),
      });
    },
    onError: (error) => {
      toast.error("Gagal Mengubah Status Publikasi", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui status.",
      });
    },
  });
};

export const useTrackDownloadUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userGuideService.trackDownload(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
    },
  });
};
