const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

/**
 * Converts a relative profile photo path to an absolute URL
 * @param profilePhotoUrl - Relative path from backend (e.g., "profile-photos/uuid.jpg")
 * @returns Full URL to the profile photo, or null if no photo is provided
 */
export const getProfilePhotoUrl = (profilePhotoUrl: string | null): string | null => {
    if (!profilePhotoUrl) {
        return null;
    }

    // If already an absolute URL, return as-is
    if (profilePhotoUrl.startsWith("http://") || profilePhotoUrl.startsWith("https://")) {
        return profilePhotoUrl;
    }

    // Remove leading slash if present
    const cleanPath = profilePhotoUrl.startsWith("/") ? profilePhotoUrl.slice(1) : profilePhotoUrl;

    // Build full URL
    const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/${cleanPath}`;
};
