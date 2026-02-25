import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useUpdatePositionMutation,
    type Position,
} from "@/entities/position";
import { useTranslation } from "react-i18next";
import { positionFormSchema, type PositionFormData } from "@/features/position/model/validation";

interface UsePositionEditorOptions {
    position: Position;
    onSuccess?: (position: Position) => void;
}

export const usePositionEditor = ({
    position,
    onSuccess,
}: UsePositionEditorOptions) => {
    const { t } = useTranslation();
    const [updatePosition, { isLoading }] = useUpdatePositionMutation();

    const form = useForm<PositionFormData>({
        resolver: zodResolver(positionFormSchema),
        defaultValues: {
            name: position.name,
            departmentId: position.departmentId,
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        form.reset({
            name: position.name,
            departmentId: position.departmentId,
        });
    }, [position.name, position.departmentId, form]);

    const formValues = form.watch();

    const hasChanges = useMemo(() => {
        const trimmedName = formValues.name.trim();
        const positionName = position.name.trim();

        return trimmedName !== positionName || formValues.departmentId !== position.departmentId;
    }, [formValues, position.name, position.departmentId]);

    const reset = useCallback(() => {
        form.reset({
            name: position.name,
            departmentId: position.departmentId,
        });
    }, [position.name, position.departmentId, form]);

    const onSubmit = async (data: PositionFormData) => {
        if (!hasChanges) {
            toast.message(t("positions.noChanges"));
            return;
        }

        try {
            const result = await updatePosition({
                id: position.id,
                data: {
                    name: data.name,
                    departmentId: data.departmentId,
                }
            }).unwrap();
            const updated = result?.data ?? {
                ...position,
                name: data.name,
                departmentId: data.departmentId,
            };
            onSuccess?.(updated);
        } catch {
            // handled by mutation toast
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting: isLoading,
        hasChanges,
        reset,
    };
};
