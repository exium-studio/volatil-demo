// src/features/internal/master-geoserver/components/internal.master-geoserver.create-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { useCreateMasterGeoserver } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { t } from "@/shared/libs/i18n";
import { useState, type ReactNode } from "react";

export type InternalMasterGeoserverCreateTriggerProps = {
  modalKey?: string;
  children?: ReactNode;
};

export const InternalMasterGeoserverCreateTrigger = (
  props: InternalMasterGeoserverCreateTriggerProps,
) => {
  const { modalKey: customModalKey = "create-geoserver", children } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalMasterGeoserverCreateModalContent close={close} />
    </Modal.Root>
  );
};

type InternalMasterGeoserverCreateModalContentProps = {
  close: () => void;
};

const InternalMasterGeoserverCreateModalContent = (
  props: InternalMasterGeoserverCreateModalContentProps,
) => {
  // Props
  const { close } = props;

  // States
  const [name, setName] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Mutations
  const createMutation = useCreateMasterGeoserver();

  const handleSubmit = () => {
    if (!name.trim() || !baseUrl.trim() || !username.trim()) return;

    createMutation.mutate(
      {
        name: name.trim(),
        baseUrl: baseUrl.trim(),
        username: username.trim(),
        password: password.trim() || undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  const isFormValid = Boolean(name.trim() && baseUrl.trim() && username.trim());

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{"Tambah Master GeoServer"}</Modal.Title>

        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Field label={"Nama Server"}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"GeoServer Produksi ATR/BPN"}
            />
          </Field>

          <Field label={"Base URL GeoServer"}>
            <Textarea
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={"https://.../geoserver"}
              rows={2}
            />
          </Field>

          <Field label={"Username"}>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={"admin_spatial"}
            />
          </Field>

          <Field label={"Password"} optional>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field label={"Deskripsi"} optional>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"Keterangan peruntukan GeoServer (opsional)..."}
              rows={2}
            />
          </Field>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            onClick={handleSubmit}
            disabled={!isFormValid || createMutation.isPending}
            loading={createMutation.isPending}
          >
            {"Daftarkan Server"}
          </Button>

          <Button onClick={close}>{t["action.cancel"]()}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
