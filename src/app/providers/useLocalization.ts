import { createContext, useContext } from "react";
import type { CultureDto } from "@/shared/api";

export type LocalizationContextValue = {
    languages: CultureDto[];
    isLoading: boolean;
    error: unknown;
    currentLanguage: string;
    setLanguage: (language: string) => Promise<void>;
};

export const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export const useLocalization = () => {
    const context = useContext(LocalizationContext);

    if (!context) {
        throw new Error("useLocalization must be used within a LocalizationProvider");
    }

    return context;
};
