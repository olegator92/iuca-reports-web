import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DailyNoteState } from "./types";

const DEFAULT_PAGE_SIZE = 30;

const initialState: DailyNoteState = {
    currentDate: new Date().toISOString().split("T")[0],
    currentPositionId: null,
    loadedOldestPage: 1,
    pageSize: DEFAULT_PAGE_SIZE
};

const dailyNoteSlice = createSlice({
    name: "dailyNote",
    initialState,
    reducers: {
        setCurrentDate: (state, action: PayloadAction<string>) => {
            state.currentDate = action.payload;
            state.loadedOldestPage = 1;
        },
        setCurrentPosition: (state, action: PayloadAction<string | null>) => {
            state.currentPositionId = action.payload;
            state.loadedOldestPage = 1;
        },
        incrementOldestPage: (state) => {
            state.loadedOldestPage += 1;
        },
        resetChat: (state) => {
            state.loadedOldestPage = 1;
        }
    }
});

export const { setCurrentDate, setCurrentPosition, incrementOldestPage, resetChat } = dailyNoteSlice.actions;
export default dailyNoteSlice.reducer;
