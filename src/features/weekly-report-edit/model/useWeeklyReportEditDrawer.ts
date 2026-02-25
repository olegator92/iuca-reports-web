import { useState, useCallback } from "react";
import type { WeeklyReport } from "@/entities/weekly-report";

export const useWeeklyReportEditDrawer = () => {
    const [open, setOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);

    const openDrawer = useCallback((report: WeeklyReport) => {
        setSelectedReport(report);
        setOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setOpen(false);
        // 300 ms cleanup — let drawer animation finish before clearing data
        setTimeout(() => {
            setSelectedReport(null);
        }, 300);
    }, []);

    return { open, selectedReport, openDrawer, closeDrawer };
};
