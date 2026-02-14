import * as React from "react";

import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";

type LoaderMode = "fullscreen" | "section" | "inline";
type LoaderSize = "sm" | "md" | "lg";

type LoaderProps = React.HTMLAttributes<HTMLDivElement> & {
    mode?: LoaderMode;
    size?: LoaderSize;
    label?: string;
};

const modeStyles: Record<LoaderMode, string> = {
    fullscreen:
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm",
    section:
        "flex h-full w-full flex-col items-center justify-center gap-3 py-16",
    inline: "inline-flex items-center justify-center gap-2 align-middle",
};

const spinnerSizes: Record<LoaderSize, string> = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-10 w-10 border-4",
};

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    (
        {
            className,
            mode = "section",
            size = "md",
            label,
            role,
            ...props
        },
        ref,
    ) => {
        const {
            ["aria-label"]: ariaLabelProp,
            ["aria-live"]: ariaLiveProp,
            ...restProps
        } = props;
        const { t } = useTranslation();

        const defaultLabel = mode === "inline" ? null : t("common.loading");
        const visibleLabel = label ?? defaultLabel;
        const fallbackAriaLabel = ariaLabelProp ?? visibleLabel ?? t("common.loading");

        return (
            <div
                ref={ref}
                role={role ?? "status"}
                aria-live={ariaLiveProp ?? "polite"}
                aria-label={fallbackAriaLabel}
                className={cn(
                    "text-muted-foreground",
                    modeStyles[mode],
                    className,
                )}
                {...restProps}
            >
                <span
                    className={cn(
                        "inline-flex animate-spin rounded-full border-muted-foreground/40 border-t-primary",
                        spinnerSizes[size],
                    )}
                    aria-hidden="true"
                />
                {visibleLabel ? (
                    <span className="text-sm font-medium text-current">
                        {visibleLabel}
                    </span>
                ) : null}
            </div>
        );
    },
);

Loader.displayName = "Loader";

export { Loader };
export type { LoaderMode, LoaderProps, LoaderSize };
