import { useTranslation } from "react-i18next";
import { FormDrawer, Slider, Label, Button } from "@/shared/ui";

interface WeeklyReportSettingsDrawerProps {
    open: boolean;
    onClose: () => void;
    detailLevel: number;
    onChange: (value: number) => void;
}

export const WeeklyReportSettingsDrawer = ({ open, onClose, detailLevel, onChange }: WeeklyReportSettingsDrawerProps) => {
    const { t } = useTranslation();

    return (
        <FormDrawer
            open={open}
            onClose={onClose}
            title={t("weeklyReports.settings.title")}
            description={t("weeklyReports.settings.description")}
            footer={
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    {t("common.close")}
                </Button>
            }
        >
            <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Label>{t("weeklyReports.settings.detailLevel")}</Label>
                        <span className="text-sm font-medium text-brand tabular-nums">
                            {t("weeklyReports.settings.detailLevelValue", { value: detailLevel })}
                        </span>
                    </div>
                    <Slider
                        value={detailLevel}
                        min={1}
                        max={10}
                        onChange={onChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>10</span>
                    </div>
                </div>
            </div>
        </FormDrawer>
    );
};
