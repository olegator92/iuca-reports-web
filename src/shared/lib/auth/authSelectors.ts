import type { RootState } from "@/app/stores/mainStore";
import type { CurrentUser } from "@/entities/auth";

/**
 * Selectors for auth state
 */

export const selectIsAuthenticated = (state: RootState): boolean =>
    state.auth.isAuthenticated;

export const selectCurrentUser = (state: RootState): CurrentUser | null =>
    state.auth.user;

export const selectAccessToken = (state: RootState): string | null =>
    state.auth.accessToken;

export const selectRefreshToken = (state: RootState): string | null =>
    state.auth.refreshToken;

export const selectTokenExpiresAt = (state: RootState): string | null =>
    state.auth.expiresAt;

export const selectAuthLoading = (state: RootState): boolean =>
    state.auth.isLoading;

export const selectUserRoles = (state: RootState): string[] =>
    state.auth.user?.roles ?? [];

export const selectUserEmail = (state: RootState): string | null =>
    state.auth.user?.email ?? null;

export const selectUserFullName = (state: RootState): string | null => {
    const user = state.auth.user;
    if (!user) return null;
    return user.name;
};
