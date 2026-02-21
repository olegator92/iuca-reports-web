import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { User } from "@/entities/user/model";
import type { Position } from "@/entities/position/model";
import { useRemovePositionFromUserMutation } from "@/entities/user/api";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui";

interface RemovePositionButtonProps {
    user: User;
    position: Position;
}

export const RemovePositionButton = ({ user, position }: RemovePositionButtonProps) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [removePosition, { isLoading }] = useRemovePositionFromUserMutation();

    const handleRemove = async () => {
        try {
            await removePosition({
                userId: user.id,
                positionId: position.id
            }).unwrap();
            setIsOpen(false);
        } catch {
            // Error handled by global error handler
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
                <X className="h-4 w-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {t("positions.removePosition", { position: position.name })}
                        </DialogTitle>
                        <DialogDescription>
                            {t("positions.removePositionDescription", {
                                position: position.name
                            })}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={isLoading}
                            className="min-h-[48px] md:min-h-0"
                        >
                            {isLoading ? t("common.loading") : t("common.delete")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
