import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, CurrentUser, LoginResponse } from "./types";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isLoading: true // Start as true to prevent premature redirects during auth initialization
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ tokens: LoginResponse; user?: CurrentUser }>) => {
            const { tokens, user } = action.payload;
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
            // Calculate expiresAt from expiresIn (seconds)
            const expiresAtDate = new Date(Date.now() + tokens.expiresIn * 1000);
            state.expiresAt = expiresAtDate.toISOString();
            state.isAuthenticated = true;
            if (user) {
                state.user = user;
            }
        },
        setUser: (state, action: PayloadAction<CurrentUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        updateTokens: (state, action: PayloadAction<LoginResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            // Calculate expiresAt from expiresIn (seconds)
            const expiresAtDate = new Date(Date.now() + action.payload.expiresIn * 1000);
            state.expiresAt = expiresAtDate.toISOString();
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.expiresAt = null;
            state.isAuthenticated = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setCredentials, setUser, updateTokens, clearAuth, setLoading } = authSlice.actions;

export default authSlice.reducer;
