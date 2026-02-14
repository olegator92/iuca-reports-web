import { useTranslation } from "react-i18next";
import { useCancelAccountDeletionMutation } from "@/entities/account";
import { useCurrentUser } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { toast } from "sonner";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export const AccountDeletionStatus = () => {
    const { t, i18n } = useTranslation();
    const user = useCurrentUser();
    const [cancelDeletion, { isLoading }] = useCancelAccountDeletionMutation();

    const handleCancelDeletion = async () => {
        try {
            await cancelDeletion().unwrap();
            toast.success(t("account.deletionCancelled"));
        } catch {
            // Error handled by global error handler
        }
    };

    if (!user) {
        return null;
    }

    // If account deletion is scheduled, show cancel option
    if (user.accountDeletionScheduledAt) {
        const deletionDate = new Date(user.accountDeletionScheduledAt);
        const formattedDate = deletionDate.toLocaleDateString(i18n.language, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        return (
            <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-sm text-foreground">
                        {t("account.deletionScheduledNotice", { date: formattedDate })}
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={handleCancelDeletion}
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    {t("account.cancelDeletion")}
                </Button>
            </div>
        );
    }

    // Otherwise, show delete account option
    return <DeleteAccountDialog />;
};
