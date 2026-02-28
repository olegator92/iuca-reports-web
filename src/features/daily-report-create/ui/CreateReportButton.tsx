import { useTranslation } from "react-i18next";
import { Loader2, FilePlus } from "lucide-react";
import { Button } from "@/shared/ui";
import { ProtectedContent } from "@/shared/ui";
import { PERMISSIONS } from "@/shared/lib";
import { useDailyReportCreate } from "../model/useDailyReportCreate";

interface CreateReportButtonProps {
    date: string;
    positionId: string;
}

export const CreateReportButton = ({ date, positionId }: CreateReportButtonProps) => {
    const { t } = useTranslation();
    const { handleCreate, isLoading } = useDailyReportCreate();

    return (
        <ProtectedContent requiredPermissions={[PERMISSIONS.DAILY_REPORT_EDIT]}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleCreate({ date, positionId })}
                disabled={isLoading}
                className="min-h-[48px] md:min-h-0 px-4"
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <FilePlus className="h-4 w-4" />
                )}
                <span className="ml-1.5">{t("dailyReports.actions.create")}</span>
            </Button>
        </ProtectedContent>
    );
};
