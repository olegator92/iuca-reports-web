export interface Role {
    id: string;
    name: string;
    isSystemRole: boolean;
    permissions: string[];
}

export interface RoleState {
    page: number;
    pageSize: number;
    searchQuery: string;
}

// Request types
export interface CreateRoleRequest {
    name: string;
}

export interface UpdateRoleRequest {
    name: string;
}

export interface AssignPermissionsRequest {
    roleId: string;
    permissions: string[];
}

// Response types (API returns ResultEnvelope wrapper)
export interface RoleResponse {
    id: string;
    name: string;
    isSystemRole: boolean;
    permissions: string[];
}

export interface PermissionResponse {
    data: string[];
}
