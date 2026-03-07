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
} from "./api/supervisorReportApi";
