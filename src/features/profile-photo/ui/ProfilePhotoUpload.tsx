import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Camera, Trash2, Upload, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/shared/lib/auth/hooks";
import { Avatar } from "@/shared/ui";
import { Button } from "@/shared/ui";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui";
import { useProfilePhoto } from "../model";

export const ProfilePhotoUpload = () => {
    const { t } = useTranslation();
    const user = useCurrentUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const { uploadPhoto, deletePhoto, handleFileSelect, preview, isLoading, isUploading } = useProfilePhoto();

    const hasPhoto = user?.profilePhotoUrl;

    const handleAvatarClick = () => {
        if (hasPhoto) {
            setShowPreviewDialog(true);
        } else {
            fileInputRef.current?.click();
        }
    };

    const handleChangePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        await handleFileSelect(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            await uploadPhoto(selectedFile);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleCancelUpload = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        await deletePhoto();
        setShowDeleteDialog(false);
    };

    const displayAvatar = preview || user?.profilePhotoUrl;
    const fallback = user?.name || "?";

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar with upload trigger */}
            <div className="relative group">
                <Avatar
                    src={displayAvatar}
                    alt={user?.name}
                    fallback={fallback}
                    size="xl"
                />
                <button
                    onClick={handleAvatarClick}
                    disabled={isLoading}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    aria-label={t("profile.changePhoto")}
                >
                    {isLoading ? (
                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                    ) : (
                        <Camera className="w-12 h-12 text-white" />
                    )}
                </button>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
            />

            {/* Action buttons */}
            {selectedFile ? (
                // Upload preview and actions
                <div className="flex gap-2">
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        size="sm"
                        className="min-h-[48px] md:min-h-0"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t("profile.uploading")}
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                {t("profile.uploadPhoto")}
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleCancelUpload}
                        disabled={isUploading}
                        variant="outline"
                        size="sm"
                        className="min-h-[48px] md:min-h-0"
                    >
                        {t("common.cancel")}
                    </Button>
                </div>
            ) : (
                // Default buttons
                <div className="flex gap-2">
                    <Button
                        onClick={handleChangePhotoClick}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="min-h-[48px] md:min-h-0"
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        {hasPhoto ? t("profile.changePhoto") : t("profile.uploadPhoto")}
                    </Button>
                    {hasPhoto && (
                        <Button
                            onClick={handleDeleteClick}
                            disabled={isLoading}
                            size="sm"
                            variant="outline"
                            className="min-h-[48px] md:min-h-0"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("profile.deletePhoto")}
                        </Button>
                    )}
                </div>
            )}

            {/* Photo preview dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t("profile.profilePhoto")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                        <img
                            src={user?.profilePhotoUrl}
                            alt={user?.name}
                            className="max-h-[70vh] max-w-full rounded-lg object-contain"
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("profile.deletePhotoTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("profile.deletePhotoConfirm")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setShowDeleteDialog(false)}
                            variant="outline"
                            className="min-h-[48px] md:min-h-0"
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={isLoading}
                            variant="destructive"
                            className="min-h-[48px] md:min-h-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t("profile.deleting")}
                                </>
                            ) : (
                                t("common.delete")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
