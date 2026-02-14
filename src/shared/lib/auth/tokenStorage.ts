// Token storage utilities for managing refresh tokens in localStorage

const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenStorage = {
    /**
     * Save refresh token to localStorage
     * @param token The refresh token to save
     */
    saveRefreshToken: (token: string): void => {
        try {
            localStorage.setItem(REFRESH_TOKEN_KEY, token);
        } catch (error) {
            console.error("Failed to save refresh token:", error);
        }
    },

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken: (): string | null => {
        try {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error("Failed to get refresh token:", error);
            return null;
        }
    },

    /**
     * Remove refresh token from localStorage
     */
    removeRefreshToken: (): void => {
        try {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error("Failed to remove refresh token:", error);
        }
    },

    /**
     * Check if refresh token exists
     */
    hasRefreshToken: (): boolean => {
        return tokenStorage.getRefreshToken() !== null;
    }
};

/**
 * Check if access token is expired or about to expire
 * @param expiresAt ISO 8601 datetime string
 * @param bufferMinutes Number of minutes before expiry to consider token expired (default: 5)
 */
export const isTokenExpired = (expiresAt: string | null, bufferMinutes = 5): boolean => {
    if (!expiresAt) return true;

    try {
        const expiryTime = new Date(expiresAt).getTime();
        const now = Date.now();
        const buffer = bufferMinutes * 60 * 1000; // Convert to milliseconds

        return now >= expiryTime - buffer;
    } catch {
        return true;
    }
};
