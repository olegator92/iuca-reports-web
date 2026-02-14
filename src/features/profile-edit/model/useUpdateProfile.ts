import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setUser } from "@/entities/auth";
import { useUpdateProfileMutation, useLazyGetMeQuery } from "@/entities/account";
import { createUpdateProfileFormSchema, type UpdateProfileFormData } from "./validation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/app/stores/mainStore/hooks";

interface UseUpdateProfileOptions {
    onSuccess?: () => void;
    defaultValues?: UpdateProfileFormData;
}

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const [updateProfile, { isLoading: isSubmitting }] = useUpdateProfileMutation();
    const [getMe] = useLazyGetMeQuery();

    const form = useForm<UpdateProfileFormData>({
        resolver: zodResolver(createUpdateProfileFormSchema(t)),
        defaultValues: options?.defaultValues || {
            fullName: ""
        },
        mode: "onSubmit"
    });

    const onSubmit = async (data: UpdateProfileFormData) => {
        try {
            await updateProfile({
                fullName: data.fullName
            }).unwrap();

            // Fetch the updated user data and update Redux
            const userData = await getMe(undefined, true).unwrap();
            dispatch(setUser(userData));

            toast.success(t("profile.updateSuccess"));
            options?.onSuccess?.();
        } catch {
            // Errors handled by global error handler
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isSubmitting
    };
};
