import { useState, useCallback } from "react";
import type { DailyReport } from "@/entities/daily-report";

export const useReportEditDrawer = () => {
    const [open, setOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

    const openDrawer = useCallback((report: DailyReport) => {
        setSelectedReport(report);
        setOpen(true);
    }, []);

    const closeDrawer = useCallback(() => {
        setOpen(false);
        // 300 ms cleanup timeout — let drawer animation finish before clearing data
        setTimeout(() => {
            setSelectedReport(null);
        }, 300);
    }, []);

    return { open, selectedReport, openDrawer, closeDrawer };
};
