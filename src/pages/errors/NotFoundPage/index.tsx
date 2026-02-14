import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";

export const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <section className="flex min-h-[60vh] items-center justify-center px-2">
            <div className="w-full max-w-lg space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-sm">
                <div className="space-y-3">
                    <span className="text-2xl font-semibold uppercase tracking-wide text-brand">
                        404
                    </span>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("errors.notFoundTitle")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("errors.notFoundDescription")}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button asChild>
                        <Link to={ROUTES.HOME}>{t("errors.backHome")}</Link>
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        {t("common.reload")}
                    </Button>
                </div>
            </div>
        </section>
    );
};
