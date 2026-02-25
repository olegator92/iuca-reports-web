export interface Position {
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export type PositionSortField = "name" | "createdAt" | "updatedAt";

export interface PositionState {
    page: number;
    pageSize: number;
    searchQuery: string;
    includeDeleted: boolean;
    sortBy: PositionSortField | null;
    sortDescending: boolean;
}

export interface CreatePositionRequest {
    name: string;
    departmentId: string;
}

export interface UpdatePositionRequest {
    name: string;
    departmentId: string;
}

export interface PositionResponse {
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface PagedPositionResponse {
    data: Position[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
