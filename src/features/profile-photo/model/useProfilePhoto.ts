import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppDispatch } from "@/app/stores/mainStore/hooks";
import { useCurrentUser } from "@/shared/lib/auth/hooks";
import { setUser } from "@/entities/auth/model";
import { useUploadProfilePhotoMutation, useDeleteProfilePhotoMutation } from "@/entities/account";
import { validateProfilePhoto, createImagePreview } from "./validation";

export const useProfilePhoto = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useCurrentUser();
    const [uploadProfilePhoto, { isLoading: isUploading }] = useUploadProfilePhotoMutation();
    const [deleteProfilePhoto, { isLoading: isDeleting }] = useDeleteProfilePhotoMutation();
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = async (file: File | null) => {
        if (!file) {
            setPreview(null);
            return;
        }

        // Validate file
        const validation = validateProfilePhoto(file);
        if (!validation.isValid) {
            toast.error(t(validation.error!));
            return;
        }

        // Create preview
        try {
            const previewUrl = await createImagePreview(file);
            setPreview(previewUrl);
        } catch (error) {
            toast.error(t("profile.previewError"));
        }
    };

    const uploadPhoto = async (file: File) => {
        // Validate file
        const validation = validateProfilePhoto(file);
        if (!validation.isValid) {
            toast.error(t(validation.error!));
            return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const result = await uploadProfilePhoto(formData).unwrap();
            toast.success(t("profile.photoUploadSuccess"));
            setPreview(null);

            // Update user in Redux store with new photo URL
            if (user) {
                dispatch(setUser({
                    ...user,
                    profilePhotoUrl: result.photoUrl
                }));
            }
        } catch (error) {
            // Error handling is done by the global error handler
            // but we can add a specific message here if needed
            toast.error(t("profile.photoUploadError"));
        }
    };

    const deletePhoto = async () => {
        try {
            await deleteProfilePhoto().unwrap();
            toast.success(t("profile.photoDeleteSuccess"));
            setPreview(null);

            // Update user in Redux store to remove photo URL
            if (user) {
                dispatch(setUser({
                    ...user,
                    profilePhotoUrl: undefined
                }));
            }
        } catch (error) {
            toast.error(t("profile.photoDeleteError"));
        }
    };

    return {
        uploadPhoto,
        deletePhoto,
        handleFileSelect,
        preview,
        isUploading,
        isDeleting,
        isLoading: isUploading || isDeleting
    };
};
