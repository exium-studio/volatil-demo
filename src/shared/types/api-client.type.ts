<<<<<<< HEAD
// src/shared/types/api-client.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
export type RequestOptions = Omit<RequestInit, "body"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  toastId?: string;
};
