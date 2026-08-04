export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    perPage: number;
    total: number; // grand total items
    totalPages: number;
  };
};
