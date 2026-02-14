import * as React from "react";
import type { Role } from "@/entities/role";
import { useRoleCreate } from "@/features/role-create/model";
import { useRoleEditor } from "@/features/role-update/model";
import { RoleForm, type RoleFormMode } from "@/features/role-create/ui/RoleForm";
import { RolePermissionsManager } from "@/features/role-permissions/ui/RolePermissionsManager";

interface BaseDrawerFormProps {
    submitLabel?: string;
    onCancel?: () => void;
    onSuccess?: (role: Role) => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

interface CreateDrawerFormProps extends BaseDrawerFormProps {
    mode: "create";
}

interface ExistingDrawerFormProps extends BaseDrawerFormProps {
    mode: Extract<RoleFormMode, "view" | "edit">;
    role: Role;
    onModeChange?: (mode: "view" | "edit") => void;
}

type RoleDrawerFormProps = CreateDrawerFormProps | ExistingDrawerFormProps;

const CreateRoleDrawerForm = ({
    submitLabel,
    onCancel,
    onSuccess,
    hideFooter,
    onFormStateChange,
}: CreateDrawerFormProps) => {
    const { form, onSubmit, isSubmitting } = useRoleCreate({ onSuccess });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    return (
        <RoleForm
            mode="create"
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            submitLabel={submitLabel}
            hideFooter={hideFooter}
        />
    );
};

const ExistingRoleDrawerForm = ({
    mode,
    role,
    submitLabel,
    onCancel,
    onSuccess,
    onModeChange,
    hideFooter,
    onFormStateChange,
}: ExistingDrawerFormProps) => {
    const { form, onSubmit, isSubmitting, hasChanges, reset } = useRoleEditor({
        role,
        onSuccess
    });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges });
    }, [isSubmitting, hasChanges, onFormStateChange]);

    const handleCancel = () => {
        if (mode === "edit") {
            reset();
        }
        onCancel?.();
    };

    const handleSubmit = (e: React.FormEvent) => {
        if (mode === "view") {
            e.preventDefault();
            return;
        }
        onSubmit(e);
    };

    // System roles can only view/edit permissions, not the role name
    const isSystemRole = role.isSystemRole;

    return (
        <div className="space-y-6">
            {!isSystemRole ? (
                <RoleForm
                    mode={mode}
                    form={form}
                    isSubmitting={isSubmitting}
                    disableSubmit={mode === "edit" && !hasChanges}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    onModeChange={onModeChange}
                    submitLabel={submitLabel}
                    isSystemRole={isSystemRole}
                    hideFooter={hideFooter}
                />
            ) : (
                // For system roles in view mode, show role name as read-only
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">{role.name}</label>
                        <p className="text-sm text-muted-foreground mt-1">System Role</p>
                    </div>
                </div>
            )}

            {/* Permissions section - always visible for existing roles */}
            <div className={!isSystemRole ? "border-t pt-6" : ""}>
                <RolePermissionsManager
                    role={role}
                    onSuccess={onSuccess ? () => onSuccess(role) : undefined}
                    disabled={false}
                />
            </div>
        </div>
    );
};

export const RoleDrawerForm = (props: RoleDrawerFormProps) => {
    if (props.mode === "create") {
        return <CreateRoleDrawerForm {...props} />;
    }

    return <ExistingRoleDrawerForm {...props} />;
};

export type { RoleDrawerFormProps };
