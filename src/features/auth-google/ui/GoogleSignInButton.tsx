import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin } from "../model";
import { useThemeStore } from "@/shared/lib/stores/themeStore";

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    rememberMe?: boolean;
}

/**
 * Google Sign-In Button Component with Theme Support
 *
 * Uses GoogleLogin from @react-oauth/google wrapped in a styled container
 * to better integrate with the application's design system
 */
export const GoogleSignInButton = ({ onSuccess, rememberMe = false }: GoogleSignInButtonProps) => {
    const { handleGoogleLogin } = useGoogleLogin({ onSuccess });
    const resolvedTheme = useThemeStore((state) => state.theme);

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            // The credential is the ID token (JWT) that the backend expects
            handleGoogleLogin(credentialResponse.credential, rememberMe);
        }
    };

    const handleError = () => {
        console.error("Google Sign-In failed");
    };

    return (
        <div className="flex justify-center">
            <GoogleLogin
                key={resolvedTheme} // Force re-render on theme change
                onSuccess={handleSuccess}
                onError={handleError}
                theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                size="large"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
            />
        </div>
    );
};
