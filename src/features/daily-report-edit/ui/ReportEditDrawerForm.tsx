import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button, FormDrawer } from "@/shared/ui";
import type { DailyReport } from "@/entities/daily-report";
import { useDailyReportEdit } from "../model/useDailyReportEdit";
import { ReportEditForm } from "./ReportEditForm";

const FORM_ID = "report-edit-drawer-form";

interface ReportEditDrawerFormProps {
    open: boolean;
    onClose: () => void;
    report: DailyReport | null;
    mode: "edit" | "view";
}

export const ReportEditDrawerForm = ({
    open,
    onClose,
    report,
    mode
}: ReportEditDrawerFormProps) => {
    const { t } = useTranslation();
    const { handleSave, isLoading } = useDailyReportEdit(onClose);

    const footer = (
        <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                {t("dailyReports.editDrawer.close")}
            </Button>
            {mode === "edit" && (
                <Button type="submit" form={FORM_ID} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("dailyReports.editDrawer.save")}
                </Button>
            )}
        </div>
    );

    return (
        <FormDrawer
            open={open}
            onClose={onClose}
            title={t("dailyReports.editDrawer.title")}
            footer={footer}
        >
            {report && (
                <ReportEditForm
                    reportId={report.id}
                    initialContent={report.content ?? ""}
                    initialStatus={report.status}
                    mode={mode}
                    onSubmit={handleSave}
                    formId={FORM_ID}
                />
            )}
        </FormDrawer>
    );
};
