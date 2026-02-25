export type {
    Position,
    PositionSortField,
    PositionState,
    CreatePositionRequest,
    UpdatePositionRequest,
    PositionResponse,
    PagedPositionResponse
} from "./types";

export {
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} from "./positionSlice";

export { default as positionReducer } from "./positionSlice";

// Re-export API hooks for convenience
export {
    positionApi,
    useGetPositionsQuery,
    useLazyGetPositionsQuery,
    useGetAllPositionsQuery,
    useGetPositionByIdQuery,
    useCreatePositionMutation,
    useUpdatePositionMutation,
    useDeletePositionMutation,
    useRestorePositionMutation
} from "../api/positionApi";

export type { GetPositionsParams, GetPositionsResult } from "../api/positionApi";
