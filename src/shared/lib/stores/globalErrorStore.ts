import { create } from "zustand";
import type { ResolvedApiError } from "@/shared/lib/resolveApiError";

type GlobalErrorState = {
    isOpen: boolean;
    message: string | null;
    traceId: string | null;
    errorCode: string | null;
    details: string | null;
    showError: (error: ResolvedApiError) => void;
    clearError: () => void;
    setOpen: (isOpen: boolean) => void;
};

const initialState = {
    isOpen: false,
    message: null,
    traceId: null,
    errorCode: null,
    details: null
};

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
    ...initialState,
    showError: (error) => {
        set({
            isOpen: true,
            message: error.message,
            traceId: error.traceId ?? null,
            errorCode: error.errorCode ?? null,
            details: error.details ?? null
        });
    },
    clearError: () => {
        set({ ...initialState });
    },
    setOpen: (isOpen) => {
        set((state) => {
            if (!isOpen) {
                return { ...initialState };
            }

            return {
                ...state,
                isOpen: true
            };
        });
    }
}));
