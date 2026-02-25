import { useCreatePositionMutation } from "@/entities/position";
import type { Position } from "@/entities/position";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { positionFormSchema, type PositionFormData } from "@/features/position/model/validation";

interface UsePositionCreateOptions {
    onSuccess?: (position: Position) => void;
}

export const usePositionCreate = (options?: UsePositionCreateOptions) => {
    const [createPosition, { isLoading: isSubmitting }] = useCreatePositionMutation();

    const form = useForm<PositionFormData>({
        resolver: zodResolver(positionFormSchema),
        defaultValues: {
            name: "",
            departmentId: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: PositionFormData) => {
        try {
            const result = await createPosition({
                name: data.name,
                departmentId: data.departmentId,
            }).unwrap();
            if (result?.data) {
                options?.onSuccess?.(result.data);
            }
            form.reset();
        } catch {
            // toast handled in mutation hook
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting,
    };
};
