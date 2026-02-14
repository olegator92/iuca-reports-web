import type { FC } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/config";
import { useTranslation } from "react-i18next";

type HeaderProps = {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onLogoClick?: () => void;
};

export const Header: FC<HeaderProps> = ({
    isSidebarOpen,
    onToggleSidebar,
    onLogoClick,
}) => {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
            <div className="flex w-full max-w-6xl items-center justify-between gap-4 px-2 py-3 md:px-6">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
                        aria-controls="app-sidebar"
                        aria-expanded={isSidebarOpen}
                        aria-label={t("navigation.toggleMenu")}
                        onClick={onToggleSidebar}
                    >
                        <Menu className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <Link
                        to={ROUTES.HOME}
                        className="group flex items-center gap-3 text-left"
                        onClick={onLogoClick}
                    >
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-brand transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                        >
                            <rect
                                x="2"
                                y="5"
                                width="12"
                                height="26"
                                rx="4"
                                className="fill-current opacity-30"
                            />
                            <rect
                                x="16"
                                y="5"
                                width="18"
                                height="12"
                                rx="4"
                                className="fill-current"
                            />
                            <rect
                                x="16"
                                y="19"
                                width="12"
                                height="12"
                                rx="4"
                                className="fill-current opacity-60"
                            />
                        </svg>
                        <span className="text-base font-semibold tracking-wide text-foreground">
                            {t("header.brand")}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
};
