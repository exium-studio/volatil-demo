// src/features/internal/integration/components/smtp-test-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useTestSmtpMutation } from "@/features/internal/integrations/hooks/use-integration.query";
import { smtpTestSchema } from "@/features/internal/integrations/schemas/integration.schema";
import type {
  SmtpTestFormValues,
  SmtpTestModalProps,
} from "@/features/internal/integrations/types/integration.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";

const SMTP_TEST_TARGET_EMAIL_KEY = "volatil_smtp_test_target_email";

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
      targetEmail:
        typeof window !== "undefined"
          ? (localStorage.getItem(SMTP_TEST_TARGET_EMAIL_KEY) ?? "")
          : "",
    },
  });

  // Handlers
  const onSubmit = (values: SmtpTestFormValues) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SMTP_TEST_TARGET_EMAIL_KEY, values.targetEmail);
    }
    testMutation.mutate(
      {
        targetEmail: values.targetEmail,
        config: currentConfig,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  return (
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{"Uji Coba Kirim Email"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
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
        </Modal.Body>

        <Modal.Footer>
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
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
