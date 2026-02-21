import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DepartmentState, DepartmentSortField } from "./types";

const DEFAULT_PAGE_SIZE = 10;

const initialState: DepartmentState = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    searchQuery: "",
    includeDeleted: false,
    sortBy: null,
    sortDescending: false
};

const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.page = 1;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
            state.page = 1;
        },
        setIncludeDeleted: (state, action: PayloadAction<boolean>) => {
            state.includeDeleted = action.payload;
            state.page = 1;
        },
        setSortBy: (state, action: PayloadAction<DepartmentSortField | null>) => {
            state.sortBy = action.payload;
            state.page = 1;
        },
        setSortDescending: (state, action: PayloadAction<boolean>) => {
            state.sortDescending = action.payload;
            state.page = 1;
        },
        setSort: (state, action: PayloadAction<{ sortBy: DepartmentSortField | null; sortDescending: boolean }>) => {
            state.sortBy = action.payload.sortBy;
            state.sortDescending = action.payload.sortDescending;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.includeDeleted = false;
            state.sortBy = null;
            state.sortDescending = false;
            state.page = 1;
        }
    }
});

export const {
    setPage,
    setSearchQuery,
    setPageSize,
    setIncludeDeleted,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} = departmentSlice.actions;
export default departmentSlice.reducer;
