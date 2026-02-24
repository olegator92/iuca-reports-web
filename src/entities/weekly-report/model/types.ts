export type WeeklyReportStatus = "InProgress" | "Generated";

export interface WeeklyReport {
    id: string;
    weekStartDate: string;           // yyyy-MM-dd
    weekEndDate: string;             // yyyy-MM-dd
    status: WeeklyReportStatus;
    content: string | null;          // null when InProgress with no daily reports
    hasUnprocessedUpdates: boolean;
    userId: string;
    positionId: string;
    positionName: string | null;
    departmentName: string | null;
    createdBy: string | null;
    createdAt: string;               // ISO 8601 UTC
    updatedBy: string | null;
    updatedAt: string | null;        // ISO 8601 UTC
}

export interface UpdateWeeklyReportContentDto {
    content: string;                 // required; max 50 000 chars
    status: WeeklyReportStatus;
}

export interface GenerateWeeklyReportDto {
    weekStart: string;               // yyyy-MM-dd
    weekEnd: string;                 // yyyy-MM-dd
    positionId: string;
}
