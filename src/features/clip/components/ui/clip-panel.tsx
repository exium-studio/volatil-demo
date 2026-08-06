// src/features/clip/components/ui/clip-panel.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Box } from "@/design-system/components/layout/ui/box";
import { PADDING_SM } from "@/design-system/constants/styles";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { useClipResultLayer } from "@/features/clip/hooks/use-clip-result-layer";
import { useGlobalMap } from "@/features/clip/hooks/use-global-map";
import { useWfsClip } from "@/features/clip/hooks/use-wfs-clip";
import { useWmsLayer } from "@/features/clip/hooks/use-wms-layer";
import { useClipStore } from "@/features/clip/stores/use-clip-store";
import type { ClipSource } from "@/features/clip/types/clip.type";
import {
  extractFirstPolygon,
  parseShpToGeoJson,
} from "@/features/clip/utils/parse-shp";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { Input } from "@/design-system/components/input/ui/input";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import {
  IconCheck,
  IconCut,
  IconFileUpload,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Field } from "@/design-system/components/input/ui/field";

// Labels ditampilkan di spinner sesuai status clipping
const CLIP_STATUS_LABELS: Record<string, string> = {
  fetching: "Mengambil data di area yang dipilih...",
  clipping: "Memproses area clip...",
};

export const ClipPanel = () => {
  const map = useGlobalMap();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sourceMode, setSourceMode] = useState<ClipSource>("draw");

  // Hook wires
  const {
    wmsVisible,
    setWmsVisible,
    clippingPolygon,
    setClippingPolygon,
    status,
    error,
    clippedFeatures,
    reset,
  } = useClipStore();

  useWmsLayer(map, wmsVisible);
  const { run, cancel } = useWfsClip();
  useClipResultLayer(map);

  // Map drawing store
  const { isDrawing, start: startDraw, cancel: cancelDraw } = useMapDrawStore();

  // Detect when drawing finishes (isDrawing: true → false) and capture polygon.
  // We do NOT run clip immediately — the user must confirm first via panel buttons.
  const prevIsDrawing = useRef(isDrawing);
  const drawPoints = useMapDrawStore((s) => s.points);

  useEffect(() => {
    if (
      prevIsDrawing.current &&
      !isDrawing &&
      drawPoints.length >= 3 &&
      sourceMode === "draw"
    ) {
      const fromPoints: GeoJSON.Feature<GeoJSON.Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              ...drawPoints.map((p) => [p.lng, p.lat]),
              [drawPoints[0].lng, drawPoints[0].lat], // close ring
            ],
          ],
        },
      };
      setClippingPolygon(fromPoints);
    }
    prevIsDrawing.current = isDrawing;
  }, [isDrawing, drawPoints, sourceMode, setClippingPolygon]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fc = await parseShpToGeoJson(file);
      const polygon = extractFirstPolygon(fc);
      if (polygon) {
        setClippingPolygon(polygon);
      } else {
        alert("No valid polygon found in SHP file.");
      }
    } catch (err) {
      alert("Failed to parse SHP: " + String(err));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleHapusPolygon = () => {
    cancelDraw();
    setClippingPolygon(null);
  };

  const handleConfirmAndClip = () => {
    if (!clippingPolygon) return;
    void run(clippingPolygon);
  };

  const handleReset = () => {
    cancel();
    cancelDraw();
    reset();
  };

  const isProcessing = status === "fetching" || status === "clipping";

  return (
    <VStack
      gap={4}
      p={PADDING_SM}
      bg={"bg.panel"}
      rounded={"md"}
      borderWidth={"1px"}
      borderColor={"border.subtle"}
      w={"full"}
      maxW={"400px"}
      align={"stretch"}
    >
      <HStack justify={"space-between"}>
        <Heading size={"md"}>WFS Clip Tool</Heading>
        {status !== "idle" && (
          <Badge
            colorPalette={
              status === "done" ? "green" : status === "error" ? "red" : "blue"
            }
          >
            {status}
          </Badge>
        )}
      </HStack>

      <Field label={"WMS Base Layer"}>
        <HStack>
          <Switch
            checked={wmsVisible}
            onCheckedChange={(e: { checked: boolean }) =>
              setWmsVisible(e.checked)
            }
          />
          <P fontSize={"sm"}>{wmsVisible ? "Visible" : "Hidden"}</P>
        </HStack>
      </Field>

      {/* Source mode selector — hidden while processing */}
      {!isProcessing && (
        <Field label={"Clipping Source"}>
          <HStack w={"full"} gap={2}>
            <Button
              flex={1}
              variant={sourceMode === "draw" ? "solid" : "outline"}
              onClick={() => setSourceMode("draw")}
            >
              <IconPencil size={16} /> Draw
            </Button>
            <Button
              flex={1}
              variant={sourceMode === "upload" ? "solid" : "outline"}
              onClick={() => setSourceMode("upload")}
            >
              <IconFileUpload size={16} /> Upload SHP
            </Button>
          </HStack>
        </Field>
      )}

      {/* === DRAW MODE INPUT === */}
      {!isProcessing && sourceMode === "draw" && !clippingPolygon && (
        <Box p={3} borderWidth={"1px"} rounded={"md"} bg={"bg.muted"}>
          <VStack gap={2} align={"start"}>
            <P fontSize={"sm"}>
              Gambar polygon di peta sebagai batas area clipping.
            </P>
            <Button
              size={"sm"}
              colorPalette={isDrawing ? "red" : "blue"}
              onClick={() => {
                if (isDrawing) cancelDraw();
                else startDraw("polygon");
              }}
            >
              {isDrawing ? "Batalkan Drawing" : "Mulai Drawing"}
            </Button>
          </VStack>
        </Box>
      )}

      {/* === UPLOAD MODE INPUT === */}
      {!isProcessing && sourceMode === "upload" && !clippingPolygon && (
        <Box p={3} borderWidth={"1px"} rounded={"md"} bg={"bg.muted"}>
          <VStack gap={2} align={"start"}>
            <P fontSize={"sm"}>
              Upload file .zip yang berisi shapefile (.shp).
            </P>
            <Input
              type={"file"}
              accept={".zip"}
              ref={fileInputRef}
              onChange={handleFileUpload}
              size={"sm"}
              p={1}
            />
          </VStack>
        </Box>
      )}

      {/* === POLYGON READY: tampilkan 2 tombol konfirmasi === */}
      {clippingPolygon && !isProcessing && status !== "done" && (
        <Box
          p={3}
          borderWidth={"1px"}
          borderColor={"green.200"}
          rounded={"md"}
          bg={"green.subtle"}
        >
          <VStack gap={3} align={"stretch"}>
            <HStack gap={2}>
              <IconCheck size={16} color={"var(--chakra-colors-green-600)"} />
              <P fontSize={"sm"} color={"green.700"} fontWeight={"semibold"}>
                Polygon siap digunakan
              </P>
            </HStack>

            <HStack gap={2}>
              <Button
                flex={1}
                variant={"outline"}
                colorPalette={"red"}
                size={"sm"}
                onClick={handleHapusPolygon}
              >
                <IconTrash size={14} /> Hapus
              </Button>
              <Button
                flex={1}
                colorPalette={"blue"}
                size={"sm"}
                onClick={handleConfirmAndClip}
              >
                <IconCut size={14} /> Konfirmasi &amp; Clip
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {/* === SPINNER saat proses clipping === */}
      {isProcessing && (
        <Box
          p={4}
          borderWidth={"1px"}
          borderColor={"blue.200"}
          rounded={"md"}
          bg={"blue.subtle"}
        >
          <HStack gap={3}>
            <Loader color={"blue.500"} />
            <P fontSize={"sm"} color={"blue.700"} fontWeight={"medium"}>
              {CLIP_STATUS_LABELS[status] ?? "Memproses..."}
            </P>
          </HStack>
        </Box>
      )}

      {error && (
        <P fontSize={"sm"} color={"red.500"}>
          Error: {error}
        </P>
      )}

      {/* === HASIL === */}
      {status === "done" && clippedFeatures && (
        <Box p={3} bg={"green.subtle"} rounded={"md"}>
          <P fontSize={"sm"} fontWeight={"bold"} color={"green.700"}>
            Selesai!
          </P>
          <P fontSize={"sm"} color={"green.700"}>
            {clippedFeatures.features.length} fitur berhasil di-clip.
          </P>
        </Box>
      )}

      {/* Reset selalu tersedia kecuali saat processing */}
      {!isProcessing && (status !== "idle" || clippingPolygon) && (
        <Button variant={"outline"} size={"sm"} onClick={handleReset}>
          <IconTrash size={14} /> Reset Semua
        </Button>
      )}
    </VStack>
  );
};
