import type {
  CalculateSpatialCalculatedItem,
  CalculateSpatialCoverageRequest,
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamCallbacks,
  RawCalculateSpatialItem,
  RawCalculateSpatialResponse,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";
import { getApiBaseUrl } from "@/shared/utils/url/url.utils";

export const normalizeSpatialCalculationResult = (
  raw: RawCalculateSpatialResponse | null | undefined,
): CalculateSpatialCoverageResult => {
  if (!raw) {
    return {
      kawasanCoveragePolygon: null,
      totalBidangCount: 0,
      totalKawasanCount: 0,
      totalKawasanAreaHa: 0,
      subtotalBidangPrice: 0,
      subtotalKawasanPrice: 0,
      estimatedTotalPrice: 0,
      isPurchaseLimitValid: true,
      items: [],
    };
  }

  const rawData = raw.data ?? raw;
  const calculationToken = rawData.calculationToken;
  const expiresInSeconds = rawData.expiresInSeconds;
  const coverageKawasan = rawData.coverageKawasan;
  const summary = rawData.summary;
  const validation = rawData.validation;

  const rawItems = rawData.items ?? [];
  const items: CalculateSpatialCalculatedItem[] = rawItems.map(
    (it: RawCalculateSpatialItem) => {
      const igtBasis = it.igtBasis ?? it.spatialBasis ?? "kawasan";
      const featureCount = it.featureCount ?? it.featuresCount ?? 0;
      const sourceLayerId = it.layerId ?? it.sourceLayerId ?? it.id ?? "";
      const sourceLayerTitle = it.title ?? it.sourceLayerTitle ?? sourceLayerId;

      return {
        id: it.id ?? sourceLayerId,
        layerId: sourceLayerId,
        sourceLayerId,
        sourceLayerTitle,
        title: sourceLayerTitle,
        igtBasis,
        spatialBasis: igtBasis,
        featureCount,
        featuresCount: featureCount,
        areaHa: it.areaHa ?? 0,
        unitPrice: it.unitPrice,
        subtotalPrice: it.subtotalPrice,
      };
    },
  );

  const totalBidangCount =
    summary?.bidang?.featureCount ??
    rawData.totalBidangCount ??
    items
      .filter((i) => i.igtBasis === "bidang")
      .reduce((sum, i) => sum + (i.featureCount || 0), 0);

  const totalKawasanCount =
    summary?.kawasan?.featureCount ??
    rawData.totalKawasanCount ??
    items
      .filter((i) => i.igtBasis === "kawasan")
      .reduce((sum, i) => sum + (i.featureCount || 0), 0);

  const totalKawasanAreaHa =
    coverageKawasan?.areaHa ?? rawData.totalKawasanAreaHa ?? 0;

  const subtotalBidangPrice =
    summary?.bidang?.subtotalPrice ?? rawData.subtotalBidangPrice ?? 0;

  const subtotalKawasanPrice =
    summary?.kawasan?.subtotalPrice ?? rawData.subtotalKawasanPrice ?? 0;

  const estimatedTotalPrice =
    summary?.totalPrice ??
    rawData.estimatedTotalPrice ??
    subtotalBidangPrice + subtotalKawasanPrice;

  const rawPolicy = rawData.policy ?? rawData.config;
  const policy = rawPolicy
    ? {
        minimumBidangCount:
          rawPolicy.minimumBidangCount ?? rawPolicy.minBidangCount,
        minimumKawasanHa: rawPolicy.minimumKawasanHa ?? rawPolicy.minKawasanHa,
        pricePerBidang: rawPolicy.pricePerBidang ?? rawPolicy.unitPriceBidang,
        pricePerKawasanHa:
          rawPolicy.pricePerKawasanHa ?? rawPolicy.unitPriceKawasan,
      }
    : undefined;

  const isPurchaseLimitValid =
    validation?.isValid !== undefined
      ? validation.isValid
      : (rawData.isPurchaseLimitValid ?? true);

  const purchaseLimitMessage =
    validation?.message ?? rawData.purchaseLimitMessage;

  const kawasanCoveragePolygon =
    coverageKawasan?.polygon ??
    rawData.kawasanCoveragePolygon ??
    null;

  return {
    calculationToken,
    expiresInSeconds,
    coverageKawasan,
    summary,
    policy,
    validation,
    kawasanCoveragePolygon,
    totalBidangCount,
    totalKawasanCount,
    totalKawasanAreaHa,
    subtotalBidangPrice,
    subtotalKawasanPrice,
    estimatedTotalPrice,
    isPurchaseLimitValid,
    purchaseLimitMessage,
    items,
  };
};

/**
 * Triggers spatial calculation (clipping & ST_Union) on Backend PostGIS via HTTP SSE Stream.
 * Supports streaming response via ReadableStream.
 */
export async function calculateSpatialCoverageStream(
  request: CalculateSpatialCoverageRequest,
  callbacks: CalculateSpatialStreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const baseUrl = getApiBaseUrl();
  const targetPath = `${baseUrl}/api/mitra/data-request/calculate/stream`;
  const url = baseUrl
    ? new URL(targetPath)
    : new URL(
        targetPath,
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:5173",
      );
  if (token) {
    url.searchParams.set("token", token);
  }
  const endpoint = url.toString();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: JSON.stringify(request),
      signal,
    });

    // If server does not support SSE or returns standard JSON response
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json") && response.ok) {
      const data = await response.json();
      const result: CalculateSpatialCoverageResult =
        normalizeSpatialCalculationResult(data);
      callbacks.onEvent?.({
        type: "completed",
        data: result,
      });
      callbacks.onCompleted?.(result);
      return;
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Kalkulasi spasial gagal (${response.status})`;
      try {
        const parsed = JSON.parse(errorText);
        errorMsg = parsed.message || errorMsg;
      } catch {
        // fallback text
      }
      const err = new Error(errorMsg);
      callbacks.onError?.(err);
      return;
    }

    if (!response.body) {
      throw new Error("Response body is empty or stream not supported");
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // Simpan baris terakhir yang belum lengkap

      let currentEvent = "";
      let currentData = "";

      for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith("event:")) {
          currentEvent = trimmed.slice(6).trim();
        } else if (trimmed.startsWith("data:")) {
          currentData = trimmed.slice(5).trim();
        } else if (trimmed === "") {
          // Baris kosong = 1 blok pesan SSE selesai
          if (currentData === "[DONE]" || currentEvent === "end") {
            // Sinyal terminasi stream
            try {
              await reader.cancel();
            } catch {
              // ignore
            }
            return;
          }

          if (currentEvent === "connected") {
            callbacks.onConnected?.();
            callbacks.onEvent?.({
              type: "connected",
              message: "Koneksi stream siap",
            });
          } else if (currentEvent === "progress") {
            try {
              const parsed = JSON.parse(currentData);
              callbacks.onProgress?.(parsed);
              callbacks.onEvent?.({
                type: "progress",
                stage: parsed.stage ?? "clipping",
                percentage: parsed.percentage ?? 0,
                message: parsed.message ?? "",
                currentLayer: parsed.currentLayer,
                totalLayers: parsed.totalLayers,
                currentFeature: parsed.currentFeature,
                totalFeatures: parsed.totalFeatures,
              });
            } catch {
              // ignore malformed progress JSON
            }
          } else if (currentEvent === "completed") {
            try {
              const parsed = JSON.parse(currentData);
              const result: CalculateSpatialCoverageResult =
                normalizeSpatialCalculationResult(parsed);
              callbacks.onCompleted?.(result);
              callbacks.onEvent?.({
                type: "completed",
                data: result,
              });

              // Jika backend menyertakan done: true
              if (parsed.done) {
                try {
                  await reader.cancel();
                } catch {
                  // ignore
                }
                return;
              }
            } catch {
              // ignore malformed completed JSON
            }
          } else if (currentEvent === "error") {
            let errMsg = "Terjadi kesalahan kalkulasi spasial";
            try {
              const parsed = JSON.parse(currentData);
              errMsg = parsed.message ?? errMsg;
            } catch {
              // ignore
            }
            const err = new Error(errMsg);
            callbacks.onError?.(err);
            try {
              await reader.cancel();
            } catch {
              // ignore
            }
            return;
          } else if (currentData) {
            // Fallback parsing jika event type tidak dituliskan secara eksplisit
            try {
              const parsed = JSON.parse(currentData);
              if (parsed.type === "progress") {
                callbacks.onProgress?.(parsed);
                callbacks.onEvent?.(parsed);
              } else if (
                parsed.type === "completed" ||
                parsed.done === true ||
                parsed.coverageKawasan !== undefined ||
                parsed.totalBidangCount !== undefined
              ) {
                const result: CalculateSpatialCoverageResult =
                  normalizeSpatialCalculationResult(parsed);
                callbacks.onCompleted?.(result);
                callbacks.onEvent?.({
                  type: "completed",
                  data: result,
                });
                if (parsed.done) {
                  try {
                    await reader.cancel();
                  } catch {
                    // ignore
                  }
                  return;
                }
              }
            } catch {
              // ignore non-JSON data
            }
          }

          // Reset untuk blok event berikutnya
          currentEvent = "";
          currentData = "";
        }
      }
    }
  } catch (error) {
    if (signal?.aborted) return;
    if (
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      !navigator.onLine
    ) {
      window.dispatchEvent(new CustomEvent("app:network-offline"));
    }
    const err =
      error instanceof Error ? error : new Error("Stream connection failed");
    callbacks.onError?.(err);
  } finally {
    if (reader) {
      try {
        await reader.cancel();
      } catch {
        // Reader may already be closed
      }
    }
  }
}
