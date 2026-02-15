import { useTranslation } from "react-i18next";

export const HomePage = () => {
    const { t } = useTranslation();

    return (
        <section className="mx-auto w-full px-2 py-4 sm:p-6">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-colors lg:p-10">
                <h1 className="text-3xl font-bold text-foreground">
                    {t("home.welcomeTitle")}
                </h1>
                <p className="text-muted-foreground">
                    {t("home.welcomeDescription")}
                </p>
            </div>
        </section>
    );
};
