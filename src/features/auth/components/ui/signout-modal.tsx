// src/features/auth/components/ui/signout-modal.tsx

import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout.mutation";
import type { SignoutTriggerProps } from "@/features/auth/types/signout-modal.type";
import { LogOutIcon } from "lucide-react";

export const SignoutTrigger = (props: SignoutTriggerProps) => {
  // Props
  const { modalKey = "auth-signout-confirmation", children } = props;

  // Mutations
  const signoutMutation = useSignoutMutation();

  return (
    <ConfirmationTrigger
      modalKey={modalKey}
      icon={LogOutIcon}
      title={"Keluar dari Aplikasi"}
      description={"Apakah Anda yakin ingin keluar dari akun Anda?"}
      confirmLabel={"Keluar"}
      cancelLabel={"Batal"}
      confirmButtonProps={{
        colorPalette: "red",
        variant: "outline",
        loading: signoutMutation.isPending,
      }}
      onConfirm={() => signoutMutation.mutate()}
    >
      {children}
    </ConfirmationTrigger>
  );
};
