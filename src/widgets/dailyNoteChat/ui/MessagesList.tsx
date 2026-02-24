import { useTranslation } from "react-i18next";
import { ChevronUp } from "lucide-react";
import { NoteMessage, NoteMessageSkeleton } from "@/entities/daily-note";
import type { DailyNote } from "@/entities/daily-note";

interface MessagesListProps {
    messages: DailyNote[];
    isInitialLoading: boolean;
    isLoadingOlder: boolean;
    hasMoreOlder: boolean;
    chatBottomRef: React.RefObject<HTMLDivElement | null>;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    onEdit: (note: DailyNote) => void;
    onDelete: (note: DailyNote) => void;
    onLoadMore: () => void;
}

export const MessagesList = ({
    messages,
    isInitialLoading,
    isLoadingOlder,
    hasMoreOlder,
    chatBottomRef,
    scrollContainerRef,
    onEdit,
    onDelete,
    onLoadMore
}: MessagesListProps) => {
    const { t } = useTranslation();

    if (isInitialLoading) {
        return (
            <div className="custom-scrollbar flex flex-1 flex-col justify-end gap-3 overflow-y-auto bg-brand/5 p-4">
                <NoteMessageSkeleton width="sm" />
                <NoteMessageSkeleton width="lg" />
                <NoteMessageSkeleton width="md" />
                <NoteMessageSkeleton width="lg" />
                <NoteMessageSkeleton width="sm" />
            </div>
        );
    }

    return (
        <div ref={scrollContainerRef} className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-brand/5 p-4">
            {/* Load more button */}
            {hasMoreOlder && !isLoadingOlder && (
                <div className="mb-3 flex justify-center">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <ChevronUp className="h-3.5 w-3.5" />
                        {t("dailyNotes.messages.loadMore")}
                    </button>
                </div>
            )}

            {/* Loading older indicator */}
            {isLoadingOlder && (
                <div className="mb-3 flex flex-col gap-2">
                    <NoteMessageSkeleton width="md" />
                    <NoteMessageSkeleton width="sm" />
                </div>
            )}

            {/* No more older messages */}
            {!hasMoreOlder && messages.length > 0 && (
                <div className="mb-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">
                        {t("dailyNotes.messages.noMoreOlder")}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>
            )}

            {/* Empty state */}
            {messages.length === 0 && !isInitialLoading && (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-center text-sm text-muted-foreground">
                        {t("dailyNotes.messages.empty")}
                    </p>
                </div>
            )}

            {/* Messages */}
            <div className="flex flex-col gap-2">
                {messages.map((note) => (
                    <NoteMessage
                        key={note.id}
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Bottom scroll anchor */}
            <div ref={chatBottomRef} className="h-1 w-full shrink-0" />
        </div>
    );
};
