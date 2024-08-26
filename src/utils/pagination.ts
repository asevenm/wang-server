import { IPaginationOptions, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { PaginationParams } from 'src/types/common';

export const MAX_PAGE_SIZE = 100;

export const defaultPaginationParams: PaginationParams = {
  currentPage: 1,
  pageSize: 10,
};

export class CustomPaginationMeta {
  constructor(
    public currentPage: number,
    public pageSize: number,
    public totalPages: number,
    public total: number,
  ) {}
}

export const getPaginationOptions = (
  page: PaginationParams = {
    currentPage: defaultPaginationParams.currentPage,
    pageSize: defaultPaginationParams.pageSize,
  },
) => {
  const limit = page.pageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : page.pageSize;
  console.log(page.currentPage, limit);
  const options: IPaginationOptions<CustomPaginationMeta> = {
    page: page.currentPage,
    limit,
    metaTransformer: (meta: IPaginationMeta): CustomPaginationMeta => {
      console.log(meta);
      return new CustomPaginationMeta(
        meta.currentPage,
        meta.itemsPerPage,
        meta.totalPages,
        meta.totalItems,
      );
    },
  };
  return options;
};
