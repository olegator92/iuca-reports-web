import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useLoginMutation, setCredentials } from "@/entities/auth";
import { useLazyGetMeQuery } from "@/entities/account";
import { createLoginFormSchema, type LoginFormData } from "./validation";
import { tokenStorage } from "@/shared/lib/auth";
import { useAppDispatch } from "@/app/stores/mainStore/hooks";

interface UseLoginOptions {
    onSuccess?: () => void;
    onEmailNotConfirmed?: (email: string) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [login, { isLoading: isSubmitting }] = useLoginMutation();
    const [getMe] = useLazyGetMeQuery();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(createLoginFormSchema(t)),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Login and get tokens
            const tokens = await login({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe
            }).unwrap();

            // Store tokens in Redux state immediately
            dispatch(setCredentials({ tokens }));

            // Store refresh token in localStorage
            tokenStorage.saveRefreshToken(tokens.refreshToken);

            // Fetch current user (includes permissions from backend)
            const user = await getMe().unwrap();

            // Update Redux with complete user info including permissions
            dispatch(setCredentials({ tokens, user }));

            // Success callback
            options?.onSuccess?.();

            form.reset();
        } catch (error) {
            // Check if error is email not confirmed
            const errorCode = (error as { data?: { errorCode?: string } })?.data?.errorCode ?? "";

            // If email is not confirmed, redirect to verification page
            if (errorCode === "EMAILNOTCONFIRMEDEXCEPTION") {
                options?.onEmailNotConfirmed?.(data.email);
                return;
            }

            // Other errors handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting
    };
};
