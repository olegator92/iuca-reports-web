import { Checkbox } from "@/shared/ui";

interface PermissionCheckboxProps {
    permission: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export const PermissionCheckbox = ({
    permission,
    checked,
    onCheckedChange,
    disabled = false
}: PermissionCheckboxProps) => {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={`permission-${permission}`}
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                disabled={disabled}
            />
            <label
                htmlFor={`permission-${permission}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {permission}
            </label>
        </div>
    );
};
