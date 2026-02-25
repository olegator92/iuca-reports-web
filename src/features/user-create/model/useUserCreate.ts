import { useAddUserMutation } from "@/entities/user/api";
import type { User } from "@/entities/user/model";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, type UserFormData } from "@/features/user/model/validation";

interface UseUserCreateOptions {
    onSuccess?: (user: User) => void;
}

export const useUserCreate = (options?: UseUserCreateOptions) => {
    const [addUser, { isLoading: isSubmitting }] = useAddUserMutation();

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "",
            fullName: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: UserFormData) => {
        try {
            const result = await addUser({
                email: data.email,
                fullName: data.fullName,
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
