import type {
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";

const matchesSearch = (item: MyDataItem, search: string) =>
  [
    item.id,
    item.name,
    item.basis,
    item.purchasedBy.name,
    item.purchasedBy.email,
    item.transactionStatus,
    item.wfsUrl,
  ].some((value) => value?.toLocaleLowerCase().includes(search));

export const getPaginatedMyData = (
  items: MyDataItem[],
  params: MyDataQueryParams,
): MyDataResponse => {
  const search = params.search?.trim().toLocaleLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesStatus = item.status === params.status;
    const matchesWfs =
      !params.wfs ||
      (params.wfs === "available" ? Boolean(item.wfsUrl) : !item.wfsUrl);
    const matchesQuery = !search || matchesSearch(item, search);
    return matchesStatus && matchesWfs && matchesQuery;
  });
  const startIndex = (params.page - 1) * params.pageSize;

  return {
    items: filteredItems.slice(startIndex, startIndex + params.pageSize),
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      total: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / params.pageSize),
    },
  };
};
