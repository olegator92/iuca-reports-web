import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useGetCulturesQuery } from "@/shared/api";
import type { CultureDto } from "@/shared/api";
import i18n, { DEFAULT_LANGUAGE } from "@/shared/config/i18n";
import { LocalizationContext, type LocalizationContextValue } from "./useLocalization";

const FALLBACK_LANGUAGES: CultureDto[] = [
    {
        name: "en",
        displayName: "English",
        englishName: "English",
    },
    {
        name: "ru",
        displayName: "Русский",
        englishName: "Russian",
    },
];

const resolveFallbackLanguages = () => FALLBACK_LANGUAGES;

type LocalizationProviderProps = {
    children: ReactNode;
};

export const LocalizationProvider = ({ children }: LocalizationProviderProps) => {
    const { data, isFetching, error, refetch } = useGetCulturesQuery();
    const [languages, setLanguages] = useState<CultureDto[]>(resolveFallbackLanguages);
    const [currentLanguage, setCurrentLanguage] = useState(
        i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE,
    );

    useEffect(() => {
        if (data && data.length > 0) {
            setLanguages(data);
            return;
        }

        if (!isFetching && (!data || data.length === 0)) {
            setLanguages(resolveFallbackLanguages());
        }
    }, [data, isFetching]);

    useEffect(() => {
        const handleLanguageChange = (language: string) => {
            setCurrentLanguage(language);
            // Refetch cultures to get updated displayName values in the new language
            void refetch();
        };

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [refetch]);

    const contextValue = useMemo<LocalizationContextValue>(
        () => ({
            languages,
            isLoading: isFetching,
            error,
            currentLanguage,
            setLanguage: async (language) => {
                const nextLanguage = language || DEFAULT_LANGUAGE;
                const targetLanguage = languages.find(({ name }) => name === nextLanguage)
                    ? nextLanguage
                    : DEFAULT_LANGUAGE;

                if (targetLanguage === currentLanguage) {
                    return;
                }

                await i18n.changeLanguage(targetLanguage);
            },
        }),
        [languages, isFetching, error, currentLanguage],
    );

    return (
        <LocalizationContext.Provider value={contextValue}>
            {children}
        </LocalizationContext.Provider>
    );
};

