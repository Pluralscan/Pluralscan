export interface Page<T> {
    items: T[];
    pagination: Pagination
}

export interface Pagination {
    pageIndex: number;
    pageSize: number;
    itemCount: number;
    pageCount: number
}