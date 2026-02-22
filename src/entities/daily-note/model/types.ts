export interface DailyNote {
    id: string;
    content: string;
    noteDate: string;
    userId: string;
    positionId: string;
    positionName: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: string | null;
}

export interface DailyNoteListResponse {
    data: DailyNote[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface CreateDailyNoteRequest {
    content: string;
    noteDate: string;
    positionId: string;
}

export interface UpdateDailyNoteRequest {
    content: string;
    noteDate: string;
    positionId: string;
}

export type DailyNoteSortField = "noteDate" | "createdAt";

export interface DailyNoteState {
    currentDate: string;
    currentPositionId: string | null;
    loadedOldestPage: number;
    pageSize: number;
}
