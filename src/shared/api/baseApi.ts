import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const rtkApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Template", "CurrentUser", "Role", "Permission", "User", "Department"],
    endpoints: () => ({})
});
