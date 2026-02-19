import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib";

export interface PasswordInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    showToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, showToggle = true, ...props }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false);

        const toggleVisibility = () => {
            setIsVisible((prev) => !prev);
        };

        return (
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    className={cn(
                        "flex h-12 md:h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base md:text-sm shadow-xs transition-colors",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                        "placeholder:text-muted-foreground",
                        "focus-visible:border-brand/60 focus-visible:outline-none focus-visible:ring-brand/40 focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        showToggle && "pr-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className={cn(
                            "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
                            "text-muted-foreground hover:text-foreground",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md",
                            "transition-colors"
                        )}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        {isVisible ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

