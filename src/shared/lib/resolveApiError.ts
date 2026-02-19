import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ApiError } from "@/shared/api/errors";
import i18n from "@/shared/config/i18n";

export interface ResolvedApiError {
    message: string;
    traceId?: string;
    errorCode?: string;
    details?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const extractFromPayload = (payload: unknown) => {
    if (!isRecord(payload)) {
        return {};
    }

    const message = typeof payload.message === "string" ? payload.message : undefined;
    const traceId = typeof payload.traceId === "string" ? payload.traceId : undefined;
    const errorCode = typeof payload.errorCode === "string" ? payload.errorCode : undefined;
    const details = typeof payload.errorDetails === "string" ? payload.errorDetails : undefined;

    if (!message && isRecord(payload.data) && typeof payload.data.message === "string") {
        return {
            message: payload.data.message,
            traceId,
            errorCode,
            details
        };
    }

    return { message, traceId, errorCode, details };
};

const TRACELESS_ERROR_CODES = new Set(["VALIDATIONEXCEPTION", "BUSINESSEXCEPTION"]);

const shouldHideTraceId = (errorCode?: string) => {
    if (!errorCode) {
        return false;
    }

    return TRACELESS_ERROR_CODES.has(errorCode.toUpperCase());
};

const enhanceResolvedError = (error: ResolvedApiError): ResolvedApiError => {
    const { message, traceId, errorCode } = error;

    if (!traceId) {
        return error;
    }

    if (shouldHideTraceId(errorCode)) {
        return {
            ...error,
            traceId: undefined
        };
    }

    if (!message || message.includes(traceId)) {
        return error;
    }

    return {
        ...error,
        message: `${message}`
    };
};

const fromFetchBaseQueryError = (error: FetchBaseQueryError): ResolvedApiError => {
    const base = extractFromPayload("data" in error ? error.data : undefined);
    const numericStatus = typeof error.status === "number" ? error.status : undefined;
    const stringStatus = typeof error.status === "string" ? error.status : undefined;
    const isServerError = typeof numericStatus === "number" && numericStatus >= 500;
    const isNetworkError = stringStatus === "FETCH_ERROR";

    const errorMessage = "error" in error && typeof error.error === "string" ? error.error : undefined;

    const message =
        base.message ||
        base.details ||
        (isServerError || isNetworkError ? i18n.t("errors.serverUnavailable") : undefined) ||
        (errorMessage && !isNetworkError ? errorMessage : undefined) ||
        stringStatus;

    return enhanceResolvedError({
        message: message || i18n.t("errors.requestFailed"),
        traceId: base.traceId,
        errorCode: base.errorCode,
        details: base.details
    });
};

const fromSerializedError = (error: SerializedError): ResolvedApiError => ({
    message: error.message || i18n.t("errors.requestFailed"),
    traceId: undefined,
    errorCode: undefined,
    details: undefined
});

export const resolveApiError = (error: unknown): ResolvedApiError => {
    if (error instanceof ApiError) {
        return enhanceResolvedError({
            message: error.message,
            traceId: error.traceId ?? undefined,
            errorCode: error.errorCode ?? undefined,
            details: error.details ?? undefined
        });
    }

    if (isRecord(error) && "status" in error) {
        return fromFetchBaseQueryError(error as FetchBaseQueryError);
    }

    if (isRecord(error) && ("message" in error || "code" in error)) {
        return enhanceResolvedError(fromSerializedError(error as SerializedError));
    }

    if (typeof error === "string") {
        return enhanceResolvedError({
            message: error,
            traceId: undefined,
            errorCode: undefined,
            details: undefined
        });
    }

    if (error instanceof Error) {
        return enhanceResolvedError({
            message: error.message,
            traceId: undefined,
            errorCode: undefined,
            details: undefined
        });
    }

    return enhanceResolvedError({
        message: i18n.t("errors.requestFailed"),
        traceId: undefined,
        errorCode: undefined,
        details: undefined
    });
};
