import * as React from "react";
import type { User } from "@/entities/user/model";
import { useUserCreate } from "@/features/user-create/model";
import { useUserEditor } from "@/features/user-update/model";
import { UserForm, type UserFormMode } from "./UserForm";

interface BaseDrawerFormProps {
    submitLabel?: string;
    onCancel?: () => void;
    onSuccess?: (user: User) => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

interface CreateDrawerFormProps extends BaseDrawerFormProps {
    mode: "create";
}

interface ExistingDrawerFormProps extends BaseDrawerFormProps {
    mode: Extract<UserFormMode, "view" | "edit">;
    user: User;
    onModeChange?: (mode: "view" | "edit") => void;
}

type UserDrawerFormProps = CreateDrawerFormProps | ExistingDrawerFormProps;

const CreateUserDrawerForm = ({
    submitLabel,
    onCancel,
    onSuccess,
    hideFooter,
    onFormStateChange,
}: CreateDrawerFormProps) => {
    const { form, onSubmit, isSubmitting } = useUserCreate({ onSuccess });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    return (
        <UserForm
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

const ExistingUserDrawerForm = ({
    mode,
    user,
    submitLabel,
    onCancel,
    onSuccess,
    onModeChange,
    hideFooter,
    onFormStateChange,
}: ExistingDrawerFormProps) => {
    const { form, onSubmit, isSubmitting, hasChanges, reset } = useUserEditor({
        user,
        onSuccess,
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

    return (
        <UserForm
            mode={mode}
            form={form}
            isSubmitting={isSubmitting}
            disableSubmit={mode === "edit" && !hasChanges}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onModeChange={onModeChange}
            submitLabel={submitLabel}
            hideFooter={hideFooter}
            user={user}
        />
    );
};

export const UserDrawerForm = (props: UserDrawerFormProps) => {
    if (props.mode === "create") {
        return <CreateUserDrawerForm {...props} />;
    }

    return <ExistingUserDrawerForm {...props} />;
};

export type { UserDrawerFormProps };
