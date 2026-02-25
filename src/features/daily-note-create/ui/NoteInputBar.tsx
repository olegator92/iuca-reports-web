import { useRef, useState, useCallback, useEffect, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Check, Pencil, Send, X } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useNoteCreate } from "../model/useNoteCreate";
import type { DailyNote } from "@/entities/daily-note";

const MAX_LENGTH = 5000;

interface NoteInputBarProps {
    noteDate: string;
    positionId: string;
    onNoteCreated?: (note: DailyNote) => void;
    // Edit mode
    editingNote?: DailyNote | null;
    onCancelEdit?: () => void;
    onSubmitEdit?: (content: string) => Promise<void>;
    isEditSubmitting?: boolean;
}

export const NoteInputBar = ({
    noteDate,
    positionId,
    onNoteCreated,
    editingNote,
    onCancelEdit,
    onSubmitEdit,
    isEditSubmitting
}: NoteInputBarProps) => {
    const { t } = useTranslation();
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { handleCreate, isLoading } = useNoteCreate({
        onSuccess: (note) => {
            setContent("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            onNoteCreated?.(note);
            requestAnimationFrame(() => {
                textareaRef.current?.focus();
            });
        }
    });

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }, []);

    // Two-phase sync when entering/leaving edit mode.
    // Phase 1: set content state (DOM not yet updated at this point).
    // Phase 2: after React flushes the new content to the DOM, measure and apply height + focus.
    const editingNoteId = editingNote?.id ?? null;
    const justEnteredEditRef = useRef(false);

    useEffect(() => {
        if (editingNoteId === null) {
            setContent("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
            return;
        }
        setContent(editingNote!.content);
        justEnteredEditRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editingNoteId]);

    useEffect(() => {
        if (!justEnteredEditRef.current) return;
        justEnteredEditRef.current = false;
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, [content]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        adjustHeight();
    };

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed || trimmed.length > MAX_LENGTH) return;

        if (editingNote) {
            if (isEditSubmitting) return;
            await onSubmitEdit?.(trimmed);
        } else {
            if (isLoading || !positionId) return;
            await handleCreate(trimmed, noteDate, positionId);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Escape" && editingNote) {
            e.preventDefault();
            onCancelEdit?.();
            return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const trimmedLength = content.trim().length;
    const isOverLimit = content.length > MAX_LENGTH;
    const isEmpty = trimmedLength === 0;
    const isCurrentlyLoading = editingNote ? !!isEditSubmitting : isLoading;
    const isDisabled = isEmpty || isOverLimit || isCurrentlyLoading || (!editingNote && !positionId);

    return (
        <div className="border-t border-border bg-background px-3 pt-2 pb-5 sm:px-4">
            {/* Edit mode banner */}
            {editingNote && (
                <div className="mb-2 flex items-start gap-2 rounded-lg border-l-2 border-brand bg-brand/10 px-3 py-2">
                    <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-brand">{t("dailyNotes.input.editing")}</p>
                        <p className="truncate text-xs text-muted-foreground">{editingNote.content}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                        aria-label={t("dailyNotes.actions.cancel")}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="flex items-start gap-2">
                <div className="relative flex-1">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t("dailyNotes.input.placeholder")}
                        rows={1}
                        className={cn(
                            "w-full resize-none rounded-2xl border border-border bg-muted/30 px-4 py-[14px] text-sm leading-5 placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                            "min-h-[48px] max-h-[160px] overflow-y-auto scrollbar-none",
                            isOverLimit && "border-destructive focus:ring-destructive"
                        )}
                        disabled={isCurrentlyLoading || (!editingNote && !positionId)}
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={isDisabled}
                    isLoading={isCurrentlyLoading}
                    size="icon"
                    className="h-12 w-12 shrink-0 rounded-full"
                    aria-label={editingNote ? t("dailyNotes.actions.save") : t("dailyNotes.input.send")}
                >
                    {editingNote ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
};
