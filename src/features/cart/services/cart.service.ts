// src/features/cart/services/cart.service.ts

import type {
  CartItem,
  CartItemsResponse,
} from "@/features/cart/types/cart.type";
import type { PaginatedParams } from "@/shared/types/common-response.type";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const matchesSearch = (item: CartItem, search: string) => {
  const searchableValues = [
    item.id,
    item.name,
    item.basis,
    item.description,
    ...item.themes.flatMap((theme) => [theme.name, theme.description]),
  ];

  return searchableValues.some((value) =>
    value?.toLocaleLowerCase().includes(search),
  );
};

export const getPaginatedCartItems = (
  cartItems: CartItem[],
  params: PaginatedParams = {},
): CartItemsResponse => {
  const page = Math.max(DEFAULT_PAGE, params.page ?? DEFAULT_PAGE);
  const pageSize = Math.max(DEFAULT_PAGE, params.pageSize ?? DEFAULT_PAGE_SIZE);
  const search = params.search?.trim().toLocaleLowerCase();
  const filteredItems = search
    ? cartItems.filter((item) => matchesSearch(item, search))
    : cartItems;
  const startIndex = (page - 1) * pageSize;

  return {
    items: filteredItems.slice(startIndex, startIndex + pageSize),
    meta: {
      page,
      pageSize,
      total: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / pageSize),
    },
  };
};
