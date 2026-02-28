import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Sparkles } from "lucide-react";
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
import { useDailyReportGenerate } from "../model/useDailyReportGenerate";

interface GenerateReportButtonProps {
    date: string;
    positionId: string;
    hasReport: boolean;
    reportId?: string;
}

export const GenerateReportButton = ({ date, positionId, hasReport }: GenerateReportButtonProps) => {
    const { t } = useTranslation();
    const { handleGenerate, isLoading } = useDailyReportGenerate();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (hasReport) {
            setOpen(true);
        } else {
            handleGenerate({ date, positionId });
        }
    };

    const handleConfirm = async () => {
        await handleGenerate({ date, positionId });
        setOpen(false);
    };

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                size="sm"
                onClick={handleClick}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("dailyReports.actions.generate")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("dailyReports.generate.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("dailyReports.generate.confirmDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            {t("common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t("dailyReports.generate.confirmButton")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProtectedContent>
    );
};
