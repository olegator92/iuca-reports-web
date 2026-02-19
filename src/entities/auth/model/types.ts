// Authentication related types

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
}

export interface RegisterResponse {
    message: string;
    email: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // Seconds until expiration
    tokenType: string;
    accountDeletionScheduledAt?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface LogoutRequest {
    refreshToken: string;
}

export interface RevokeTokenRequest {
    refreshToken: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface SetPasswordRequest {
    newPassword: string;
    confirmPassword: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface VerifyEmailRequest {
    email: string;
    token: string;
}

export interface GoogleLoginRequest {
    idToken: string;
    rememberMe?: boolean;
}

export interface UpdateProfileRequest {
    fullName: string;
}

export interface DeleteAccountRequest {
    password?: string;
    reason?: string;
}

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    roles: string[];
    permissions?: string[]; // Optional: Actual permissions from backend (includes wildcard support)
    createdAt: string;
    updatedAt: string;
    profilePhotoUrl?: string;
    hasPassword: boolean;
    accountDeletionScheduledAt?: string;
}

// Auth state for Redux
export interface AuthState {
    user: CurrentUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
