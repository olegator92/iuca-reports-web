import { useCallback } from "react";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigateWithLoading } from "@/shared/lib";

type ServerErrorPageProps = {
    onReload?: () => void;
    onGoHome?: () => void;
};

export const ServerErrorPage = ({ onReload, onGoHome }: ServerErrorPageProps) => {
    const navigate = useNavigateWithLoading();
    const { t } = useTranslation();

    const handleGoHome = useCallback(() => {
        if (onGoHome) {
            onGoHome();
            return;
        }

        navigate(ROUTES.HOME);
    }, [navigate, onGoHome]);

    const handleReload = useCallback(() => {
        if (onReload) {
            onReload();
            return;
        }

        window.location.reload();
    }, [onReload]);

    return (
        <section className="flex min-h-[60vh] items-center justify-center px-2">
            <div className="w-full max-w-lg space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-sm lg:p-10">
                <div className="space-y-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-destructive">
                        500
                    </span>
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("errors.serverTitle")}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {t("errors.serverDescription")}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Button onClick={handleGoHome}>{t("errors.backHome")}</Button>
                    <Button variant="outline" onClick={handleReload}>
                        {t("common.reload")}
                    </Button>
                </div>
            </div>
        </section>
    );
};
