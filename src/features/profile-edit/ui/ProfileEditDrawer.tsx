import * as React from "react";
import { useCurrentUser } from "@/shared/lib";
import { useUpdateProfile } from "../model";
import { UpdateProfileForm } from "./UpdateProfileForm";

interface ProfileEditDrawerProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    hideFooter?: boolean;
    onFormStateChange?: (state: { isSubmitting: boolean; hasChanges: boolean }) => void;
}

export const ProfileEditDrawer = ({
    onSuccess,
    onCancel,
    hideFooter,
    onFormStateChange,
}: ProfileEditDrawerProps) => {
    const user = useCurrentUser();

    const {
        form,
        onSubmit,
        isSubmitting
    } = useUpdateProfile({
        defaultValues: {
            fullName: user?.name || ""
        },
        onSuccess
    });

    React.useEffect(() => {
        onFormStateChange?.({ isSubmitting, hasChanges: true });
    }, [isSubmitting, onFormStateChange]);

    return (
        <UpdateProfileForm
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onCancel}
            hideFooter={hideFooter}
        />
    );
};
