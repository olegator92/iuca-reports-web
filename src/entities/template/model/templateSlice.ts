import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TemplateState, TemplateSortField } from "./types";

const DEFAULT_PAGE_SIZE = 10;

const initialState: TemplateState = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    searchQuery: "",
    includeDeleted: false,
    sortBy: null,
    sortDescending: false
};

const templateSlice = createSlice({
    name: "template",
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
        setSortBy: (state, action: PayloadAction<TemplateSortField | null>) => {
            state.sortBy = action.payload;
            state.page = 1;
        },
        setSortDescending: (state, action: PayloadAction<boolean>) => {
            state.sortDescending = action.payload;
            state.page = 1;
        },
        setSort: (state, action: PayloadAction<{ sortBy: TemplateSortField | null; sortDescending: boolean }>) => {
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
} = templateSlice.actions;
export default templateSlice.reducer;
