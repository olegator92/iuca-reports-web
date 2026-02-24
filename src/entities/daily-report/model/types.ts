export type DailyReportStatus = "InProgress" | "Generated";

export interface DailyReport {
    id: string;
    reportDate: string;           // yyyy-MM-dd
    status: DailyReportStatus;
    content: string | null;       // null until generated
    hasUnprocessedUpdates: boolean;
    userId: string;
    positionId: string;
    positionName: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface UpdateReportContentDto {
    content: string;              // required, max 20 000 chars
    status: DailyReportStatus;
}

export interface GenerateReportDto {
    date: string;
    positionId: string;
}

export interface GetDailyReportsByRangeDto {
    dateFrom: string;   // yyyy-MM-dd
    dateTo: string;     // yyyy-MM-dd
}
