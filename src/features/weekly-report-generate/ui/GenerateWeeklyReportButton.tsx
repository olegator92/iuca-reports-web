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
import { useWeeklyReportGenerate } from "../model/useWeeklyReportGenerate";

interface GenerateWeeklyReportButtonProps {
    weekStart: string;
    weekEnd: string;
    positionId: string;
    hasReport: boolean;
    reportId?: string;
    detailLevel?: number;
}

export const GenerateWeeklyReportButton = ({ weekStart, weekEnd, positionId, hasReport, detailLevel }: GenerateWeeklyReportButtonProps) => {
    const { t } = useTranslation();
    const { handleGenerate, isLoading } = useWeeklyReportGenerate();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (hasReport) {
            setOpen(true);
        } else {
            handleGenerate({ weekStart, weekEnd, positionId, detailLevel });
        }
    };

    const handleConfirm = async () => {
        await handleGenerate({ weekStart, weekEnd, positionId, detailLevel });
        setOpen(false);
    };

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.WEEKLY_REPORT_EDIT]}>
            <Button
                onClick={handleClick}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("weeklyReports.actions.generate")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("weeklyReports.generate.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("weeklyReports.generate.confirmDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading} className="min-h-[48px] sm:min-h-0">
                            {t("common.cancel")}
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isLoading} className="min-h-[48px] sm:min-h-0">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t("weeklyReports.generate.confirmButton")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProtectedContent>
    );
};
