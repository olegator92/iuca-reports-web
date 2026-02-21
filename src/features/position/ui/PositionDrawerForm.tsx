import * as React from "react";
import type { Position } from "@/entities/position";
import { usePositionCreate } from "@/features/position-create/model";
import { usePositionEditor } from "@/features/position-update/model";
import { PositionForm, type PositionFormMode } from "./PositionForm";

interface BaseDrawerFormProps {
    submitLabel?: string;
    onCancel?: () => void;
    onSuccess?: (position: Position) => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

interface CreateDrawerFormProps extends BaseDrawerFormProps {
    mode: "create";
}

interface ExistingDrawerFormProps extends BaseDrawerFormProps {
    mode: Extract<PositionFormMode, "view" | "edit">;
    position: Position;
    onModeChange?: (mode: "view" | "edit") => void;
}

type PositionDrawerFormProps = CreateDrawerFormProps | ExistingDrawerFormProps;

const CreatePositionDrawerForm = ({
    submitLabel,
    onCancel,
    onSuccess,
    hideFooter,
    onFormStateChange,
}: CreateDrawerFormProps) => {
    const { form, onSubmit, isSubmitting } = usePositionCreate({ onSuccess });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    return (
        <PositionForm
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

const ExistingPositionDrawerForm = ({
    mode,
    position,
    submitLabel,
    onCancel,
    onSuccess,
    onModeChange,
    hideFooter,
    onFormStateChange,
}: ExistingDrawerFormProps) => {
    const { form, onSubmit, isSubmitting, hasChanges, reset } = usePositionEditor({
        position,
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
        <PositionForm
            mode={mode}
            form={form}
            isSubmitting={isSubmitting}
            disableSubmit={mode === "edit" && !hasChanges}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onModeChange={onModeChange}
            submitLabel={submitLabel}
            hideFooter={hideFooter}
        />
    );
};

export const PositionDrawerForm = (props: PositionDrawerFormProps) => {
    if (props.mode === "create") {
        return <CreatePositionDrawerForm {...props} />;
    }

    return <ExistingPositionDrawerForm {...props} />;
};

export type { PositionDrawerFormProps };
