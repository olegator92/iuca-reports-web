import { type CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/shared/lib";

const baseStyle = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
} as const;

const Toaster = ({ position = "bottom-right", style, richColors = true, ...props }: ToasterProps) => {
    const { theme } = useTheme();

    return (
        <Sonner
            position={position}
            closeButton={false}
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={{ ...(baseStyle as CSSProperties), ...style }}
            richColors={richColors}
            {...props}
        />
    );
};

export { Toaster };
