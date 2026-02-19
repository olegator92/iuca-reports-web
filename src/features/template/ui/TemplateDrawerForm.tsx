import * as React from "react";
import type { Template } from "@/entities/template/model";
import { useTemplateCreate } from "@/features/template-create/model";
import { useTemplateEditor } from "@/features/template-update/model";
import { TemplateForm, type TemplateFormMode } from "./TemplateForm";

interface BaseDrawerFormProps {
    submitLabel?: string;
    onCancel?: () => void;
    onSuccess?: (template: Template) => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

interface CreateDrawerFormProps extends BaseDrawerFormProps {
    mode: "create";
}

interface ExistingDrawerFormProps extends BaseDrawerFormProps {
    mode: Extract<TemplateFormMode, "view" | "edit">;
    template: Template;
    onModeChange?: (mode: "view" | "edit") => void;
}

type TemplateDrawerFormProps = CreateDrawerFormProps | ExistingDrawerFormProps;

const CreateTemplateDrawerForm = ({
    submitLabel,
    onCancel,
    onSuccess,
    hideFooter,
    onFormStateChange,
}: CreateDrawerFormProps) => {
    const { form, onSubmit, isSubmitting } = useTemplateCreate({ onSuccess });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    return (
        <TemplateForm
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

const ExistingTemplateDrawerForm = ({
    mode,
    template,
    submitLabel,
    onCancel,
    onSuccess,
    onModeChange,
    hideFooter,
    onFormStateChange,
}: ExistingDrawerFormProps) => {
    const { form, onSubmit, isSubmitting, hasChanges, reset } = useTemplateEditor({
        template,
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
        <TemplateForm
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

export const TemplateDrawerForm = (props: TemplateDrawerFormProps) => {
    if (props.mode === "create") {
        return <CreateTemplateDrawerForm {...props} />;
    }

    return <ExistingTemplateDrawerForm {...props} />;
};

export type { TemplateDrawerFormProps };
