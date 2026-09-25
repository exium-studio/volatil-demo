// src\features\mitra\my-data\components\mitra.my-data.workspace-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { Kbd } from "@/design-system/components/typography/ui/kbd";
import { P } from "@/design-system/components/typography/ui/p";
import { Url } from "@/design-system/components/typography/ui/url";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import type {
  MitraMyDataWorkspaceModalContentProps,
  MitraMyDataWorkspaceTriggerProps,
} from "@/features/mitra/my-data/types/my-data.type";
import {
  CompassIcon,
  GlobeIcon,
  KeyIcon,
  LayersIcon,
  ServerIcon,
  SparklesIcon,
} from "lucide-react";

export const MitraMyDataWorkspaceTrigger = (
  props: MitraMyDataWorkspaceTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "mitra-my-data-workspace-modal",
    workspaceUrl,
    apiKey,
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

  if (!workspaceUrl) return null;

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"xl"}
    >
      <Modal.Trigger>
        {children ? (
          children
        ) : (
          <Button size={"sm"} variant={"outline"}>
            <AppIcon icon={ServerIcon} />
            {"Koneksi GIS (Workspace)"}
          </Button>
        )}
      </Modal.Trigger>

      {isMounted && (
        <MitraMyDataWorkspaceModalContent
          workspaceUrl={workspaceUrl}
          apiKey={apiKey}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

export const MitraMyDataWorkspaceModalContent = (
  props: MitraMyDataWorkspaceModalContentProps,
) => {
  // Props
  const { workspaceUrl, apiKey, close } = props;

  return (
    <Modal.Content>
      <Modal.Header>
        <HStack justify={"space-between"} align={"center"} w={"full"} pr={"lg"}>
          <HStack gap={3} align={"center"}>
            <AppIcon icon={ServerIcon} />
            <VStack align={"start"} gap={0}>
              <Heading size={"md"}>{"GeoServer Workspace Proxy"}</Heading>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Hubungkan seluruh layer IGT aktif Anda ke software GIS"}
              </P>
            </VStack>
          </HStack>

          <Badge size={"xs"}>{"Multi-Layer Auto-Sync"}</Badge>
        </HStack>
      </Modal.Header>

      <Modal.Body gap={"md"} p={0}>
        {/* Workspace Credentials Summary */}
        <Box px={6} py={3} borderBottomWidth={"1px"} borderColor={"border.subtle"}>
          <SimpleGrid columns={[1, null, 2]} gap={4}>
            <VStack align={"start"} gap={1}>
              <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                {"Nama Workspace"}
              </P>
              <HStack align={"center"} gap={2}>
                <Kbd fontSize={"xs"}>{workspaceUrl.workspaceName}</Kbd>
                <ClipboardButton
                  value={workspaceUrl.workspaceName}
                  size={"2xs"}
                />
              </HStack>
            </VStack>

            {apiKey && (
              <VStack align={"start"} gap={1}>
                <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                  {"API Key Pengguna"}
                </P>
                <HStack align={"center"} gap={2}>
                  <Kbd fontSize={"xs"}>{apiKey}</Kbd>
                  <ClipboardButton value={apiKey} size={"2xs"} />
                </HStack>
              </VStack>
            )}
          </SimpleGrid>
        </Box>

        {/* Tabbed Guides & Endpoints */}
        <Tabs.Root defaultValue={"qgis"} flex={1} display={"flex"} flexDir={"column"}>
          <Tabs.List px={6} borderColor={"border.subtle"}>
            <Tabs.Trigger value={"qgis"}>
              <AppIcon icon={CompassIcon} size={"xs"} />
              {"QGIS (Direkomendasikan)"}
            </Tabs.Trigger>

            <Tabs.Trigger value={"arcgis"}>
              <AppIcon icon={LayersIcon} size={"xs"} />
              {"ArcGIS Pro"}
            </Tabs.Trigger>

            <Tabs.Trigger value={"endpoints"}>
              <AppIcon icon={GlobeIcon} size={"xs"} />
              {"Semua Endpoint (WMS / WFS)"}
            </Tabs.Trigger>
          </Tabs.List>

          {/* TAB 1: QGIS */}
          <Tabs.Content value={"qgis"} px={6} py={4}>
            <VStack align={"stretch"} gap={4}>
              {/* Primary Endpoint */}
              <VStack align={"start"} gap={1}>
                <HStack justify={"space-between"} align={"center"} w={"full"}>
                  <P fontSize={"xs"} fontWeight={"semibold"}>
                    {"URL Layanan WMS (Siap Pakai)"}
                  </P>
                  <P fontSize={"2xs"} color={"fg.subtle"}>
                    {"Termasuk Autentikasi API Key"}
                  </P>
                </HStack>

                <Url
                  url={workspaceUrl.wmsUrl}
                  label={"Salin URL WMS"}
                  maxW={"full"}
                />
              </VStack>

              <Separator borderColor={"border.subtle"} />

              {/* Step by step */}
              <VStack align={"stretch"} gap={2}>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  {"Langkah Menghubungkan ke QGIS:"}
                </P>

                <VStack align={"stretch"} gap={2} fontSize={"xs"}>
                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"1"}</Badge>
                    <P>
                      {"Buka QGIS → Pilih menu "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"Layer → Add Layer → Add WMS/WMTS Layer..."}
                      </P>
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"2"}</Badge>
                    <P>
                      {"Klik tombol "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"New"}
                      </P>
                      {", beri nama koneksi (contoh: "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"Volatil ATR/BPN"}
                      </P>
                      {")."}
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"3"}</Badge>
                    <P>
                      {"Tempelkan URL WMS di atas pada kolom "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"URL"}
                      </P>
                      {", lalu klik "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"OK"}
                      </P>
                      {"."}
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"4"}</Badge>
                    <P>
                      {"Klik "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"Connect"}
                      </P>
                      {" → Seluruh layer IGT aktif Anda otomatis tampil dan siap ditambahkan ke peta."}
                    </P>
                  </HStack>
                </VStack>
              </VStack>

              <Separator borderColor={"border.subtle"} />

              {/* Auto sync info */}
              <HStack align={"center"} gap={2} fontSize={"xs"} color={"fg.muted"}>
                <AppIcon icon={SparklesIcon} size={"xs"} />
                <P>
                  {
                    "Layer baru yang Anda beli akan otomatis muncul di QGIS tanpa perlu mengubah URL koneksi."
                  }
                </P>
              </HStack>
            </VStack>
          </Tabs.Content>

          {/* TAB 2: ARCGIS PRO */}
          <Tabs.Content value={"arcgis"} px={6} py={4}>
            <VStack align={"stretch"} gap={4}>
              <VStack align={"start"} gap={1}>
                <HStack justify={"space-between"} align={"center"} w={"full"}>
                  <P fontSize={"xs"} fontWeight={"semibold"}>
                    {"URL Layanan WMS untuk ArcGIS"}
                  </P>
                  <P fontSize={"2xs"} color={"fg.subtle"}>
                    {"Kompatibel dengan ArcGIS Pro & ArcMap"}
                  </P>
                </HStack>

                <Url
                  url={workspaceUrl.wmsUrl}
                  label={"Salin URL WMS"}
                  maxW={"full"}
                />
              </VStack>

              <Separator borderColor={"border.subtle"} />

              <VStack align={"stretch"} gap={2}>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  {"Langkah Menghubungkan ke ArcGIS Pro:"}
                </P>

                <VStack align={"stretch"} gap={2} fontSize={"xs"}>
                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"1"}</Badge>
                    <P>
                      {"Buka panel "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"Catalog"}
                      </P>
                      {" di ArcGIS Pro."}
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"2"}</Badge>
                    <P>
                      {"Klik kanan "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"Servers → Add WMS Server"}
                      </P>
                      {"."}
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"3"}</Badge>
                    <P>
                      {"Tempelkan URL WMS di atas pada kolom Server URL, lalu klik "}
                      <P as={"span"} fontWeight={"semibold"}>
                        {"OK"}
                      </P>
                      {"."}
                    </P>
                  </HStack>

                  <HStack align={"start"} gap={2}>
                    <Badge size={"xs"}>{"4"}</Badge>
                    <P>
                      {"Buka folder server baru di panel Catalog untuk menampilkan seluruh layer IGT."}
                    </P>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Tabs.Content>

          {/* TAB 3: SEMUA ENDPOINT */}
          <Tabs.Content value={"endpoints"} px={6} py={4}>
            <VStack align={"stretch"} gap={4}>
              {/* Query Auth Endpoints */}
              <VStack align={"stretch"} gap={3}>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  {"Endpoint URL (Termasuk API Key)"}
                </P>

                <VStack align={"start"} gap={1}>
                  <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                    {"Workspace WMS (Raster / Peta Visual)"}
                  </P>
                  <Url
                    url={workspaceUrl.wmsUrl}
                    label={"Salin WMS URL"}
                    maxW={"full"}
                  />
                </VStack>

                <VStack align={"start"} gap={1}>
                  <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                    {"Workspace WFS (Vektor Fitur & Geometri)"}
                  </P>
                  <Url
                    url={workspaceUrl.wfsUrl}
                    label={"Salin WFS URL"}
                    maxW={"full"}
                  />
                </VStack>
              </VStack>

              <Separator borderColor={"border.subtle"} />

              {/* Base Endpoints */}
              <VStack align={"stretch"} gap={3}>
                <P fontSize={"xs"} fontWeight={"semibold"}>
                  {"Endpoint Base (Autentikasi via HTTP Header)"}
                </P>

                <SimpleGrid columns={[1, null, 2]} gap={2}>
                  <VStack align={"start"} gap={1}>
                    <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                      {"Base WMS"}
                    </P>
                    <Url
                      url={workspaceUrl.qgisWmsUrl}
                      label={"Salin Base WMS"}
                      maxW={"full"}
                    />
                  </VStack>

                  <VStack align={"start"} gap={1}>
                    <P fontSize={"2xs"} color={"fg.subtle"} textTransform={"uppercase"}>
                      {"Base WFS"}
                    </P>
                    <Url
                      url={workspaceUrl.qgisWfsUrl}
                      label={"Salin Base WFS"}
                      maxW={"full"}
                    />
                  </VStack>
                </SimpleGrid>

                {apiKey && (
                  <HStack
                    justify={"space-between"}
                    align={"center"}
                    p={2}
                    borderWidth={"1px"}
                    borderColor={"border.subtle"}
                    fontSize={"xs"}
                  >
                    <HStack gap={2}>
                      <AppIcon icon={KeyIcon} size={"xs"} />
                      <P color={"fg.muted"}>{"Header:"}</P>
                      <Kbd fontSize={"xs"}>{`X-API-Key: ${apiKey}`}</Kbd>
                    </HStack>
                    <ClipboardButton value={apiKey} size={"2xs"} />
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </Modal.Body>

      <Modal.Footer px={6} py={3}>
        <Button variant={"outline"} onClick={close}>
          {"Tutup"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
