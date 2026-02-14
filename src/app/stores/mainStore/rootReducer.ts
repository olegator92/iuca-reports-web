import { combineReducers } from "@reduxjs/toolkit";
import { templateReducer } from "@/entities/template/model";
import { authReducer } from "@/entities/auth";
import { roleReducer } from "@/entities/role";
import { userReducer } from "@/entities/user/model";
import { rtkApi } from "@/shared/api";

export const rootReducer = combineReducers({
    auth: authReducer,
    template: templateReducer,
    role: roleReducer,
    user: userReducer,
    [rtkApi.reducerPath]: rtkApi.reducer
});
