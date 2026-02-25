import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button, FormDrawer } from "@/shared/ui";
import type { WeeklyReport } from "@/entities/weekly-report";
import { useWeeklyReportEdit } from "../model/useWeeklyReportEdit";
import { WeeklyReportEditForm } from "./WeeklyReportEditForm";

const FORM_ID = "weekly-report-edit-drawer-form";

interface WeeklyReportEditDrawerFormProps {
    open: boolean;
    onClose: () => void;
    report: WeeklyReport | null;
    mode: "edit" | "view";
}

export const WeeklyReportEditDrawerForm = ({
    open,
    onClose,
    report,
    mode
}: WeeklyReportEditDrawerFormProps) => {
    const { t } = useTranslation();
    const { handleSave, isLoading } = useWeeklyReportEdit(onClose);

    const footer = (
        <div className="flex gap-2 justify-end w-full">
            <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
                {t("weeklyReports.editDrawer.close")}
            </Button>
            {mode === "edit" && (
                <Button type="submit" form={FORM_ID} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("weeklyReports.editDrawer.save")}
                </Button>
            )}
        </div>
    );

    return (
        <FormDrawer
            open={open}
            onClose={onClose}
            title={t("weeklyReports.editDrawer.title")}
            footer={footer}
        >
            {report && (
                <WeeklyReportEditForm
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
