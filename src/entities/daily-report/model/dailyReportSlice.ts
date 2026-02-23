import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DailyReportState {
    currentDate: string;
    currentPositionId: string | null;
}

const getTodayString = (): string => new Date().toISOString().split("T")[0];

const initialState: DailyReportState = {
    currentDate: getTodayString(),
    currentPositionId: null
};

const dailyReportSlice = createSlice({
    name: "dailyReport",
    initialState,
    reducers: {
        setCurrentDate: (state, action: PayloadAction<string>) => {
            state.currentDate = action.payload;
        },
        setCurrentPosition: (state, action: PayloadAction<string>) => {
            state.currentPositionId = action.payload;
        }
    }
});

export const { setCurrentDate, setCurrentPosition } = dailyReportSlice.actions;
export const dailyReportReducer = dailyReportSlice.reducer;
export default dailyReportSlice.reducer;
