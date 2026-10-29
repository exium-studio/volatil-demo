// src/features/internal/integration/components/smtp-test-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { P } from "@/design-system/components/typography/ui/p";
import { useTestSmtpMutation } from "@/features/internal/integrations/hooks/use-integration.query";
import { smtpTestSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type {
  SmtpTestFormValues,
  SmtpTestModalProps,
} from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";

export const SmtpTestModal = (props: SmtpTestModalProps) => {
  // Props
  const { modalKey = "smtp-test-email-modal", currentConfig } = props;

  // Hooks
  const { isOpen, close } = usePopModal({ modalKey });
  const testMutation = useTestSmtpMutation();

  // Form (RHF + Zod)
  const form = useForm<SmtpTestFormValues>({
    resolver: zodResolver(smtpTestSchema),
    defaultValues: {
      targetEmail: "",
    },
  });

  // Handlers
  const onSubmit = (values: SmtpTestFormValues) => {
    testMutation.mutate(
      {
        targetEmail: values.targetEmail,
        config: currentConfig,
      },
      {
        onSuccess: () => {
          form.reset();
          close();
        },
      },
    );
  };

  return (
    <Dialog.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Dialog.Content maxW={"480px"}>
        <Dialog.Header>
          <VStack gap={"xs"}>
            <P fontWeight={"semibold"} textAlign={"center"}>
              {"Uji Coba Kirim Email"}
            </P>

            <P fontSize={"sm"} color={"fg.muted"} textAlign={"center"}>
              {
                "Kirim satu email pengujian untuk memverifikasi host, port, dan kredensial SMTP."
              }
            </P>
          </VStack>
        </Dialog.Header>

        <Dialog.Body>
          <VStack
            as={"form"}
            id={"smtp-test-form"}
            onSubmit={form.handleSubmit(onSubmit)}
            gap={4}
            align={"stretch"}
          >
            <Field
              label={"Email Penerima Uji Coba"}
              helperText={
                "Masukkan alamat email aktif yang dapat Anda periksa."
              }
              errorText={form.formState.errors.targetEmail?.message}
              w={"full"}
            >
              <Input
                placeholder={"admin.teknis@atrbpn.go.id"}
                {...form.register("targetEmail")}
                w={"full"}
              />
            </Field>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer>
          <VStack flex={1} gap={"xs"}>
            <Button
              type={"submit"}
              form={"smtp-test-form"}
              primary={true}
              loading={testMutation.isPending}
            >
              <AppIcon icon={SendIcon} />
              {"Kirim Email Uji Coba"}
            </Button>

            <Button onClick={close}>{"Batal"}</Button>
          </VStack>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
