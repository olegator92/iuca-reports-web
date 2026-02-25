import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PositionState, PositionSortField } from "./types";

const DEFAULT_PAGE_SIZE = 12;

const initialState: PositionState = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    searchQuery: "",
    includeDeleted: false,
    sortBy: null,
    sortDescending: false
};

const positionSlice = createSlice({
    name: "position",
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
        setSortBy: (state, action: PayloadAction<PositionSortField | null>) => {
            state.sortBy = action.payload;
            state.page = 1;
        },
        setSortDescending: (state, action: PayloadAction<boolean>) => {
            state.sortDescending = action.payload;
            state.page = 1;
        },
        setSort: (state, action: PayloadAction<{ sortBy: PositionSortField | null; sortDescending: boolean }>) => {
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
} = positionSlice.actions;
export default positionSlice.reducer;
