// src/features/root/components/demo.page.tsx

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { ColorModeToggleButton } from "@/design-system/components/button/ui/color-mode-button";
import type {
  DataListBatchActionsGenerator,
  DataListItemActionsGenerator,
} from "@/design-system/components/data-display/types/data-list.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Breadcrumb } from "@/design-system/components/disclosure/ui/breadcrumb";
import { Carousel } from "@/design-system/components/disclosure/ui/carousel";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Steps } from "@/design-system/components/disclosure/ui/steps";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { DotIndicator } from "@/design-system/components/feedback/ui/indicator";
import {
  Progress,
  ProgressCircle,
} from "@/design-system/components/feedback/ui/progress";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@/design-system/components/feedback/ui/skeleton";
import { AccessDeniedState } from "@/design-system/components/feedback/ui/state.access-denied";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { useExistingFiles } from "@/design-system/components/input/hooks/use-existing-files";
import type { FieldProps } from "@/design-system/components/input/types/field.type";
import { Checkbox } from "@/design-system/components/input/ui/checkbox";
import { DateInput } from "@/design-system/components/input/ui/date-input";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import {
  NumberInput,
  SteppedNumberInput,
} from "@/design-system/components/input/ui/number-input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { PinInput } from "@/design-system/components/input/ui/pin-input";
import { RadioCardInput } from "@/design-system/components/input/ui/radio-card-input";
import { RadioInput } from "@/design-system/components/input/ui/radio-input";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import Select from "@/design-system/components/input/ui/select";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { Box } from "@/design-system/components/layout/ui/box";
import {
  AbsoluteCenter,
  Center,
} from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Group } from "@/design-system/components/layout/ui/group";
import { Splitter } from "@/design-system/components/layout/ui/splitter";
import { Image } from "@/design-system/components/media/ui/image";
import { Link } from "@/design-system/components/navigation/ui/link";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Dialog } from "@/design-system/components/overlay/ui/dialog";
import { Drawer } from "@/design-system/components/overlay/ui/drawer";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { toast } from "@/design-system/components/toast";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { RichTextEditorPresetEssential } from "@/design-system/components/typography/ui/rich-text-editor.preset";
import { Span } from "@/design-system/components/typography/ui/span";
import { DownloadTrigger } from "@/design-system/components/utilities/ui/download-trigger";
import { SPACING_MD } from "@/design-system/constants/styles";
import { useBreakpointValue } from "@/design-system/hooks";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { SettingsTrigger } from "@/features/settings/components/settings";
import { getLocale, getLocaleLabel } from "@/shared/libs/i18n";
import { useLocale } from "@/shared/libs/i18n/locale-provider";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  IconArrowRight,
  IconDownload,
  IconFilter2,
  IconForbid,
  IconLanguage,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CogIcon,
  EditIcon,
  FolderIcon,
  MessageSquareIcon,
  TrashIcon,
  Undo2Icon,
  UndoIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

export const DemoPage = () => {
  return (
    <VStack minH={"100dvh"} bg={"bg.canvas"} gap={4}>
      <IntegratedFeatures />
      <Typography />
      <Navigation />
      <Buttons />
      <Toast />
      <Layout />
      <Inputs />
      <Overlay />
      <Disclosure />
      <Feedback />
      <DataDisplay />
      <Utilities />

      <ColorModeToggleButton pos={"fixed"} bottom={0} right={0} />
    </VStack>
  );
};

const IntegratedFeatures = () => {
  const { setLocale } = useLocale();

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Integrated Features
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={2}>
          <SettingsTrigger modalKey={"settings"} w={"fit"}>
            <IconButton>
              <AppIcon icon={CogIcon} strokeWidth={1.3} size={"lg"} />
            </IconButton>
          </SettingsTrigger>

          <ColorModeToggleButton />

          <Button
            onClick={() => {
              setLocale(getLocale() === "id" ? "en" : "id");
            }}
          >
            <AppIcon icon={IconLanguage} />
            {getLocaleLabel(getLocale())}
          </Button>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

const Typography = () => {
  const [tnum, setTnum] = useState<number>(10);

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Typography
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={8}>
          <VStack>
            <P color={"fg.solid"}>{"Default"}</P>
            <P color={"fg.emphasized"}>{"Emphasized"}</P>
            <P color={"fg.muted"}>{"Muted"}</P>
            <P color={"fg.subtle"}>{"Subtle"}</P>
          </VStack>

          <VStack gap={2}>
            <HStack align={"center"} gap={4}>
              <VStack>
                <HStack align={"center"} justify={"space-between"} gap={2}>
                  <P>Normal text</P>
                  <P>{tnum}</P>
                </HStack>

                <HStack align={"center"} justify={"space-between"} gap={2}>
                  <P>Tabular num</P>
                  <P>
                    <TNum>{tnum}</TNum>
                  </P>
                </HStack>
              </VStack>

              <Button
                size={"xs"}
                variant={"outline"}
                onClick={() => setTnum((p) => p + 1)}
              >
                + 1
              </Button>
            </HStack>

            <P fontSize={"xs"} color={"fg.subtle"} w={"120px"}>
              *Tabular num has consistent width per char
            </P>
          </VStack>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

const Navigation = () => {
  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Navigation
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <Link to={"https://youtube.com"} target={"_blank"}>
            youtube.com
          </Link>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

const Buttons = () => {
  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Buttons
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <Button primary>Primary</Button>

          <Button variant={"surface"}>Surface</Button>

          <Button variant={"subtle"}>Subtle</Button>

          <Button variant={"outline"}>Outline</Button>

          <Button>Default/Ghost</Button>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

const Toast = () => {
  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Toast
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <Button
            onClick={() => {
              toast.create({
                variant: "success",
                title: "All set — changes saved!",
              });
            }}
          >
            Toast success
          </Button>

          <Button
            onClick={() => {
              toast.create({
                variant: "warning",
                group: "Warning",
                title: "Password strength: weak",
              });
            }}
          >
            Toast warning
          </Button>

          <Button
            onClick={() => {
              toast.create({
                variant: "error",
                title: "File to large",
                description: "Max file size is 5MB",
              });
            }}
          >
            Toast error
          </Button>

          <Button
            onClick={() => {
              const duration = 5000;

              toast.create({
                id: "Email compose",
                variant: "loading",
                title: "Sending email to Jolitos",
                quickAction: {
                  content: (
                    <>
                      <AppIcon icon={UndoIcon} size={"xs"} />
                      Undo
                    </>
                  ),
                  onClick: () => {
                    console.log("Undo");
                  },
                },
                duration: duration + 100,
              });

              setTimeout(() => {
                toast.update("Email compose", {
                  variant: "success",
                  title: "Email sent successfully",
                  quickAction: undefined,
                  duration: duration,
                });
              }, duration);
            }}
          >
            Toast loading with quick action
          </Button>

          <Button
            onClick={() => {
              toast.create({
                icon: <AppIcon icon={MessageSquareIcon} size={"sm"} />,
                group: "Message",
                title: "Johan sent you a message",
                description:
                  "Lorem ipsum dolor sit amet, adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                actions: [
                  {
                    content: "Mark as read",
                    onClick: () => {
                      console.log("Mark as read");
                    },
                  },
                  {
                    content: "Reply",
                    onClick: () => {
                      console.log("Reply");
                    },
                  },
                  {
                    content: "Mute",
                    onClick: () => {
                      console.log("Mute");
                    },
                  },
                ],
              });
            }}
          >
            Toast with custom icon + actions
          </Button>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

const Layout = () => {
  const orientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    md: "horizontal",
  });

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Layout
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <Splitter.Root
            panels={[
              { id: "a", minSize: 30 },
              { id: "b", minSize: 30 },
            ]}
            defaultSize={[50, 50]}
            orientation={orientation}
            borderWidth={"1px"}
            minH={"60"}
          >
            <Splitter.Panel id={"a"}>
              <Center boxSize={"full"} textStyle={"2xl"}>
                A
              </Center>
            </Splitter.Panel>

            <Splitter.ResizeTrigger id={"a:b"} />

            <Splitter.Panel id={"b"}>
              <Center boxSize={"full"} textStyle={"2xl"}>
                B
              </Center>
            </Splitter.Panel>
          </Splitter.Root>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

// -------------------------------------------------------------------------------------

const FieldTemplate = (props: FieldProps) => {
  return <Field errorText={"Invalid input"} w={"fit"} {...props} />;
};

const DemoFileInput = (
  props: FieldProps & { inputProps: UseFormRegisterReturn },
) => {
  const { inputProps, ...restProps } = props;
  const apiResponse = [
    {
      attachment_id: "att_001",
      file_name: "invoice-january.pdf",
      file_size: 8000,
      file_url: "https://cdn.example.com/files/invoice-january.pdf",
      content_type: "application/pdf",
    },
    {
      attachment_id: "att_002",
      file_name: "product-photo.jpg",
      file_size: 1420,
      file_url: "https://cdn.example.com/files/product-photo.jpg",
      content_type: "image/jpeg",
    },
  ];

  const { existingFiles, toggleMarkedForDelete } = useExistingFiles({
    initialExistingFiles: apiResponse.map((att) => ({
      id: att.attachment_id,
      name: att.file_name,
      size: att.file_size,
      url: att.file_url,
      mimeType: att.content_type,
      // markedForDelete: true,
    })),
  });

  return (
    <FieldTemplate label={"Edit Mode"} w={"320px"} {...restProps}>
      <FileInput
        inputProps={inputProps}
        accept={[".jpeg", ".jpg"]}
        maxFiles={2}
        existingFiles={existingFiles}
        onToggleDeleteExisting={toggleMarkedForDelete}
      />
    </FieldTemplate>
  );
};

const DemoFileInputReplace = (
  props: FieldProps & { inputProps: UseFormRegisterReturn },
) => {
  const { inputProps, ...restProps } = props;
  const apiResponse = [
    {
      attachment_id: "att_001",
      file_name: "invoice-january.pdf",
      file_size: 8000,
      file_url: "https://cdn.example.com/files/invoice-january.pdf",
      content_type: "application/pdf",
    },
    {
      attachment_id: "att_002",
      file_name: "product-photo.jpg",
      file_size: 1420,
      file_url: "https://cdn.example.com/files/product-photo.jpg",
      content_type: "image/jpeg",
    },
  ];

  const { existingFiles } = useExistingFiles({
    initialExistingFiles: apiResponse.map((att) => ({
      id: att.attachment_id,
      name: att.file_name,
      size: att.file_size,
      url: att.file_url,
      mimeType: att.content_type,
      // markedForDelete: true,
    })),
  });

  return (
    <FieldTemplate label={"Replace Mode"} w={"320px"} {...restProps}>
      <FileInput
        inputProps={inputProps}
        accept={[".jpeg", ".jpg"]}
        maxFiles={2}
        existingFiles={existingFiles}
      />
    </FieldTemplate>
  );
};

const DemoRichTextEditor = (props: FieldProps) => {
  return (
    <FieldTemplate {...props}>
      <RichTextEditorPresetEssential />
    </FieldTemplate>
  );
};

export const Inputs = () => {
  const {
    register,
    getValues,
    //  control
  } = useForm();

  const [invalid, setInvalid] = useState<boolean>(false);

  // const number1 = useWatch({
  //   control,
  //   name: "number1",
  // });

  // console.log("number1", number1);

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Inputs
        </P>

        <Fieldset>
          <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={12}>
            <FieldTemplate invalid={invalid}>
              <Checkbox>Checkbox</Checkbox>
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <Input placeholder={"Text input..."} w={"200px"} />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <PasswordInput
                placeholder={"Password input..."}
                w={"200px"}
                withPasswordStrength
              />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <SearchInput placeholder={"Search..."} />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <DateInput
                modalKey={"date-input"}
                datePickerSubtitle={"Pick a day for your leaves"}
                w={"250px"}
              />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <Select
                selectOptions={[
                  { label: "Option 1", value: "option-1" },
                  { label: "Option 2", value: "option-2" },
                  { label: "Option 3", value: "option-3" },
                  { label: "Option 4", value: "option-4" },
                  { label: "Option 5", value: "option-5" },
                ]}
                w={"200px"}
              />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <NumberInput
                inputProps={register("number1")}
                placeholder={"Number input..."}
                formatOptions={{
                  style: "unit",
                  unit: "inch",
                  unitDisplay: "long",
                }}
                w={"200px"}
              />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <SteppedNumberInput hiddenInputProps={register("number2")} />
            </FieldTemplate>

            <SimpleGrid columns={[1, null, 2]} gap={12}>
              <DemoFileInput
                invalid={invalid}
                inputProps={register("attachments")}
              />

              <DemoFileInputReplace
                invalid={invalid}
                inputProps={register("attachments2")}
              />
            </SimpleGrid>

            <FieldTemplate invalid={invalid}>
              <PinInput />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <Switch>Switch</Switch>
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <RadioInput
                options={[
                  { label: "Option 1", value: "option-1" },
                  { label: "Option 2", value: "option-2" },
                ]}
              />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <RadioCardInput.Root defaultValue="option-1">
                <HStack gap={4}>
                  <RadioCardInput.Item value="option-1">
                    <RadioCardInput.ItemControl>
                      <VStack gap={1}>
                        <AppIcon
                          icon={IconArrowRight}
                          size={"xl"}
                          color={"fg.muted"}
                          mb={1}
                        />

                        <RadioCardInput.ItemText>
                          Option 1
                        </RadioCardInput.ItemText>

                        <RadioCardInput.ItemDescription>
                          Description 1
                        </RadioCardInput.ItemDescription>
                      </VStack>

                      <RadioCardInput.ItemIndicator />
                    </RadioCardInput.ItemControl>
                  </RadioCardInput.Item>

                  <RadioCardInput.Item value="option-2">
                    <RadioCardInput.ItemControl>
                      <VStack gap={1}>
                        <AppIcon
                          icon={IconForbid}
                          size={"xl"}
                          color={"fg.muted"}
                          mb={1}
                        />

                        <RadioCardInput.ItemText>
                          Option 2
                        </RadioCardInput.ItemText>

                        <RadioCardInput.ItemDescription>
                          Description 2
                        </RadioCardInput.ItemDescription>
                      </VStack>
                      <RadioCardInput.ItemIndicator />
                    </RadioCardInput.ItemControl>
                  </RadioCardInput.Item>
                </HStack>
              </RadioCardInput.Root>
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <Textarea placeholder="textarea" />
            </FieldTemplate>

            <FieldTemplate invalid={invalid}>
              <Slider defaultValue={[25]} w={"200px"} />
            </FieldTemplate>

            <DemoRichTextEditor />
          </HStack>
        </Fieldset>

        <Group justify={"center"}>
          <Button
            onClick={() => {
              console.log(getValues());
            }}
          >
            Log input values
          </Button>

          <Button
            onClick={() => {
              setInvalid((ps) => !ps);
            }}
          >
            Toggle invalid <DotIndicator checked={invalid} />
          </Button>
        </Group>
      </Container.Body>
    </Container.Root>
  );
};

// -------------------------------------------------------------------------------------

const OModal = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "exampleModal",
  });

  return (
    <Modal.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Modal.Trigger>
        <Button variant={"outline"}>Open Modal</Button>
      </Modal.Trigger>

      <Modal.Content>
        <Modal.Header>
          <P
            w={"full"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Header
          </P>
        </Modal.Header>

        <Modal.Body>
          <P textAlign={"center"}>
            Modal is dynamic component, it render dialog component on large
            viewport, render drawer component on small to medium viewport and
            has its own fullscreen feature on dialog component
          </P>
        </Modal.Body>
        <Modal.Footer>
          <Button flex={1} onClick={close}>
            Close
          </Button>
          <Button flex={1} primary>
            CTA
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

const ODialog = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "exampleDialog",
  });

  return (
    <Dialog.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Dialog.Trigger>
        <Button variant={"outline"}>Open Dialog</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <P
            w={"full"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Header
          </P>
        </Dialog.Header>
        <Dialog.Body>
          <P textAlign={"center"}>
            Dialog is component that need user focus and styled like floating
            container
          </P>
        </Dialog.Body>
        <Dialog.Footer>
          <Button flex={1} onClick={close}>
            Close
          </Button>
          <Button flex={1} primary>
            CTA
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const ODrawer = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "exampleDrawer",
  });

  return (
    <Drawer.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"xl"}
    >
      <Drawer.Trigger>
        <Button variant={"outline"}>Open Drawer</Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <P
            w={"full"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Header
          </P>
        </Drawer.Header>

        <Drawer.Body>
          <VStack align={"center"} gap={4}>
            <P textAlign={"center"}>
              Drawer is component that need user focus and styled like "drawer"
              or sliding container
            </P>
          </VStack>
        </Drawer.Body>

        <Drawer.Footer>
          <Button flex={1} onClick={close}>
            Close
          </Button>

          <ONestedDrawer />
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
};

const ONestedDrawer = () => {
  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: "exampleDrawer.nested",
  });

  return (
    <Drawer.Root modalKey={modalKey} opened={isOpen} open={open} close={close}>
      <Drawer.Trigger>
        <Button primary flex={1}>
          Open Nested
        </Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <P
            w={"full"}
            fontSize={"xl"}
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Header
          </P>
        </Drawer.Header>
        <Drawer.Body>
          <P textAlign={"center"}>
            Drawer is component that need user focus and styled like "drawer" or
            sliding container
          </P>
        </Drawer.Body>
        <Drawer.Footer>
          <Button flex={1} onClick={close}>
            Close
          </Button>
          <Button flex={1} primary>
            CTA
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export const Overlay = () => {
  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Overlay
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <OModal />

          <ODialog />

          <ODrawer />
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

// -------------------------------------------------------------------------------------

const ActionButton = (props: IconButtonProps) => {
  return (
    <IconButton
      {...props}
      size="xs"
      variant="outline"
      rounded="full"
      pos="absolute"
      zIndex="1"
      bg="bg"
    />
  );
};

export const Disclosure = () => {
  const items = [
    { value: "a", title: "First Item", text: "Some value 1..." },
    { value: "b", title: "Second Item", text: "Some value 2..." },
    { value: "c", title: "Third Item", text: "Some value 3..." },
  ];
  const images = [
    "https://images.unsplash.com/photo-1656433031375-5042f5afe894?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2371",
    "https://images.unsplash.com/photo-1587466412525-87497b34fc88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2673",
    "https://images.unsplash.com/photo-1629581688635-5d88654e5bdd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2831",
    "https://images.unsplash.com/photo-1661030420948-862787de0056?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370",
    "https://images.unsplash.com/photo-1703505841379-2f863b201212?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2371",
    "https://images.unsplash.com/photo-1607776905497-b4f788205f6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2370",
  ];

  const steps = [
    {
      title: "Step 1",
      description: "Step 1 description",
    },
    {
      title: "Step 2",
      description: "Step 2 description",
    },
    {
      title: "Step 3",
      description: "Step 3 description",
    },
  ];

  const tabs = [
    { icon: UserIcon, triggerLabel: "Members" },
    { icon: FolderIcon, triggerLabel: "Projects" },
    { icon: CheckCircleIcon, triggerLabel: "Tasks" },
  ];

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Disclosure
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={10}>
          <Accordion.Root
            collapsible
            multiple
            defaultValue={["b"]}
            maxW={"300px"}
          >
            {items.map((item, index) => (
              <Accordion.Item key={index} value={item.value}>
                <Accordion.ItemTrigger
                  _open={{
                    color: "fg.muted",
                  }}
                >
                  <Span flex="1">{item.title}</Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody>{item.text}</Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Components</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.CurrentLink>Props</Breadcrumb.CurrentLink>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>

          <Carousel.Root
            allowMouseDrag
            slideCount={images.length}
            maxW={"350px"}
            gap={4}
            pos={"relative"}
          >
            <Carousel.Control>
              <Carousel.PrevTrigger asChild>
                <ActionButton left={4}>
                  <LuArrowLeft />
                </ActionButton>
              </Carousel.PrevTrigger>

              <Carousel.ItemGroup width="full">
                {images.map((src, index) => (
                  <Carousel.Item key={index} index={index}>
                    <Image
                      src={src}
                      alt={`Product ${index + 1}`}
                      objectFit="cover"
                      aspectRatio={16 / 9}
                      maxH="72vh"
                      w="full"
                    />
                  </Carousel.Item>
                ))}
              </Carousel.ItemGroup>

              <Carousel.NextTrigger asChild>
                <ActionButton right={4}>
                  <LuArrowRight />
                </ActionButton>
              </Carousel.NextTrigger>

              <Box pos={"absolute"} bottom={4} w={"full"}>
                <Carousel.Indicators
                  bg={"bodyLight"}
                  boxSize={1.5}
                  transition={"200ms"}
                  transformOrigin={"center"}
                  _current={{
                    width: 5,
                    opacity: 1,
                  }}
                />
              </Box>
            </Carousel.Control>
          </Carousel.Root>

          <Collapsible.Root collapsedHeight={"100px"} w={"200px"}>
            <Collapsible.Content
            // _closed={{
            //   shadow: "inset 0 -12px 12px -12px var(--shadow-color)",
            //   shadowColor: "red",
            // }}
            >
              <VStack padding={4}>
                <P>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
                  consequatur saepe obcaecati facere ea, debitis neque odit nemo
                  dicta nisi modi maxime ducimus, a vel in voluptate ratione
                  reprehenderit odio?
                </P>
              </VStack>
            </Collapsible.Content>

            <Collapsible.Trigger asChild mt={4}>
              <Button variant={"outline"} size={"sm"}>
                <Collapsible.Context>
                  {(api) => (api.open ? "Show Less" : "Show More")}
                </Collapsible.Context>

                <Collapsible.Indicator
                  transition={"200ms"}
                  _open={{ transform: "rotate(180deg)" }}
                >
                  <AppIcon icon={ChevronDownIcon} />
                </Collapsible.Indicator>
              </Button>
            </Collapsible.Trigger>
          </Collapsible.Root>

          <Steps.Root
            defaultStep={1}
            count={steps.length}
            maxW={"400px"}
            size={"sm"}
          >
            <Steps.List>
              {steps.map((step, index) => (
                <Steps.Item key={index} index={index} title={step.title}>
                  <Steps.Indicator />
                  <Steps.Title>{step.title}</Steps.Title>
                  <Steps.Separator />
                </Steps.Item>
              ))}
            </Steps.List>

            {steps.map((step, index) => (
              <Steps.Content key={index} index={index}>
                <P textAlign={"center"}>{step.description}</P>
              </Steps.Content>
            ))}

            <Steps.CompletedContent>
              <P textAlign={"center"}>All steps are complete!</P>
            </Steps.CompletedContent>

            <ButtonGroup size={"sm"} variant={"outline"} justify={"center"}>
              <Steps.PrevTrigger asChild>
                <Button>Prev</Button>
              </Steps.PrevTrigger>

              <Steps.NextTrigger asChild>
                <Button>Next</Button>
              </Steps.NextTrigger>
            </ButtonGroup>
          </Steps.Root>

          <Tabs.Root defaultValue="members">
            <Tabs.List>
              {tabs.map((tab, index) => (
                <Tabs.Trigger
                  key={index}
                  value={tab.triggerLabel.toLowerCase()}
                >
                  <AppIcon icon={tab.icon} />

                  {tab.triggerLabel}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {tabs.map((tab, index) => (
              <Tabs.Content key={index} value={tab.triggerLabel.toLowerCase()}>
                Manage your {tab.triggerLabel}
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

export const Feedback = () => {
  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Feedback
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={10}>
          <HStack
            w={"full"}
            wrap={"wrap"}
            align={"center"}
            justify={"center"}
            gap={10}
          >
            <NoDataState />

            <AccessDeniedState />

            <NoResultState />

            <RetryState />
          </HStack>

          <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={10}>
            <HStack gap={4}>
              <ProgressCircle.Root value={16} size={"xl"}>
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range />
                </ProgressCircle.Circle>

                <AbsoluteCenter>
                  <ProgressCircle.ValueText />
                </AbsoluteCenter>
              </ProgressCircle.Root>

              <ProgressCircle.Root value={null}>
                <ProgressCircle.Circle>
                  <ProgressCircle.Track />
                  <ProgressCircle.Range strokeLinecap={"round"} />
                </ProgressCircle.Circle>

                <AbsoluteCenter>
                  <ProgressCircle.ValueText />
                </AbsoluteCenter>
              </ProgressCircle.Root>
            </HStack>

            <VStack gap={4} w={"200px"}>
              <Progress.Root striped animated>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>

              <Progress.Root w={"200px"}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>

              <Progress.Root w={"200px"} value={null}>
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </VStack>
          </HStack>

          <VStack gap={4}>
            <HStack align={"center"} gap={4}>
              <SkeletonCircle w={"40px"} h={"40px"} />

              <VStack gap={2}>
                <SkeletonText w={"200px"} noOfLines={2} />
              </VStack>
            </HStack>

            <Skeleton w={"full"} h={"100px"} />
          </VStack>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};

export const DataDisplay = () => {
  // Stores
  const { theme } = useThemeStore();

  // Response data - dynamicaly changes depends on filters (search, perPage per page, pagination, etc.)
  const dataList = {
    fields: [
      { th: "Name", sortable: true },
      { th: "Email", sortable: true },
      { th: "Account Status", sortable: true },
      { th: "Role", sortable: true },
      { th: "Department", sortable: true },
      { th: "Phone Number", sortable: false },
      { th: "Location", sortable: true },
      { th: "Join Date", sortable: true },
      { th: "Last Active", sortable: true },
      { th: "Plan", sortable: true },
    ],

    items: [
      {
        id: "1",
        data: {
          name: "Sulenq",
          email: "sulenq@email.com",
          accountStatus: "Active",
          role: "Developer",
          department: "Engineering",
          phoneNumber: "+62 812-1111-0001",
          location: "Semarang",
          joinDate: "2024-01-10",
          lastActive: "2 hours ago",
          plan: "Pro",
        },
        columns: [
          { value: "Sulenq", td: "Sulenq" },
          { value: "sulenq@email.com", td: "sulenq@email.com" },
          { value: "Active", td: "Active" },
          { value: "Developer", td: "Developer" },
          { value: "Engineering", td: "Engineering" },
          { value: "+62 812-1111-0001", td: "+62 812-1111-0001" },
          { value: "Semarang", td: "Semarang" },
          { value: "2024-01-10", td: "2024-01-10" },
          { value: "2 hours ago", td: "2 hours ago" },
          { value: "Pro", td: "Pro" },
        ],
      },
      {
        id: "2",
        data: {
          name: "Jolitos",
          email: "jolitos@email.com",
          accountStatus: "Suspended",
          role: "Designer",
          department: "Product",
          phoneNumber: "+62 812-1111-0002",
          location: "Jakarta",
          joinDate: "2023-11-22",
          lastActive: "3 days ago",
          plan: "Basic",
        },
        columns: [
          { value: "Jolitos", td: "Jolitos" },
          { value: "jolitos@email.com", td: "jolitos@email.com" },
          { value: "Suspended", td: "Suspended" },
          { value: "Designer", td: "Designer" },
          { value: "Product", td: "Product" },
          { value: "+62 812-1111-0002", td: "+62 812-1111-0002" },
          { value: "Jakarta", td: "Jakarta" },
          { value: "2023-11-22", td: "2023-11-22" },
          { value: "3 days ago", td: "3 days ago" },
          { value: "Basic", td: "Basic" },
        ],
      },
      {
        id: "3",
        data: {
          name: "Wazawsky",
          email: "wazawsky@email.com",
          accountStatus: "Suspended",
          role: "QA Engineer",
          department: "Engineering",
          phoneNumber: "+62 812-1111-0003",
          location: "Bandung",
          joinDate: "2023-08-15",
          lastActive: "1 week ago",
          plan: "Free",
        },
        columns: [
          { value: "Wazawsky", td: "Wazawsky" },
          { value: "wazawsky@email.com", td: "wazawsky@email.com" },
          { value: "Suspended", td: "Suspended" },
          { value: "QA Engineer", td: "QA Engineer" },
          { value: "Engineering", td: "Engineering" },
          { value: "+62 812-1111-0003", td: "+62 812-1111-0003" },
          { value: "Bandung", td: "Bandung" },
          { value: "2023-08-15", td: "2023-08-15" },
          { value: "1 week ago", td: "1 week ago" },
          { value: "Free", td: "Free" },
        ],
      },
      {
        id: "4",
        data: {
          name: "Rasenta",
          email: "rasenta@email.com",
          accountStatus: "Active",
          role: "Product Manager",
          department: "Product",
          phoneNumber: "+62 812-1111-0004",
          location: "Surabaya",
          joinDate: "2024-02-01",
          lastActive: "5 minutes ago",
          plan: "Pro",
        },
        columns: [
          { value: "Rasenta", td: "Rasenta" },
          { value: "rasenta@email.com", td: "rasenta@email.com" },
          { value: "Active", td: "Active" },
          { value: "Product Manager", td: "Product Manager" },
          { value: "Product", td: "Product" },
          { value: "+62 812-1111-0004", td: "+62 812-1111-0004" },
          { value: "Surabaya", td: "Surabaya" },
          { value: "2024-02-01", td: "2024-02-01" },
          { value: "5 minutes ago", td: "5 minutes ago" },
          { value: "Pro", td: "Pro" },
        ],
      },
      {
        id: "5",
        data: {
          name: "Dhewangga",
          email: "dhewangga@email.com",
          accountStatus: "Pending",
          role: "Marketing",
          department: "Marketing",
          phoneNumber: "+62 812-1111-0005",
          location: "Yogyakarta",
          joinDate: "2024-03-18",
          lastActive: "1 day ago",
          plan: "Basic",
        },
        columns: [
          { value: "Dhewangga", td: "Dhewangga" },
          { value: "dhewangga@email.com", td: "dhewangga@email.com" },
          { value: "Pending", td: "Pending" },
          { value: "Marketing", td: "Marketing" },
          { value: "Marketing", td: "Marketing" },
          { value: "+62 812-1111-0005", td: "+62 812-1111-0005" },
          { value: "Yogyakarta", td: "Yogyakarta" },
          { value: "2024-03-18", td: "2024-03-18" },
          { value: "1 day ago", td: "1 day ago" },
          { value: "Basic", td: "Basic" },
        ],
      },
      {
        id: "6",
        data: {
          name: "Kirania",
          email: "kirania@email.com",
          accountStatus: "Active",
          role: "Developer",
          department: "Engineering",
          phoneNumber: "+62 812-1111-0006",
          location: "Semarang",
          joinDate: "2023-12-05",
          lastActive: "10 minutes ago",
          plan: "Pro",
        },
        columns: [
          { value: "Kirania", td: "Kirania" },
          { value: "kirania@email.com", td: "kirania@email.com" },
          { value: "Active", td: "Active" },
          { value: "Developer", td: "Developer" },
          { value: "Engineering", td: "Engineering" },
          { value: "+62 812-1111-0006", td: "+62 812-1111-0006" },
          { value: "Semarang", td: "Semarang" },
          { value: "2023-12-05", td: "2023-12-05" },
          { value: "10 minutes ago", td: "10 minutes ago" },
          { value: "Pro", td: "Pro" },
        ],
      },
      {
        id: "7",
        data: {
          name: "Bramasetya",
          email: "bramasetya@email.com",
          accountStatus: "Suspended",
          role: "Sales",
          department: "Sales",
          phoneNumber: "+62 812-1111-0007",
          location: "Medan",
          joinDate: "2023-09-30",
          lastActive: "2 weeks ago",
          plan: "Free",
        },
        columns: [
          { value: "Bramasetya", td: "Bramasetya" },
          { value: "bramasetya@email.com", td: "bramasetya@email.com" },
          { value: "Suspended", td: "Suspended" },
          { value: "Sales", td: "Sales" },
          { value: "Sales", td: "Sales" },
          { value: "+62 812-1111-0007", td: "+62 812-1111-0007" },
          { value: "Medan", td: "Medan" },
          { value: "2023-09-30", td: "2023-09-30" },
          { value: "2 weeks ago", td: "2 weeks ago" },
          { value: "Free", td: "Free" },
        ],
      },
      {
        id: "8",
        data: {
          name: "Larasati",
          email: "larasati@email.com",
          accountStatus: "Active",
          role: "HR",
          department: "Human Resources",
          phoneNumber: "+62 812-1111-0008",
          location: "Jakarta",
          joinDate: "2024-01-25",
          lastActive: "30 minutes ago",
          plan: "Basic",
        },
        columns: [
          { value: "Larasati", td: "Larasati" },
          { value: "larasati@email.com", td: "larasati@email.com" },
          { value: "Active", td: "Active" },
          { value: "HR", td: "HR" },
          { value: "Human Resources", td: "Human Resources" },
          { value: "+62 812-1111-0008", td: "+62 812-1111-0008" },
          { value: "Jakarta", td: "Jakarta" },
          { value: "2024-01-25", td: "2024-01-25" },
          { value: "30 minutes ago", td: "30 minutes ago" },
          { value: "Basic", td: "Basic" },
        ],
      },
      {
        id: "9",
        data: {
          name: "Wirandika",
          email: "wirandika@email.com",
          accountStatus: "Pending",
          role: "Support",
          department: "Customer Support",
          phoneNumber: "+62 812-1111-0009",
          location: "Malang",
          joinDate: "2024-02-14",
          lastActive: "4 hours ago",
          plan: "Free",
        },
        columns: [
          { value: "Wirandika", td: "Wirandika" },
          { value: "wirandika@email.com", td: "wirandika@email.com" },
          { value: "Pending", td: "Pending" },
          { value: "Support", td: "Support" },
          { value: "Customer Support", td: "Customer Support" },
          { value: "+62 812-1111-0009", td: "+62 812-1111-0009" },
          { value: "Malang", td: "Malang" },
          { value: "2024-02-14", td: "2024-02-14" },
          { value: "4 hours ago", td: "4 hours ago" },
          { value: "Free", td: "Free" },
        ],
      },
      {
        id: "10",
        data: {
          name: "Anindita",
          email: "anindita@email.com",
          accountStatus: "Active",
          role: "Developer",
          department: "Engineering",
          phoneNumber: "+62 812-1111-0010",
          location: "Semarang",
          joinDate: "2023-10-08",
          lastActive: "1 hour ago",
          plan: "Pro",
        },
        columns: [
          { value: "Anindita", td: "Anindita" },
          { value: "anindita@email.com", td: "anindita@email.com" },
          { value: "Active", td: "Active" },
          { value: "Developer", td: "Developer" },
          { value: "Engineering", td: "Engineering" },
          { value: "+62 812-1111-0010", td: "+62 812-1111-0010" },
          { value: "Semarang", td: "Semarang" },
          { value: "2023-10-08", td: "2023-10-08" },
          { value: "1 hour ago", td: "1 hour ago" },
          { value: "Pro", td: "Pro" },
        ],
      },
    ],

    batchActions: [
      ({ selectedItemIds, selectedItems }) => {
        return (
          <Button
            disabled={isEmptyArray(selectedItems)}
            onClick={() => {
              console.log({ selectedItemIds, selectedItems });
            }}
          >
            <AppIcon icon={IconTrash} />
            Delete
          </Button>
        );
      },
    ] as DataListBatchActionsGenerator[],

    itemActions: [
      (item) => {
        return (
          <Menu.Item
            value={"edit"}
            onClick={() => {
              console.log(item);
            }}
          >
            <AppIcon icon={EditIcon} size={"sm"} />
            Edit
          </Menu.Item>
        );
      },
      (item) => {
        return (
          <Menu.Item
            value={"restore"}
            onClick={() => {
              console.log(item);
            }}
          >
            <AppIcon icon={Undo2Icon} size={"sm"} />
            Restore
          </Menu.Item>
        );
      },
      (item) => {
        return (
          <Menu.Item
            value={"delete"}
            onClick={() => {
              console.log(item);
            }}
          >
            <AppIcon icon={TrashIcon} size={"sm"} />
            Delete
          </Menu.Item>
        );
      },
    ] as DataListItemActionsGenerator[],
  };

  // States
  const [perPage, setPerPage] = useState<number>(20);
  const [page, setPage] = useState<number>(1);

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Data Display
        </P>

        <VStack gap={2} bg={"bg.canvas"} px={[4, null, 10]} py={4}>
          <HStack
            wrap={"wrap"}
            align={"center"}
            justify={"space-between"}
            gap={4}
            p={4}
            bg={"bg.body"}
            rounded={theme.radii.container}
            shadow={"sm"}
          >
            <P fontSize={"xl"} fontWeight={"medium"} ml={1}>
              Feature Title
            </P>

            <HStack wrap={"wrap"} align={"center"} gap={2}>
              <SearchInput placeholder={"Search..."} />

              <Button variant={"outline"}>
                <AppIcon icon={IconFilter2} />
                Filter
              </Button>

              <Button variant={"outline"}>
                <AppIcon icon={IconDownload} />
                Export
              </Button>

              <IconButton primary>
                <AppIcon icon={IconPlus} />
              </IconButton>
            </HStack>
          </HStack>

          <VStack>
            <DataListTable.Root
              headers={dataList.fields}
              items={dataList.items}
              batchActions={dataList.batchActions}
              itemActions={dataList.itemActions}
              // maxH={"500px"}
            >
              <DataListTable.Header />

              <DataListTable.Body />
            </DataListTable.Root>

            <DataListFooter
              perPage={perPage}
              setPerPage={setPerPage}
              page={page}
              setPage={setPage}
              currentDataLength={dataList.items.length}
              totalData={100}
            />
          </VStack>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

export const Utilities = () => {
  const data = async () => {
    const res = await fetch(
      "https://fastly.picsum.photos/id/718/2880/1800.jpg?hmac=JZydaTGOvhjzXYg-o7Y5fytAXeTnAnCt_cadeQ3Mzjo",
    );
    return res.blob();
  };

  return (
    <Container.Root w={"full"} px={SPACING_MD}>
      <Container.Body gap={4} p={4}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Utilities
        </P>

        <HStack wrap={"wrap"} align={"center"} justify={"center"} gap={4}>
          <DownloadTrigger
            data={data}
            fileName={"wolf-2k.jpg"}
            mimeType={"image/jpeg"}
          >
            <Button>Download trigger</Button>
          </DownloadTrigger>
        </HStack>
      </Container.Body>
    </Container.Root>
  );
};
