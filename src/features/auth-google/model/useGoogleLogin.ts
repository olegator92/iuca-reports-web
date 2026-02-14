import { useGoogleLoginMutation, setCredentials } from "@/entities/auth";
import { useLazyGetMeQuery } from "@/entities/account";
import { tokenStorage } from "@/shared/lib/auth";
import { useAppDispatch } from "@/app/stores/mainStore/hooks";

interface UseGoogleLoginOptions {
    onSuccess?: () => void;
}

export const useGoogleLogin = (options?: UseGoogleLoginOptions) => {
    const dispatch = useAppDispatch();
    const [googleLogin, { isLoading }] = useGoogleLoginMutation();
    const [getMe] = useLazyGetMeQuery();

    const handleGoogleLogin = async (idToken: string, rememberMe: boolean = false) => {
        try {
            // Login with Google and get tokens
            const tokens = await googleLogin({ idToken, rememberMe }).unwrap();

            // Store tokens in Redux state immediately
            dispatch(setCredentials({ tokens }));

            // Store refresh token in localStorage
            tokenStorage.saveRefreshToken(tokens.refreshToken);

            // Fetch current user
            const user = await getMe().unwrap();

            // Update Redux with complete user info
            dispatch(setCredentials({ tokens, user }));

            // Success callback
            options?.onSuccess?.();
        } catch {
            // Errors handled by global error handler
        }
    };

    return {
        handleGoogleLogin,
        isLoading
    };
};
