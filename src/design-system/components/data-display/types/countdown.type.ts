import type { PProps } from "@/design-system/components/typography/types/p.type";

export type CountdownProps = Omit<PProps, "children"> & {
  finishedAt: string | Date;
  format?: string;
};
