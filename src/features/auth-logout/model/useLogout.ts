import { useLogoutMutation, clearAuth } from "@/entities/auth";
import { tokenStorage } from "@/shared/lib/auth";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import { selectRefreshToken } from "@/shared/lib/auth";

interface UseLogoutOptions {
    onSuccess?: () => void;
}

export const useLogout = (options?: UseLogoutOptions) => {
    const dispatch = useAppDispatch();
    const refreshToken = useAppSelector(selectRefreshToken);
    const [logoutMutation, { isLoading }] = useLogoutMutation();

    const logout = async () => {
        const token = refreshToken || tokenStorage.getRefreshToken();

        if (token) {
            try {
                // Call logout endpoint to invalidate refresh token on server
                await logoutMutation({ refreshToken: token }).unwrap();
            } catch {
                // Even if server logout fails, proceed with client cleanup
            }
        }

        // Clear auth state
        dispatch(clearAuth());
        tokenStorage.removeRefreshToken();

        // Success callback
        options?.onSuccess?.();
    };

    return {
        logout,
        isLoading
    };
};
