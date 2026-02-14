import { ApiError } from "./errors";
import i18n from "@/shared/config/i18n";
import type { ResultEnvelope } from "./types";

export interface ExtractedResult<T> {
    data: T;
    message?: string | null;
    envelope: ResultEnvelope<T>;
}

export interface EnsureSuccessOptions {
    allowNullData?: boolean;
}

const hasErrorMarkers = <T>(envelope: ResultEnvelope<T>) =>
    Boolean(envelope.errorCode) || Boolean(envelope.errorDetails);

export const ensureSuccess = <T>(
    envelope: ResultEnvelope<T>,
    options?: EnsureSuccessOptions
): ExtractedResult<T> => {
    if (hasErrorMarkers(envelope)) {
        throw new ApiError({
            message: envelope.message || i18n.t("errors.requestFailed"),
            traceId: envelope.traceId,
            errorCode: envelope.errorCode,
            details: envelope.errorDetails
        });
    }

    if ((envelope.data === undefined || envelope.data === null) && !options?.allowNullData) {
        throw new ApiError({
            message: envelope.message || i18n.t("errors.noData"),
            traceId: envelope.traceId,
            errorCode: envelope.errorCode,
            details: envelope.errorDetails
        });
    }

    return {
        data: envelope.data as T,
        message: envelope.message,
        envelope
    };
};

