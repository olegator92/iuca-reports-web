import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuItem } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DailyNote } from "../model/types";

interface NoteMessageProps {
    note: DailyNote;
    onEdit: (note: DailyNote) => void;
    onDelete: (note: DailyNote) => void;
    className?: string;
}

const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
};

export const NoteMessage = ({ note, onEdit, onDelete, className }: NoteMessageProps) => {
    const { t } = useTranslation();

    return (
        <div className={cn("flex justify-end", className)}>
            <div className="relative max-w-[85%] sm:max-w-[70%]">
                {note.positionName && (
                    <p className="mb-1 text-right text-xs text-muted-foreground/70">
                        {note.positionName}
                    </p>
                )}
                <div className="relative rounded-2xl rounded-tr-sm bg-brand py-3 pl-4 pr-9 text-white shadow-sm">
                    <div className="absolute right-1 top-1">
                        <DropdownMenu
                            trigger={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full text-white/70 hover:bg-white/15 hover:text-white"
                                    aria-label={t("dailyNotes.actions.openMenu")}
                                >
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            }
                            align="end"
                            placement="bottom"
                        >
                            <DropdownMenuItem
                                icon={<Pencil className="h-4 w-4" />}
                                onClick={() => onEdit(note)}
                            >
                                {t("dailyNotes.actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                icon={<Trash2 className="h-4 w-4" />}
                                destructive
                                onClick={() => onDelete(note)}
                            >
                                {t("dailyNotes.actions.delete")}
                            </DropdownMenuItem>
                        </DropdownMenu>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {note.content}
                    </p>
                    <div className="mt-1 flex items-center justify-end gap-1.5">
                        {note.updatedAt && (
                            <span className="text-xs text-white/60">
                                {t("dailyNotes.edited")}
                            </span>
                        )}
                        <span className="text-xs text-white/70">
                            {formatTime(note.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
