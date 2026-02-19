import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useRegisterMutation } from "@/entities/auth";
import { createRegisterFormSchema, type RegisterFormData } from "./validation";

interface UseRegisterOptions {
    onSuccess?: (email: string, message: string) => void;
}

export const useRegister = (options?: UseRegisterOptions) => {
    const { t } = useTranslation();
    const [register, { isLoading: isSubmitting }] = useRegisterMutation();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(createRegisterFormSchema(t)),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // Register - backend will send confirmation email
            const response = await register({
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                fullName: data.fullName
            }).unwrap();

            // Success callback with email and message
            options?.onSuccess?.(response.email, response.message);

            form.reset();
        } catch (error) {
            // Errors handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting
    };
};
