import type { Template, TemplateSortField } from "./types";
import templateReducer, {
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} from "./templateSlice";

export type { Template, TemplateSortField };
export {
    templateReducer,
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
    templateApi,
    useGetTemplatesQuery,
    useLazyGetTemplatesQuery,
    useGetTemplateByIdQuery,
    useAddTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation
} from "../api/templateApi";
