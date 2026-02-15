import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { useCurrentUser } from "@/shared/lib";
// Password authentication is temporarily disabled (Google OAuth only)
// import { useChangePassword, ChangePasswordForm } from "@/features/password-change";
// import { useSetPassword, SetPasswordForm } from "@/features/password-set";
import { ProfileEditDrawer } from "@/features/profile-edit";
import { ProfilePhotoUpload } from "@/features/profile-photo";
import { AccountDeletionStatus } from "@/features/account-delete";
import { Loader, Button, FormDrawer } from "@/shared/ui";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const user = useCurrentUser();
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [formState, setFormState] = useState<{
        isSubmitting: boolean;
        hasChanges: boolean;
    }>({
        isSubmitting: false,
        hasChanges: false,
    });

    // Password authentication is temporarily disabled (Google OAuth only)
    // const changePasswordHook = useChangePassword();
    // const setPasswordHook = useSetPassword();
    // const hasPassword = user?.hasPassword ?? false;

    const openEditDrawer = () => setIsEditDrawerOpen(true);
    const closeEditDrawer = () => setIsEditDrawerOpen(false);

    const handleProfileUpdateSuccess = () => {
        closeEditDrawer();
    };

    if (!user) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader label={t("common.loading")} />
            </div>
        );
    }

    return (
        <section className="mx-auto w-full max-w-lg space-y-6 px-2 py-4 sm:p-6">
            {/* User Info Section */}
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-10">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                            <h1 className="text-3xl font-bold text-foreground">
                                {t("profile.title")}
                            </h1>
                            <p className="text-muted-foreground">
                                {t("profile.description")}
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-12 w-12 shrink-0 md:h-9 md:w-9"
                            onClick={openEditDrawer}
                            aria-label={t("profile.editProfile")}
                        >
                            <Pencil className="h-5 w-5 md:h-4 md:w-4" />
                        </Button>
                    </div>

                    {/* Profile Photo and User Info */}
                    <div className="flex flex-col items-center gap-6 py-4">
                        <ProfilePhotoUpload />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-lg font-semibold text-foreground">
                                {user.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password authentication is temporarily disabled (Google OAuth only)
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        {hasPassword ? t("auth.changePassword") : t("password.setPassword")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {hasPassword
                            ? t("password.changeDescription")
                            : t("password.setPasswordDescription")}
                    </p>
                </div>

                <div className="border-t border-border pt-4">
                    {hasPassword ? (
                        <ChangePasswordForm
                            form={changePasswordHook.form}
                            isSubmitting={changePasswordHook.isSubmitting}
                            onSubmit={changePasswordHook.onSubmit}
                        />
                    ) : (
                        <SetPasswordForm
                            form={setPasswordHook.form}
                            isSubmitting={setPasswordHook.isSubmitting}
                            onSubmit={setPasswordHook.onSubmit}
                        />
                    )}
                </div>
            </div>
            */}

            {/* Delete Account Section */}
            <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6 lg:p-10">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        {t("account.dangerZone")}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t("account.dangerZoneDescription")}
                    </p>
                </div>

                <div className="border-t border-border pt-4">
                    <AccountDeletionStatus />
                </div>
            </div>

            {/* Edit Profile Drawer */}
            <FormDrawer
                open={isEditDrawerOpen}
                onClose={closeEditDrawer}
                title={t("profile.editProfile")}
                description={t("profile.editDescription")}
                footer={
                    <div className="flex w-full gap-2 sm:justify-end">
                        <Button
                            type="submit"
                            form="profile-form"
                            isLoading={formState.isSubmitting}
                            className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                        >
                            {t("profile.updateButton")}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeEditDrawer}
                            disabled={formState.isSubmitting}
                            className="min-h-[48px] flex-1 sm:flex-initial md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                    </div>
                }
            >
                <ProfileEditDrawer
                    onSuccess={handleProfileUpdateSuccess}
                    onCancel={closeEditDrawer}
                    hideFooter={true}
                    onFormStateChange={setFormState}
                />
            </FormDrawer>
        </section>
    );
};
