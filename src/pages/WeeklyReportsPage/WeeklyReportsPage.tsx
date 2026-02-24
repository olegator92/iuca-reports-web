import { WeeklyReportView } from "@/widgets/weeklyReportView";

export const WeeklyReportsPage = () => {
    return (
        <div className="-mx-2 -my-6 md:-mx-8 flex h-[calc(100%+3rem)] flex-col items-center">
            <div className="flex h-full w-full max-w-3xl flex-col">
                <WeeklyReportView />
            </div>
        </div>
    );
};
