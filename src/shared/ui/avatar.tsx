import * as React from "react";
import { UserCircle } from "lucide-react";
import { cn } from "@/shared/lib";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showIcon?: boolean;
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-32 w-32 text-3xl"
};

const iconSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-32 w-32"
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = "md", showIcon = false, ...props }, ref) => {
        const [imageError, setImageError] = React.useState(false);

        // Generate initials from fallback text
        const getInitials = (text?: string) => {
            if (!text) return "?";
            const words = text.trim().split(/\s+/);
            if (words.length === 1) return words[0].charAt(0).toUpperCase();
            return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
        };

        // Determine what to display
        const renderContent = () => {
            // If image is provided and loaded successfully
            if (src && !imageError) {
                return (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                );
            }

            // If showIcon is true, show the user icon
            if (showIcon) {
                return (
                    <UserCircle
                        className={cn(iconSizeClasses[size], "text-muted-foreground")}
                        strokeWidth={1.5}
                    />
                );
            }

            // Otherwise show initials
            return <span>{getInitials(fallback)}</span>;
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
                    !showIcon && "bg-muted font-medium text-muted-foreground",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {renderContent()}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";
