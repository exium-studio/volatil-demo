// src/shared/utils/user/user-session.utils.ts

import type { User } from "@/shared/types/common-response.type";
import { getStorage } from "@/shared/utils/client/client.storage";

/**
 * Low-level utility to retrieve the raw parsed User object from client storage.
 * Free from UI dependencies and usable across the entire design system and shell.
 */
export const getUserSession = (): User | null => {
  const raw = getStorage("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};
