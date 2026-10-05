// src/features/user-guide/hooks/use-user-guide.mutations.ts

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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.detail(variables.id),
      });
    },
  });
};

export const useDeleteUserGuideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userGuideService.deleteGuide(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
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
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.userGuide.detail(variables.id),
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
