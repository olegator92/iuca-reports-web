import { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { Button } from "./button";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/shared/lib";
import { Badge } from "./badge";

export interface MultiSelectComboboxOption {
    value: string;
    label: string;
    description?: string;
}

export interface MultiSelectComboboxProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: MultiSelectComboboxOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    "aria-label"?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
}

export const MultiSelectCombobox = ({
    value,
    onChange,
    options,
    placeholder = "Select options",
    disabled,
    className,
    "aria-label": ariaLabel,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
}: MultiSelectComboboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const listboxId = useId().concat("-multi-select-combobox");

    const handleToggle = useCallback(
        (selectedValue: string) => {
            const isSelected = value.includes(selectedValue);
            if (isSelected) {
                onChange(value.filter((v) => v !== selectedValue));
            } else {
                onChange([...value, selectedValue]);
            }
        },
        [value, onChange],
    );

    const handleRemove = useCallback(
        (e: React.MouseEvent, removedValue: string) => {
            e.stopPropagation();
            onChange(value.filter((v) => v !== removedValue));
        },
        [value, onChange],
    );

    const selectedOptions = useMemo(
        () => options.filter((opt) => value.includes(opt.value)),
        [options, value],
    );

    const hasOptions = options.length > 0;

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const isWithinMenu = (target: EventTarget | null) => {
            if (!target) {
                return false;
            }

            const node = target as Node;
            return (
                menuRef.current?.contains(node) === true ||
                triggerRef.current?.contains(node) === true
            );
        };

        const handlePointerDown = (event: PointerEvent) => {
            if (!isWithinMenu(event.target)) {
                setIsOpen(false);
            }
        };

        const handleFocusIn = (event: FocusEvent) => {
            if (!isWithinMenu(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("focusin", handleFocusIn);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
            window.removeEventListener("focusin", handleFocusIn);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!hasOptions) {
            setIsOpen(false);
        }
    }, [hasOptions]);

    const menuItemBaseClasses =
        "flex w-full items-center justify-between gap-3 rounded-md border border-transparent px-4 py-4 md:px-3 md:py-2 text-base md:text-sm transition hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[56px] md:min-h-0 mb-1 last:mb-0";

    return (
        <div className={cn("relative", className)}>
            <Button
                ref={triggerRef}
                type="button"
                variant="outline"
                className={cn(
                    "w-full justify-between rounded-lg border border-border/80 bg-background px-3 py-3 md:py-2 text-base md:text-sm font-medium transition hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[open='true']:border-brand/70 data-[open='true']:bg-muted/40 min-h-[48px] md:min-h-0 h-auto",
                    !hasOptions && "cursor-not-allowed opacity-60",
                    ariaInvalid && "border-destructive/50",
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-label={ariaLabel}
                aria-invalid={ariaInvalid}
                aria-describedby={ariaDescribedBy}
                disabled={!hasOptions || disabled}
                data-open={isOpen ? "" : undefined}
                onClick={() => {
                    if (!hasOptions || disabled) {
                        return;
                    }

                    setIsOpen((prev) => !prev);
                }}
            >
                <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((option) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="flex items-center gap-1 px-2 py-0.5"
                            >
                                <span className="truncate">{option.label}</span>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    className="ml-1 rounded-full hover:bg-muted cursor-pointer"
                                    onClick={(e) => handleRemove(e, option.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            handleRemove(e as any, option.value);
                                        }
                                    }}
                                    aria-label={`Remove ${option.label}`}
                                >
                                    <X className="h-3 w-3" />
                                </span>
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                <ChevronDown
                    className={cn(
                        "h-5 w-5 md:h-4 md:w-4 text-muted-foreground transition-transform flex-shrink-0",
                        isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                />
            </Button>

            {isOpen ? (
                <div
                    ref={menuRef}
                    id={listboxId}
                    role="listbox"
                    aria-label={ariaLabel}
                    aria-multiselectable="true"
                    className="absolute left-0 top-full z-50 mt-2 w-full min-w-[200px] rounded-lg border border-border bg-popover p-2 md:p-1 shadow-lg max-h-[300px] overflow-y-auto"
                >
                    {options.map((option) => {
                        const isSelected = value.includes(option.value);

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={cn(
                                    menuItemBaseClasses,
                                    isSelected
                                        ? "border border-brand/60 bg-brand/10 text-foreground shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:bg-brand/15"
                                        : "text-muted-foreground",
                                )}
                                onClick={() => handleToggle(option.value)}
                            >
                                <span className="flex flex-col text-left">
                                    <span className="flex items-center gap-2">
                                        <span>{option.label}</span>
                                    </span>
                                    {option.description ? (
                                        <span className="text-xs text-muted-foreground/80">
                                            {option.description}
                                        </span>
                                    ) : null}
                                </span>
                                {isSelected ? (
                                    <Check className="h-5 w-5 md:h-4 md:w-4 text-brand" aria-hidden="true" />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};
