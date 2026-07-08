// src/shared/utils/client/client.storage.ts

export function setStorage(
  key: string,
  value: string,
  type: "local" | "session" = "local",
  expireInMs?: number,
): void {
  if (window.document === undefined) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  const payload = {
    value,
    expireAt: typeof expireInMs === "number" ? Date.now() + expireInMs : null,
  };
  storage.setItem(key, JSON.stringify(payload));
}

export function getStorage(
  key: string,
  type: "local" | "session" = "local",
): string | null {
  if (window.document === undefined) return null;
  const storage = type === "local" ? localStorage : sessionStorage;
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.expireAt && Date.now() > parsed.expireAt) {
      storage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return raw;
  }
}

export function removeStorage(
  key: string,
  type: "local" | "session" = "local",
): void {
  if (window.document === undefined) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.removeItem(key);
}

export function doCall(phoneNumber: string) {
  const sanitizedPhone = phoneNumber.trim().replace(/[^0-9+]/g, "");
  const testLink = document.createElement("a");
  testLink.href = `tel:${sanitizedPhone}`;
  if (testLink.protocol === "tel:") {
    window.location.href = testLink.href;
  } else {
    alert("This device does not support phone calls.");
  }
}
