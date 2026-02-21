export interface Department {
    id: string;
    name: string;
    parentDepartmentId: string | null;
    parentDepartmentName: string | null;
    subDepartments: Department[];
    createdBy: string | null;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface CreateDepartmentDto {
    name: string;
    parentDepartmentId: string | null;
}

export interface UpdateDepartmentDto {
    name: string;
    parentDepartmentId: string | null;
}

export interface DepartmentListResponse {
    data: Department[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface DepartmentListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string | null;
    sortDescending?: boolean;
    includeDeleted?: boolean;
}

export type DepartmentSortField = "name" | "createdAt" | "updatedAt";

export interface DepartmentState {
    page: number;
    pageSize: number;
    searchQuery: string;
    includeDeleted: boolean;
    sortBy: DepartmentSortField | null;
    sortDescending: boolean;
}
