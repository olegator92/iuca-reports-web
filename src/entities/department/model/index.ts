import type { Department, DepartmentSupervisor, CreateDepartmentDto, UpdateDepartmentDto, DepartmentListParams, DepartmentSortField, DepartmentState } from "./types";
import departmentReducer, {
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} from "./departmentSlice";

export type { Department, DepartmentSupervisor, CreateDepartmentDto, UpdateDepartmentDto, DepartmentListParams, DepartmentSortField, DepartmentState };
export {
    departmentReducer,
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
};

export {
    departmentApi,
    useGetDepartmentsQuery,
    useLazyGetDepartmentsQuery,
    useGetAllDepartmentsQuery,
    useGetDepartmentHierarchyQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useRestoreDepartmentMutation,
    useAssignDepartmentSupervisorMutation,
    useRemoveDepartmentSupervisorMutation
} from "../api/departmentApi";
