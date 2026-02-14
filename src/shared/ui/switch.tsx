import * as React from "react";
import { cn } from "@/shared/lib";

export interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked = false, onCheckedChange, disabled = false, id, className }, ref) => {
        const handleClick = () => {
            if (!disabled && onCheckedChange) {
                onCheckedChange(!checked);
            }
        };

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                id={id}
                onClick={handleClick}
                className={cn(
                    "relative inline-flex h-5 w-10 flex-shrink-0 items-center rounded-full transition-[background-color]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    checked ? "bg-brand/80" : "bg-brand/30",
                    !disabled && "cursor-pointer",
                    className
                )}
            >
                <span
                    className={cn(
                        "absolute left-1 top-1 size-3 rounded-full border bg-background transition-transform",
                        checked
                            ? "translate-x-4 border-brand/60"
                            : "border-brand/40"
                    )}
                />
            </button>
        );
    }
);

Switch.displayName = "Switch";
