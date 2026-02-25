import { rtkApi, ensureSuccess } from "@/shared/api";
import type { ResultEnvelope } from "@/shared/api";
import { setUser } from "@/entities/auth/model/authSlice";
import type {
    UpdateProfileRequest,
    DeleteAccountRequest,
    CurrentUser
} from "@/entities/auth/model/types";

const ACCOUNT_ENDPOINT = "/account";

export const accountApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get Current User
        getMe: builder.query<CurrentUser, void>({
            query: () => ({
                url: `${ACCOUNT_ENDPOINT}/me`
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                // Transform Pascal Case to camel case
                const rawPositions = data.Positions || data.positions;
                return {
                    id: data.Id || data.id,
                    email: data.Email || data.email,
                    name: data.Name || data.name,
                    isActive: data.IsActive ?? data.isActive,
                    roles: data.Roles || data.roles,
                    permissions: data.Permissions || data.permissions,
                    positions: Array.isArray(rawPositions)
                        ? rawPositions.map((p: Record<string, unknown>) => ({
                            id: p.Id || p.id,
                            name: p.Name || p.name,
                            departmentId: p.DepartmentId || p.departmentId,
                            departmentName: p.DepartmentName || p.departmentName
                        }))
                        : [],
                    createdAt: data.CreatedAt || data.createdAt,
                    updatedAt: data.UpdatedAt || data.updatedAt,
                    profilePhotoUrl: data.ProfilePhotoUrl || data.profilePhotoUrl,
                    hasPassword: data.HasPassword ?? data.hasPassword ?? false,
                    accountDeletionScheduledAt: data.AccountDeletionScheduledAt || data.accountDeletionScheduledAt
                } as CurrentUser;
            },
            providesTags: ["CurrentUser"]
        }),

        // Update Profile
        updateProfile: builder.mutation<void, UpdateProfileRequest>({
            query: (body) => ({
                url: `${ACCOUNT_ENDPOINT}/profile`,
                method: "PUT",
                body
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: ["CurrentUser"]
        }),

        // Upload Profile Photo
        uploadProfilePhoto: builder.mutation<{ photoUrl: string }, FormData>({
            query: (formData) => ({
                url: `${ACCOUNT_ENDPOINT}/profile/photo`,
                method: "POST",
                body: formData
            }),
            transformResponse: (response: ResultEnvelope<Record<string, unknown>>) => {
                const data = ensureSuccess(response).data;
                return {
                    photoUrl: data.PhotoUrl || data.photoUrl
                };
            },
            invalidatesTags: ["CurrentUser"],
            async onQueryStarted(_formData, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // After successful upload, fetch current user and update Redux state
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

        // Delete Profile Photo
        deleteProfilePhoto: builder.mutation<void, void>({
            query: () => ({
                url: `${ACCOUNT_ENDPOINT}/profile/photo`,
                method: "DELETE"
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: ["CurrentUser"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // After successful delete, fetch current user and update Redux state
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

        // Request Account Deletion
        deleteAccount: builder.mutation<void, DeleteAccountRequest>({
            query: (body) => ({
                url: `${ACCOUNT_ENDPOINT}/delete`,
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
                    // After successful deletion request, fetch current user and update Redux state
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

        // Cancel Account Deletion
        cancelAccountDeletion: builder.mutation<void, void>({
            query: () => ({
                url: `${ACCOUNT_ENDPOINT}/cancel-deletion`,
                method: "POST"
            }),
            transformResponse: (response: ResultEnvelope<null>) => {
                ensureSuccess(response, { allowNullData: true });
            },
            invalidatesTags: ["CurrentUser"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // After successful cancellation, fetch current user and update Redux state
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
        })
    }),
    overrideExisting: false
});

export const {
    useGetMeQuery,
    useLazyGetMeQuery,
    useUpdateProfileMutation,
    useUploadProfilePhotoMutation,
    useDeleteProfilePhotoMutation,
    useDeleteAccountMutation,
    useCancelAccountDeletionMutation
} = accountApi;
