import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { updateNoteSchema, type UpdateNoteFormData } from "@/features/daily-note";
import { useNoteUpdate } from "../model/useNoteUpdate";
import type { DailyNote } from "@/entities/daily-note";

const MAX_LENGTH = 5000;

interface NoteEditInlineProps {
    note: DailyNote;
    onCancel: () => void;
    onSuccess: () => void;
}

export const NoteEditInline = ({ note, onCancel, onSuccess }: NoteEditInlineProps) => {
    const { t } = useTranslation();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { handleUpdate, isLoading } = useNoteUpdate({ onSuccess });

    const { register, handleSubmit, watch, formState: { errors } } = useForm<UpdateNoteFormData>({
        resolver: zodResolver(updateNoteSchema),
        defaultValues: {
            content: note.content,
            noteDate: note.noteDate,
            positionId: note.positionId
        }
    });

    const { ref: formRef, ...contentRest } = register("content");

    const content = watch("content");
    const isOverLimit = content.length > MAX_LENGTH;

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, []);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    const onSubmit = handleSubmit(async (data) => {
        await handleUpdate(note.id, data.content, data.noteDate, data.positionId);
    });

    return (
        <div className="flex justify-end">
            <div className="w-full max-w-[85%] sm:max-w-[70%]">
                <form onSubmit={onSubmit} className="space-y-2">
                    <div className="relative">
                        <textarea
                            {...contentRest}
                            ref={(el) => {
                                formRef(el);
                                textareaRef.current = el;
                            }}
                            rows={3}
                            onInput={adjustHeight}
                            className={cn(
                                "w-full resize-none rounded-2xl border border-border bg-muted/30 px-4 pb-8 pt-3 text-sm leading-relaxed",
                                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                "min-h-[80px] max-h-[200px] overflow-y-auto",
                                (isOverLimit || errors.content) && "border-destructive focus:ring-destructive"
                            )}
                            disabled={isLoading}
                        />
                        <div className={cn(
                            "absolute bottom-3 right-3 text-xs",
                            isOverLimit ? "text-destructive" : "text-muted-foreground/50"
                        )}>
                            {t("dailyNotes.input.characterCount", { count: content.length })}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="min-h-[40px]"
                        >
                            {t("dailyNotes.actions.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            isLoading={isLoading}
                            disabled={isOverLimit || isLoading}
                            className="min-h-[40px]"
                        >
                            {t("dailyNotes.actions.save")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
