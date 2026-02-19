import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

interface GoogleOAuthProviderProps {
    children: ReactNode;
}

/**
 * Google OAuth Provider Wrapper
 *
 * Wraps the application with Google OAuth context.
 * Requires VITE_GOOGLE_CLIENT_ID environment variable to be set.
 *
 * To get a Google Client ID:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create or select a project
 * 3. Enable Google+ API
 * 4. Go to Credentials
 * 5. Create OAuth 2.0 Client ID
 * 6. Add authorized JavaScript origins (e.g., http://localhost:5173)
 * 7. Copy the Client ID and add it to .env as VITE_GOOGLE_CLIENT_ID
 */
export const GoogleOAuthProvider = ({ children }: GoogleOAuthProviderProps) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // If no client ID is configured, render children without Google OAuth
    if (!clientId) {
        console.warn(
            "VITE_GOOGLE_CLIENT_ID is not configured. Google Sign-In will not work. " +
            "Please add your Google OAuth Client ID to the .env file."
        );
        return <>{children}</>;
    }

    return <GoogleProvider clientId={clientId}>{children}</GoogleProvider>;
};
