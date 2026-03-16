import { useState } from "react";
import { useLocation } from "react-router-dom";
import { DailyNoteChat } from "@/widgets/dailyNoteChat";
import { DailyReportView } from "@/widgets/dailyReportView";
import { useDailyView } from "../model/useDailyView";
import { DailyDateHeader, type DailyActiveTab } from "./DailyDateHeader";
import { PositionSelector } from "./PositionSelector";

export const DailyView = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<DailyActiveTab>(
        location.state?.activeTab ?? "notes"
    );
    const {
        currentDate,
        currentPositionId,
        positions,
        reportStatus,
        isNextDayDisabled,
        handlePrevDay,
        handleNextDay,
        handleDateChange,
        handlePositionChange,
    } = useDailyView();

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <DailyDateHeader
                currentDate={currentDate}
                onDateChange={handleDateChange}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
                isNextDayDisabled={isNextDayDisabled}
                reportStatus={reportStatus}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <PositionSelector
                positions={positions}
                currentPositionId={currentPositionId}
                onPositionChange={handlePositionChange}
            />

            <div className="flex flex-1 flex-col overflow-hidden min-h-0">
                {activeTab === "notes" && <DailyNoteChat externalControls />}
                {activeTab === "report" && <DailyReportView externalControls />}
            </div>
        </div>
    );
};
