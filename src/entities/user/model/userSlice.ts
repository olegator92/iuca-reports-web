import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState, UserSortField } from "./types";

const initialState: UserState = {
    page: 1,
    pageSize: 10,
    searchQuery: "",
    filterIsActive: null,
    filterRoleName: null,
    sortBy: null,
    sortDescending: false
};

const userSlice = createSlice({
    name: "user",
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
        setFilterIsActive: (state, action: PayloadAction<boolean | null>) => {
            state.filterIsActive = action.payload;
            state.page = 1;
        },
        setFilterRoleName: (state, action: PayloadAction<string | null>) => {
            state.filterRoleName = action.payload;
            state.page = 1;
        },
        setSortBy: (state, action: PayloadAction<UserSortField | null>) => {
            state.sortBy = action.payload;
            state.page = 1;
        },
        setSortDescending: (state, action: PayloadAction<boolean>) => {
            state.sortDescending = action.payload;
            state.page = 1;
        },
        setSort: (state, action: PayloadAction<{ sortBy: UserSortField | null; sortDescending: boolean }>) => {
            state.sortBy = action.payload.sortBy;
            state.sortDescending = action.payload.sortDescending;
            state.page = 1;
        },
        resetFilters: (state) => {
            state.filterIsActive = null;
            state.filterRoleName = null;
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
    setFilterIsActive,
    setFilterRoleName,
    setSortBy,
    setSortDescending,
    setSort,
    resetFilters
} = userSlice.actions;

export default userSlice.reducer;
