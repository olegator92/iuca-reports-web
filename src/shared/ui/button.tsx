import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/shared/lib/index";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { Loader } from "./loader";
import { useTranslation } from "react-i18next";

type ButtonProps = React.ComponentProps<"button"> &
    ButtonVariantProps & {
        asChild?: boolean;
        isLoading?: boolean;
        loadingLabel?: string;
    };

const Button = React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
    const {
        className,
        variant,
        size,
        asChild = false,
        isLoading = false,
        loadingLabel,
        children,
        disabled,
        ...restProps
    } = props;
    const { t } = useTranslation();
    const resolvedLoadingLabel = loadingLabel ?? t("common.loading");

    const {
        ["aria-label"]: ariaLabelProp,
        ["aria-live"]: ariaLiveProp,
        style: styleProp,
        ...domProps
    } = restProps;

    const Comp = asChild ? Slot : "button";
    const internalRef = React.useRef<HTMLElement | null>(null);
    const [idleWidth, setIdleWidth] = React.useState<number | null>(null);

    const setRefs = React.useCallback(
        (node: HTMLElement | null) => {
            internalRef.current = node;

            if (typeof ref === "function") {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        },
        [ref],
    );

    React.useLayoutEffect(() => {
        if (isLoading) {
            return;
        }

        const node = internalRef.current;
        if (!node) {
            return;
        }

        const nextWidth = node.getBoundingClientRect().width;
        if (!Number.isFinite(nextWidth)) {
            return;
        }

        if (idleWidth === null || Math.abs(idleWidth - nextWidth) > 0.5) {
            setIdleWidth(nextWidth);
        }
    }, [children, isLoading, idleWidth]);

    const isDisabled = Boolean(disabled) || isLoading;
    const computedAriaLabel = isLoading
        ? ariaLabelProp ?? resolvedLoadingLabel
        : ariaLabelProp;
    const computedAriaLive = isLoading ? "polite" : ariaLiveProp;

    const loadingWidthStyle =
        isLoading && idleWidth !== null
            ? { width: `${idleWidth}px` }
            : undefined;

    const mergedStyle = styleProp
        ? { ...loadingWidthStyle, ...styleProp }
        : loadingWidthStyle;

    return (
        <Comp
            ref={setRefs}
            data-slot="button"
            data-loading={isLoading ? "" : undefined}
            className={cn(
                buttonVariants({ variant, size, className }),
                isLoading && "cursor-wait",
            )}
            disabled={isDisabled}
            aria-busy={isLoading || undefined}
            aria-live={computedAriaLive}
            aria-label={computedAriaLabel}
            style={mergedStyle}
            {...domProps}
        >
            {isLoading ? (
                <>
                    <Loader
                        mode="inline"
                        size="sm"
                        className="text-current"
                        aria-hidden="true"
                        aria-live="off"
                        role="presentation"
                    />
                    <span className="sr-only">{resolvedLoadingLabel}</span>
                </>
            ) : (
                children
            )}
        </Comp>
    );
});

Button.displayName = "Button";

export { Button };
