import { combineReducers } from "@reduxjs/toolkit";
import { templateReducer } from "@/entities/template/model";
import { authReducer } from "@/entities/auth";
import { roleReducer } from "@/entities/role";
import { userReducer } from "@/entities/user/model";
import { departmentReducer } from "@/entities/department/model";
import { positionReducer } from "@/entities/position";
import { dailyNoteReducer } from "@/entities/daily-note";
import { dailyReportReducer } from "@/entities/daily-report";
import { rtkApi } from "@/shared/api";

export const rootReducer = combineReducers({
    auth: authReducer,
    template: templateReducer,
    role: roleReducer,
    user: userReducer,
    department: departmentReducer,
    position: positionReducer,
    dailyNote: dailyNoteReducer,
    dailyReport: dailyReportReducer,
    [rtkApi.reducerPath]: rtkApi.reducer
});
