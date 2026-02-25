import { DailyNoteChat } from "@/widgets/dailyNoteChat";

export const DailyNotesPage = () => {
    return (
        <div className="-mx-2 -my-6 md:-mx-8 flex h-[calc(100%+3rem)] flex-col items-center">
            <div className="flex h-full w-full max-w-3xl flex-col">
                <DailyNoteChat />
            </div>
        </div>
    );
};
