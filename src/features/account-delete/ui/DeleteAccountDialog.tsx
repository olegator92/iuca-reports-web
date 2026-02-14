import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { useDeleteAccount } from "../model";
// import { useCurrentUser } from "@/shared/lib/auth"; // Password authentication is temporarily disabled (Google OAuth only)
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    FormField,
    // PasswordInput, // Password authentication is temporarily disabled (Google OAuth only)
    Textarea
} from "@/shared/ui";

export const DeleteAccountDialog = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    // const passwordId = useId(); // Password authentication is temporarily disabled (Google OAuth only)
    const reasonId = useId();
    // const currentUser = useCurrentUser(); // Password authentication is temporarily disabled (Google OAuth only)
    // const hasPassword = currentUser?.hasPassword ?? true;
    const hasPassword = false;

    const { form, onSubmit, isSubmitting } = useDeleteAccount({
        onSuccess: () => {
            setOpen(false);
        },
        hasPassword
    });

    const { errors } = form.formState;

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto min-h-[48px] md:min-h-0">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("account.deleteAccount")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t("account.deleteAccountTitle")}</DialogTitle>
                    <div className="space-y-2 pt-2">
                        <DialogDescription>
                            {t("account.deleteAccountWarning")}
                        </DialogDescription>
                        <p className="text-sm text-muted-foreground">
                            {t("account.deleteAccountConfirm")}
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <FormField
                        id={reasonId}
                        label={t("account.deleteReasonLabel")}
                        error={errors.reason?.message}
                    >
                        <Textarea
                            id={reasonId}
                            placeholder={t("account.deleteReasonPlaceholder")}
                            aria-invalid={Boolean(errors.reason)}
                            aria-describedby={errors.reason ? `${reasonId}-error` : undefined}
                            disabled={isSubmitting}
                            rows={3}
                            {...form.register("reason")}
                        />
                    </FormField>

                    {/* Password authentication is temporarily disabled (Google OAuth only)
                    {hasPassword && (
                        <FormField
                            id={passwordId}
                            label={t("account.confirmPasswordLabel")}
                            error={errors.password?.message}
                        >
                            <PasswordInput
                                id={passwordId}
                                placeholder={t("account.confirmPasswordPlaceholder")}
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={errors.password ? `${passwordId}-error` : undefined}
                                disabled={isSubmitting}
                                {...form.register("password")}
                            />
                        </FormField>
                    )}
                    */}

                    <DialogFooter className="gap-3 sm:gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            isLoading={isSubmitting}
                            disabled={isSubmitting}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("account.deleteAccountConfirmButton")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
