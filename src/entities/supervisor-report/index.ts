export type {
    SupervisorReportParams,
    SupervisorReportFilter,
    SupervisorDepartmentNode,
    SupervisorPosition,
    SupervisorUser,
} from "./model/types";

export {
    supervisorReportApi,
    useGetSupervisorReportMutation,
    useGetSupervisorDepartmentsQuery,
    useGetSupervisorDailyReportMutation,
    useGetSupervisorDailyDepartmentsQuery,
} from "./api/supervisorReportApi";
