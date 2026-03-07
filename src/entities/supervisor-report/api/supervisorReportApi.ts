import { rtkApi } from "@/shared/api/baseApi";
import type {
    SupervisorReportParams,
    SupervisorDepartmentNode,
} from "../model/types";

export const supervisorReportApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getSupervisorReport: build.mutation<string | null, SupervisorReportParams>({
            query: (params) => ({
                url: `/supervisor-reports`,
                method: "POST",
                body: params,
            }),
            transformResponse: (response: { data: string | null }) =>
                response.data ?? null,
            extraOptions: { suppress404: true, suppress409: true },
        }),
        getSupervisorDepartments: build.query<SupervisorDepartmentNode[], void>({
            query: () => "/supervisor-reports/departments",
            transformResponse: (response: { data: SupervisorDepartmentNode[] }) =>
                response.data ?? [],
            providesTags: ["SupervisorReport"],
            extraOptions: { suppress404: true, suppress409: true },
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSupervisorReportMutation,
    useGetSupervisorDepartmentsQuery,
} = supervisorReportApi;
