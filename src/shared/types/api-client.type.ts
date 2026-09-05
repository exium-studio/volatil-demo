// src/shared/types/api-client.type.ts

export type RequestOptions = Omit<RequestInit, "body"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  toastId?: string;
};
