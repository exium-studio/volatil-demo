// src/features/mitra/data-request/api/mitra.data-request-calculation.api.ts

import type {
  CalculateSpatialCoverageRequest,
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamEvent,
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
  callbacks: {
    onEvent: (event: CalculateSpatialStreamEvent) => void;
    onError?: (error: Error) => void;
    onCompleted?: (result: CalculateSpatialCoverageResult) => void;
  },
  signal?: AbortSignal,
): Promise<void> {
  const endpoint = `${API_BASE_URL}/api/mitra/data-request/calculate/stream`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      credentials: "same-origin",
      body: JSON.stringify(request),
      signal,
    });

    // If server does not support SSE or is standard JSON response
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json") && response.ok) {
      const data = await response.json();
      const result: CalculateSpatialCoverageResult = data.data ?? data;
      callbacks.onEvent({
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
      callbacks.onEvent({
        type: "error",
        message: errorMsg,
      });
      callbacks.onError?.(err);
      return;
    }

    if (!response.body) {
      throw new Error("Response body is empty or stream not supported");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let jsonStr = trimmed;
        if (trimmed.startsWith("data:")) {
          jsonStr = trimmed.replace(/^data:\s*/, "");
        }

        if (jsonStr === "[DONE]") {
          return;
        }

        try {
          const event: CalculateSpatialStreamEvent = JSON.parse(jsonStr);
          callbacks.onEvent(event);
          if (event.type === "completed") {
            callbacks.onCompleted?.(event.data);
          }
        } catch {
          // Ignore invalid chunk JSON
        }
      }
    }
  } catch (error) {
    if (signal?.aborted) return;
    const err =
      error instanceof Error ? error : new Error("Stream connection failed");
    callbacks.onEvent({
      type: "error",
      message: err.message,
    });
    callbacks.onError?.(err);
  }
}
