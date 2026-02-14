import { useCallback } from "react";
import { useEnableUserMutation, useDisableUserMutation } from "@/entities/user/api";

interface UseUserStatusOptions {
    onSuccess?: () => void;
}

export const useUserStatus = (
    id: string,
    options?: UseUserStatusOptions
) => {
    const [enableUser, { isLoading: isEnabling }] = useEnableUserMutation();
    const [disableUser, { isLoading: isDisabling }] = useDisableUserMutation();

    const handleEnable = useCallback(async (): Promise<boolean> => {
        try {
            await enableUser(id).unwrap();
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    }, [enableUser, id, options]);

    const handleDisable = useCallback(async (): Promise<boolean> => {
        try {
            await disableUser(id).unwrap();
            options?.onSuccess?.();
            return true;
        } catch {
            return false;
        }
    }, [disableUser, id, options]);

    return {
        handleEnable,
        handleDisable,
        isLoading: isEnabling || isDisabling
    };
};
