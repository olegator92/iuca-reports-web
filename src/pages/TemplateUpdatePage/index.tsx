import { TemplateUpdateForm } from "@/features/template-update/ui";
import { useTranslation } from "react-i18next";

export const TemplateEditPage = () => {
    const { t } = useTranslation();

    return (
        <section className="mx-auto max-w-2xl space-y-6 px-2 py-6 sm:p-6">
            <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-colors lg:p-10">
                <header className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        {t("templates.drawer.editTitle")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("templates.update.description")}
                    </p>
                </header>
                <TemplateUpdateForm />
            </div>
        </section>
    );
};
