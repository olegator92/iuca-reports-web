import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/shared/config";

export const HomePage = () => {
    const { t } = useTranslation();

    return (
        <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-16 sm:py-24">
            {/* Logo + project name */}
            <div className="mb-8 flex flex-col items-center gap-3">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-brand"
                >
                    <rect x="2" y="5" width="12" height="26" rx="4" className="fill-current opacity-30" />
                    <rect x="16" y="5" width="18" height="12" rx="4" className="fill-current" />
                    <rect x="16" y="19" width="12" height="12" rx="4" className="fill-current opacity-60" />
                </svg>
                <p className="text-2xl font-bold tracking-wide text-foreground">
                    {t("header.brand")}
                </p>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-center text-3xl font-bold text-foreground">
                {t("home.welcomeTitle")}
            </h1>

            {/* Get Started */}
            <Link
                to={ROUTES.DASHBOARD}
                className="mb-8 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
                {t("home.getStarted")}
                <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Description */}
            <p className="text-center text-base text-muted-foreground">
                {t("home.welcomeDescription")}
            </p>
        </section>
    );
};
