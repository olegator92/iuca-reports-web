export interface ResultEnvelope<T> {
    data?: T | null;
    message?: string;
    errorCode?: string | null;
    traceId?: string | null;
    errorDetails?: string | null;
}

export interface PaginatedResponse<T> {
    data?: T[] | null;
    totalCount?: number | null;
    page?: number | null;
    pageSize?: number | null;
    totalPages?: number | null;
    hasPreviousPage?: boolean | null;
    hasNextPage?: boolean | null;
}

