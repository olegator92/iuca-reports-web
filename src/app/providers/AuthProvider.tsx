import { useEffect } from "react";
import type { ReactNode } from "react";
import { setCredentials, setUser, setLoading } from "@/entities/auth";
import { useLazyGetMeQuery } from "@/entities/account";
import { tokenStorage } from "@/shared/lib/auth";
import { useAppDispatch } from "@/app/stores/mainStore/hooks";

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider - Initializes auth state on app load
 * Checks for existing refresh token and loads user data if valid
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useAppDispatch();
    const [getMe] = useLazyGetMeQuery();

    useEffect(() => {
        const initializeAuth = async () => {
            dispatch(setLoading(true));

            try {
                const refreshToken = tokenStorage.getRefreshToken();

                if (refreshToken) {
                    // First, set the refresh token in Redux state so the baseQueryWithReauth can use it
                    dispatch(setCredentials({
                        tokens: {
                            accessToken: "", // Will be set by refresh mechanism
                            refreshToken,
                            expiresIn: 0,
                            tokenType: "Bearer"
                        }
                    }));

                    // Now try to get current user (includes permissions from backend)
                    // The baseQueryWithReauth will automatically refresh the access token since it's empty/invalid
                    const user = await getMe().unwrap();

                    // Set user with permissions from /me endpoint
                    if (user) {
                        dispatch(setUser(user));
                    }
                }
            } catch (error) {
                // If initialization fails, clear tokens
                tokenStorage.removeRefreshToken();
            } finally {
                dispatch(setLoading(false));
            }
        };

        initializeAuth();
    }, [dispatch, getMe]);

    return <>{children}</>;
};
