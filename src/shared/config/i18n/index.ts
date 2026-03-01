import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { Resource } from "i18next";
import en from "./en/translation.json";
import ru from "./ru/translation.json";

export const LANGUAGE_STORAGE_KEY = "app.language";
export const DEFAULT_LANGUAGE = "ru";
export const FALLBACK_LANGUAGE = "ru";

const resources: Resource = {
    en: { translation: en },
    ru: { translation: ru },
};

const resolveInitialLanguage = (): string => {
    if (typeof window === "undefined") {
        return DEFAULT_LANGUAGE;
    }

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage && resources[storedLanguage]) {
        return storedLanguage;
    }

    const browserLanguages = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];

    for (const lang of browserLanguages) {
        const exact = lang.toLowerCase();
        const base = exact.split("-")[0];
        if (resources[exact]) return exact;
        if (resources[base]) return base;
    }

    return DEFAULT_LANGUAGE;
};

if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
        resources,
        lng: resolveInitialLanguage(),
        fallbackLng: FALLBACK_LANGUAGE,
        supportedLngs: Object.keys(resources),
        interpolation: {
            escapeValue: false,
        },
        defaultNS: "translation",
        returnNull: false,
    });

    i18n.on("languageChanged", (language) => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        }
    });
}

export const availableStaticLanguages = Object.keys(resources);

export default i18n;
