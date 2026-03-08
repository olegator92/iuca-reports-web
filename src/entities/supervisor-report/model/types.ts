export interface SupervisorReport {
    id: string;
    dateFrom: string;           // yyyy-MM-dd
    dateTo: string;             // yyyy-MM-dd
    content: string | null;
    createdAt: string;          // ISO 8601
    updatedAt: string | null;   // ISO 8601
}

export interface SupervisorUser {
    userId: string;
    fullName: string;
}

export interface SupervisorPosition {
    positionId: string;
    positionName: string;
    users: SupervisorUser[];
}

export interface SupervisorDepartmentNode {
    departmentId: string;
    departmentName: string;
    positions: SupervisorPosition[];
    subDepartments: SupervisorDepartmentNode[];
}

export interface SupervisorReportFilter {
    userId: string;
    positionId: string;
}

export interface SupervisorReportParams {
    dateStart: string;          // yyyy-MM-dd
    dateEnd: string;            // yyyy-MM-dd
    filters: SupervisorReportFilter[];
}

