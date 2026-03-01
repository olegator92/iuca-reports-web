import * as React from "react";
import { cn } from "@/shared/lib";

export interface DropdownMenuProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: "start" | "end";
    placement?: "top" | "bottom";
}

// Context for sharing setIsOpen function
const DropdownMenuContext = React.createContext<{ setIsOpen: (open: boolean) => void } | null>(null);

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
    trigger,
    children,
    align = "start",
    placement = "top"
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const targetElement = target instanceof Element ? target : null;

            // Don't close if clicking inside a dialog
            if (targetElement?.closest('[role="dialog"]')) {
                return;
            }

            if (
                menuRef.current &&
                triggerRef.current &&
                !menuRef.current.contains(target) &&
                !triggerRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Close on Escape key
    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen]);

    const placementClasses = placement === "bottom" ? "top-full mt-1" : "bottom-full mb-2";
    const alignmentClasses = align === "end" ? "right-0" : "left-0";

    return (
        <div className="relative">
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={cn(
                        "absolute z-50 w-[calc(100vw-2rem)] max-w-[320px] md:w-52 rounded-lg border border-border bg-popover p-2 md:p-1 text-popover-foreground shadow-lg",
                        placementClasses,
                        alignmentClasses
                    )}
                >
                    <DropdownMenuContext.Provider value={{ setIsOpen }}>
                        {children}
                    </DropdownMenuContext.Provider>
                </div>
            )}
        </div>
    );
};

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    destructive?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    ({ className, icon, destructive, children, onClick, ...props }, ref) => {
        const context = React.useContext(DropdownMenuContext);

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(e);
            // Close the dropdown after clicking the item
            context?.setIsOpen(false);
        };

        return (
            <button
                ref={ref}
                className={cn(
                    "flex w-full items-center gap-3 rounded-md px-4 py-4 md:px-3 md:py-2 text-base md:text-sm transition-colors cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "min-h-[56px] md:min-h-0 border-b border-border/50 last:border-b-0",
                    destructive
                        ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    className
                )}
                onClick={handleClick}
                {...props}
            >
                {icon && <span className="shrink-0 [&_svg]:size-5 [&_svg]:md:size-4">{icon}</span>}
                {children}
            </button>
        );
    }
);

DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => {
    return <div className={cn("my-1 h-px bg-border", className)} />;
};

export const DropdownMenuLabel: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
    return (
        <div
            className={cn("px-3 py-2 text-xs font-medium text-muted-foreground", className)}
            {...props}
        />
    );
};
