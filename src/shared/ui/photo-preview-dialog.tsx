import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

export interface PhotoPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUrl?: string | null;
  userName?: string;
  title?: string;
}

export const PhotoPreviewDialog = ({
  open,
  onOpenChange,
  photoUrl,
  userName,
  title,
}: PhotoPreviewDialogProps) => {
  if (!photoUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <img
            src={photoUrl}
            alt={userName}
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
