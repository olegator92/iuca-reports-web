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
import { useDailyReportRegenerate } from "../model/useDailyReportRegenerate";

interface RegenerateReportButtonProps {
    reportId: string;
}

export const RegenerateReportButton = ({ reportId }: RegenerateReportButtonProps) => {
    const { t } = useTranslation();
    const { handleRegenerate, isLoading } = useDailyReportRegenerate();
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
        await handleRegenerate(reportId);
        setOpen(false);
    };

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                <RefreshCw className="h-4 w-4" />
                <span className="ml-1.5">{t("dailyReports.actions.regenerate")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("dailyReports.regenerate.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("dailyReports.regenerate.confirmDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            {t("common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            {t("dailyReports.regenerate.confirmButton")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProtectedContent>
    );
};
