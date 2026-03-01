import { useState } from "react";
import { NoteInputBar } from "@/features/daily-note-create";
import { NoteDeleteDialog } from "@/features/daily-note-delete";
import { useNoteUpdate } from "@/features/daily-note-update";
import type { DailyNote } from "@/entities/daily-note";
import { useDailyNoteChat } from "../model/useDailyNoteChat";
import { DateHeader } from "./DateHeader";
import { MessagesList } from "./MessagesList";
import { PositionSelector } from "./PositionSelector";

interface DailyNoteChatProps {
    externalControls?: boolean;
}

export const DailyNoteChat = ({ externalControls = false }: DailyNoteChatProps) => {
    const {
        messages,
        currentDate,
        currentPositionId,
        positions,
        isInitialLoading,
        isLoadingOlder,
        hasMoreOlder,
        chatBottomRef,
        scrollContainerRef,
        handleNoteCreated,
        handleNoteUpdated,
        handleNoteDeleted,
        handleLoadMore,
        changeDate,
        changePosition
    } = useDailyNoteChat();

    const [editingNote, setEditingNote] = useState<DailyNote | null>(null);
    const [deletingNote, setDeletingNote] = useState<DailyNote | null>(null);

    const { handleUpdate, isLoading: isUpdateLoading } = useNoteUpdate({
        onSuccess: (updatedNote) => {
            handleNoteUpdated(updatedNote);
            setEditingNote(null);
        }
    });

    const handleEdit = (note: DailyNote) => {
        setEditingNote(note);
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
    };

    const handleSubmitEdit = async (content: string) => {
        if (!editingNote) return;
        await handleUpdate(editingNote.id, content, editingNote.noteDate, editingNote.positionId);
    };

    const handleDelete = (note: DailyNote) => {
        setDeletingNote(note);
    };

    const handleDeleteSuccess = () => {
        if (deletingNote) {
            handleNoteDeleted(deletingNote.id);
        }
        setDeletingNote(null);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden">
            {!externalControls && <DateHeader currentDate={currentDate} onDateChange={changeDate} />}

            {!externalControls && (
                <PositionSelector
                    positions={positions}
                    currentPositionId={currentPositionId}
                    onPositionChange={changePosition}
                />
            )}

            <MessagesList
                messages={messages}
                isInitialLoading={isInitialLoading}
                isLoadingOlder={isLoadingOlder}
                hasMoreOlder={hasMoreOlder}
                chatBottomRef={chatBottomRef}
                scrollContainerRef={scrollContainerRef}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onLoadMore={handleLoadMore}
            />

            <NoteInputBar
                noteDate={currentDate}
                positionId={currentPositionId ?? ""}
                onNoteCreated={handleNoteCreated}
                editingNote={editingNote}
                onCancelEdit={handleCancelEdit}
                onSubmitEdit={handleSubmitEdit}
                isEditSubmitting={isUpdateLoading}
            />

            <NoteDeleteDialog
                noteId={deletingNote?.id ?? null}
                open={deletingNote !== null}
                onOpenChange={(open) => { if (!open) setDeletingNote(null); }}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};
