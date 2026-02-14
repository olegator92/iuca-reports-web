import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiError } from "@/shared/api/errors";
import type { ResultEnvelope } from "./types";
import { resolveApiError } from "@/shared/lib";
import i18n, { DEFAULT_LANGUAGE } from "@/shared/config/i18n";
import { useGlobalErrorStore } from "@/shared/lib/stores/globalErrorStore";
import { updateTokens, clearAuth } from "@/entities/auth/model";
import { tokenStorage } from "@/shared/lib/auth";
import type { LoginResponse } from "@/entities/auth/model/types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, context) => {
        const { getState } = context;

        // Check if this is a FormData request (marked by our custom marker)
        const isFormData = headers.get("Content-Type") === "__FORMDATA_MARKER__";

        if (isFormData) {
            // Remove the marker - let the browser set the correct Content-Type with boundary
            headers.delete("Content-Type");
        } else if (!headers.has("Content-Type")) {
            // For non-FormData requests, set Content-Type to application/json
            headers.set("Content-Type", "application/json");
        }

        const language = i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE;
        headers.set("Accept-Language", language);

        const state = getState() as { auth: { accessToken: string | null } };
        const accessToken = state.auth?.accessToken;

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    }
});

type BaseQueryArgs = string | FetchArgs;
type BaseQueryResult = unknown;
type BaseQueryError = FetchBaseQueryError | ApiError;

const isEnvelope = (value: unknown): value is ResultEnvelope<unknown> =>
    typeof value === "object" && value !== null && ("data" in value || "errorCode" in value || "message" in value);

/**
 * Mutex to prevent concurrent token refresh attempts
 */
let refreshPromise: Promise<LoginResponse | null> | null = null;

const refreshAuthToken = async (
    refreshToken: string,
    api: any,
    extraOptions: any
): Promise<LoginResponse | null> => {
    // If there's already a refresh in progress, wait for it
    if (refreshPromise) {
        return refreshPromise;
    }

    // Create a new refresh promise
    refreshPromise = (async () => {
        try {
            const refreshResult = await rawBaseQuery(
                {
                    url: "/auth/refresh-token",
                    method: "POST",
                    body: { refreshToken }
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const envelope = refreshResult.data as ResultEnvelope<any>;

                if (envelope.data && !envelope.errorCode) {
                    const tokens: LoginResponse = {
                        accessToken: envelope.data.AccessToken || envelope.data.accessToken,
                        refreshToken: envelope.data.RefreshToken || envelope.data.refreshToken,
                        expiresIn: envelope.data.ExpiresIn || envelope.data.expiresIn,
                        tokenType: envelope.data.TokenType || envelope.data.tokenType
                    };

                    // Store new tokens
                    api.dispatch(updateTokens(tokens));
                    tokenStorage.saveRefreshToken(tokens.refreshToken);

                    return tokens;
                }
            }

            return null;
        } finally {
            // Clear the promise after completion
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

/**
 * Base query with automatic token refresh on 401 errors
 */
export const baseQueryWithReauth: BaseQueryFn<BaseQueryArgs, BaseQueryResult, BaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    // For FormData requests, pre-set Content-Type header to a marker value
    // that will prevent prepareHeaders from setting it to application/json
    let modifiedArgs = args;
    if (typeof args !== 'string' && args.body instanceof FormData) {
        const headers = new Headers(args.headers as HeadersInit);
        headers.set('Content-Type', '__FORMDATA_MARKER__');
        modifiedArgs = { ...args, headers };
    }

    let result = await rawBaseQuery(modifiedArgs, api, extraOptions);

    // Get the endpoint URL for special handling
    const url = typeof args === "string" ? args : args.url;
    const isLogoutEndpoint = url.includes("/logout") || url.includes("/revoke-token");

    // Handle 401 Unauthorized - attempt to refresh token
    if (result.error && result.error.status === 401 && !isLogoutEndpoint) {
        const state = api.getState() as { auth: { accessToken: string | null; refreshToken: string | null } };
        const refreshToken = state.auth?.refreshToken || tokenStorage.getRefreshToken();

        if (refreshToken) {
            const tokens = await refreshAuthToken(refreshToken, api, extraOptions);

            if (tokens) {
                // Retry the original request with new token
                result = await rawBaseQuery(modifiedArgs, api, extraOptions);
            } else {
                // Refresh failed - clear auth
                api.dispatch(clearAuth());
                tokenStorage.removeRefreshToken();
            }
        } else {
            // No refresh token - clear auth
            api.dispatch(clearAuth());
            tokenStorage.removeRefreshToken();
        }
    }

    // Handle errors (suppress for logout/revoke endpoints)
    if (result.error) {
        if (!isLogoutEndpoint) {
            useGlobalErrorStore.getState().showError(resolveApiError(result.error));
        }
        return result;
    }

    // Handle envelope errors
    if (isEnvelope(result.data)) {
        const envelope = result.data;

        if (envelope.errorCode || envelope.errorDetails) {
            const apiError = new ApiError({
                message: envelope.message || i18n.t("errors.requestFailed"),
                traceId: envelope.traceId,
                errorCode: envelope.errorCode,
                details: envelope.errorDetails
            });

            useGlobalErrorStore.getState().showError(resolveApiError(apiError));

            return { error: apiError };
        }
    }

    return result;
};
