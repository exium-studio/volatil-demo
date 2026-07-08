// src/shared/utils/client/navigation.ts

let lastBackAt = 0;

export function back(depth?: number) {
  if (typeof window === "undefined") {
    return;
  }

  const now = Date.now();

  if (now - lastBackAt < 300) {
    return;
  }

  lastBackAt = now;

  if (depth && depth > 1) {
    window.history.go(-depth);
  } else {
    window.history.back();
  }
}
