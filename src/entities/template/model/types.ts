export interface Template {
    id: string;
    name: string;
    description: string;
    isDeleted?: boolean;
}

export type TemplateSortField = "name" | "createdAt" | "updatedAt";

export interface TemplateState {
    page: number;
    pageSize: number;
    searchQuery: string;
    includeDeleted: boolean;
    sortBy: TemplateSortField | null;
    sortDescending: boolean;
}
