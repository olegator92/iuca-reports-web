export interface ApiErrorParams {
    message: string;
    traceId?: string | null;
    errorCode?: string | null;
    details?: string | null;
    status?: number;
    cause?: unknown;
}

export class ApiError extends Error {
    public readonly traceId?: string | null;
    public readonly errorCode?: string | null;
    public readonly details?: string | null;
    public readonly status?: number;

    constructor({ message, traceId, errorCode, details, status, cause }: ApiErrorParams) {
        super(message, { cause });
        this.name = "ApiError";
        this.traceId = traceId ?? undefined;
        this.errorCode = errorCode ?? undefined;
        this.details = details ?? undefined;
        this.status = status;
    }
}
