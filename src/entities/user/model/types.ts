import type { Position } from "@/entities/position";

export interface User {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    profilePhotoUrl: string | null;
    roles: string[];
    positions: Position[];
    createdAt: string;
}

export type UserSortField = "fullName" | "email" | "createdAt";

export interface UserState {
    page: number;
    pageSize: number;
    searchQuery: string;
    filterIsActive: boolean | null;
    filterRoleName: string | null;
    sortBy: UserSortField | null;
    sortDescending: boolean;
}

// Request types
export interface CreateUserRequest {
    email: string;
    fullName: string;
    password?: string;
}

export interface UpdateUserRequest {
    email: string;
    fullName: string;
    password?: string;
}

export interface AssignRoleRequest {
    userId: string;
    roleId: string;
}

export interface AssignPositionRequest {
    userId: string;
    positionId: string;
}

// Response types (API returns ResultEnvelope wrapper)
export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    isActive: boolean;
    profilePhotoUrl: string | null;
    roles: string[];
    positions: Position[];
    createdAt: string;
}
