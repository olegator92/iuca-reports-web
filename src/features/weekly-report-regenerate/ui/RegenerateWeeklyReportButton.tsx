import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, RefreshCw } from "lucide-react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    ProtectedContent
} from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useWeeklyReportRegenerate } from "../model/useWeeklyReportRegenerate";

interface RegenerateWeeklyReportButtonProps {
    reportId: string;
}

export const RegenerateWeeklyReportButton = ({ reportId }: RegenerateWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleRegenerate, isLoading } = useWeeklyReportRegenerate();
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        await handleRegenerate(reportId);
        setOpen(false);
    };

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                <RefreshCw className="h-4 w-4" />
                <span className="ml-1.5">{t("weeklyReports.actions.regenerate")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("weeklyReports.regenerate.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("weeklyReports.regenerate.confirmDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            {t("common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("weeklyReports.regenerate.confirmButton")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProtectedContent>
    );
};
