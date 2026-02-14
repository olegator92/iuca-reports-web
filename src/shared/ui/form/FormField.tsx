import { type ReactNode } from "react";
import { Label } from "@/shared/ui";

interface FormFieldProps {
    id: string;
    label: string;
    error?: string;
    optional?: boolean;
    optionalHint?: string;
    children: ReactNode;
}

export const FormField = ({
    id,
    label,
    error,
    optional,
    optionalHint,
    children,
}: FormFieldProps) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>
                {label}
                {optional && optionalHint ? (
                    <span className="text-xs text-muted-foreground"> {optionalHint}</span>
                ) : null}
            </Label>
            {children}
            {error ? (
                <p id={errorId} className="text-sm text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    );
};
