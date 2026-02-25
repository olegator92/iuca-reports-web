import { rtkApi, ensureSuccess } from "@/shared/api";
import type { ResultEnvelope } from "@/shared/api";
import { setUser } from "../model/authSlice";
import { accountApi } from "@/entities/account/api/accountApi";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshTokenRequest,
    LogoutRequest,
    RevokeTokenRequest,
    ChangePasswordRequest,
    SetPasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    GoogleLoginRequest
} from "../model/types";

const AUTH_ENDPOINT = "/auth";

export const authApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: `${AUTH_ENDPOINT}/login`,
                method: "POST",
                body: credentials
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                // Transform Pascal Case to camel case
                return {
                    accessToken: data.AccessToken || data.accessToken,
                    refreshToken: data.RefreshToken || data.refreshToken,
                    expiresIn: data.ExpiresIn || data.expiresIn,
                    tokenType: data.TokenType || data.tokenType
                } as LoginResponse;
            }
        }),

        // Register
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userData) => ({
                url: `${AUTH_ENDPOINT}/register`,
                method: "POST",
                body: userData
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                // Transform Pascal Case to camel case
                return {
                    message: data.Message || data.message,
                    email: data.Email || data.email
                } as RegisterResponse;
            }
        }),

        // Refresh Token
        refreshToken: builder.mutation<LoginResponse, RefreshTokenRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/refresh-token`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                // Transform Pascal Case to camel case
                return {
                    accessToken: data.AccessToken || data.accessToken,
                    refreshToken: data.RefreshToken || data.refreshToken,
                    expiresIn: data.ExpiresIn || data.expiresIn,
                    tokenType: data.TokenType || data.tokenType
                } as LoginResponse;
            }
        }),

        // Logout
        logout: builder.mutation<void, LogoutRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/logout`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Revoke Token (Admin only)
        revokeToken: builder.mutation<void, RevokeTokenRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/revoke-token`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Change Password
        changePassword: builder.mutation<void, ChangePasswordRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/change-password`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Set Password (for OAuth users)
        setPassword: builder.mutation<void, SetPasswordRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/set-password`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: ["CurrentUser"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // After successful password set, fetch current user and update Redux state
                    const result = await dispatch(
                        accountApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
                    );
                    if (result.data) {
                        dispatch(setUser(result.data));
                    }
                } catch {
                    // Error already handled by global error handler
                }
            }
        }),

        // Forgot Password
        forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/forgot-password`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Reset Password
        resetPassword: builder.mutation<void, ResetPasswordRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/reset-password`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Verify Email (Confirm Email)
        verifyEmail: builder.mutation<void, VerifyEmailRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/confirm-email`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Resend Email Confirmation
        resendEmailConfirmation: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/resend-email-confirmation`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            }
        }),

        // Google OAuth
        googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query: (body) => ({
                url: `${AUTH_ENDPOINT}/google`,
                method: "POST",
                body
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                // Transform Pascal Case to camel case
                return {
                    accessToken: data.AccessToken || data.accessToken,
                    refreshToken: data.RefreshToken || data.refreshToken,
                    expiresIn: data.ExpiresIn || data.expiresIn,
                    tokenType: data.TokenType || data.tokenType
                } as LoginResponse;
            }
        })
    }),
    overrideExisting: false
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useRevokeTokenMutation,
    useChangePasswordMutation,
    useSetPasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailMutation,
    useResendEmailConfirmationMutation,
    useGoogleLoginMutation
} = authApi;
