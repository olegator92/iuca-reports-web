import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RoleState } from "./types";

const initialState: RoleState = {
    page: 1,
    pageSize: 10,
    searchQuery: ""
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.page = 1; // Reset to first page on search
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
            state.page = 1; // Reset to first page when changing page size
        },
        resetRoleState: () => initialState
    }
});

export const { setPage, setSearchQuery, setPageSize, resetRoleState } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
