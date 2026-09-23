// src/features/mitra/data-request/api/mitra.data-request-calculation.api.ts

import type {
  CalculateSpatialCoverageRequest,
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamCallbacks,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://9ac2a7d6-05ee-4c71-a067-b15fb595b85a.mock.pstmn.io";


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
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const url = new URL(`${baseUrl}/api/mitra/data-request/calculate/stream`);
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
      const result: CalculateSpatialCoverageResult = data.data ?? data;
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
      callbacks.onEvent?.({
        type: "error",
        message: errorMsg,
      });
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
                parsed.data ?? parsed;
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
            try {
              const parsed = JSON.parse(currentData);
              const errMsg =
                parsed.message ?? "Terjadi kesalahan kalkulasi spasial";
              const err = new Error(errMsg);
              callbacks.onEvent?.({
                type: "error",
                message: errMsg,
              });
              callbacks.onError?.(err);
            } catch {
              const err = new Error("Terjadi kesalahan kalkulasi spasial");
              callbacks.onError?.(err);
            }
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
                parsed.totalBidangCount !== undefined
              ) {
                const result: CalculateSpatialCoverageResult =
                  parsed.data ?? parsed;
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
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("app:network-offline"));
    }
    const err =
      error instanceof Error ? error : new Error("Stream connection failed");
    callbacks.onEvent?.({
      type: "error",
      message: err.message,
    });
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

