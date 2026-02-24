import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getWorkWeekBounds } from "@/shared/lib";

interface WeeklyReportState {
    currentWeekStart: string;        // yyyy-MM-dd
    currentWeekEnd: string;          // yyyy-MM-dd
    currentPositionId: string | null;
}

const { weekStart, weekEnd } = getWorkWeekBounds(new Date());

const initialState: WeeklyReportState = {
    currentWeekStart: weekStart,
    currentWeekEnd: weekEnd,
    currentPositionId: null
};

const weeklyReportSlice = createSlice({
    name: "weeklyReport",
    initialState,
    reducers: {
        setWeek: (state, action: PayloadAction<{ weekStart: string; weekEnd: string }>) => {
            state.currentWeekStart = action.payload.weekStart;
            state.currentWeekEnd = action.payload.weekEnd;
        },
        setCurrentPosition: (state, action: PayloadAction<string>) => {
            state.currentPositionId = action.payload;
        }
    }
});

export const { setWeek, setCurrentPosition } = weeklyReportSlice.actions;
export const weeklyReportReducer = weeklyReportSlice.reducer;
export default weeklyReportSlice.reducer;
