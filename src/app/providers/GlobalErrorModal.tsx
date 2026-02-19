import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { useGlobalErrorStore } from "@/shared/lib/stores/globalErrorStore";

export const GlobalErrorModal = () => {
    const {
        isOpen,
        message,
        traceId,
        errorCode,
        details,
        clearError,
        setOpen
    } = useGlobalErrorStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            message: state.message,
            traceId: state.traceId,
            errorCode: state.errorCode,
            details: state.details,
            clearError: state.clearError,
            setOpen: state.setOpen
        }))
    );
    const [copied, setCopied] = useState(false);
    const copyTimeoutRef = useRef<number | null>(null);
    const { t } = useTranslation();

    const handleClose = useCallback(() => {
        clearError();
    }, [clearError]);

    const handleCopyTraceId = useCallback(async () => {
        if (!traceId || !navigator?.clipboard) {
            return;
        }

        try {
            await navigator.clipboard.writeText(traceId);
            setCopied(true);
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy trace id", error);
        }
    }, [traceId]);

    useEffect(() => {
        if (isOpen && details) {
            console.error("API error", {
                message,
                traceId,
                errorCode,
                details
            });
        }
    }, [details, errorCode, isOpen, message, traceId]);

    useEffect(() => {
        if (!isOpen) {
            setCopied(false);
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
                copyTimeoutRef.current = null;
            }
        }
    }, [isOpen]);

    useEffect(() => () => {
        if (copyTimeoutRef.current) {
            window.clearTimeout(copyTimeoutRef.current);
        }
    }, []);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    handleClose();
                } else {
                    setOpen(open);
                }
            }}
        >
            <DialogContent className="sm:max-w-md overflow-hidden p-0">
                <DialogHeader className="border-b border-destructive/20 bg-destructive/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-destructive/20 p-2 text-destructive">
                            <AlertCircle className="size-5" aria-hidden="true" />
                        </span>
                        <DialogTitle className="text-base font-semibold text-destructive">
                            {t("errors.globalTitle")}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-4 px-6 py-5">
                    <DialogDescription className="sr-only">
                        {message || t("errors.globalDefaultMessage")}
                    </DialogDescription>
                    <p className="text-sm font-medium text-foreground">
                        {message || t("errors.globalDefaultMessage")}
                    </p>
                    {traceId && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {t("errors.globalDescription")}
                            </p>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t("errors.traceId")}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 rounded-md border border-border bg-muted/60 px-3 py-2 font-mono text-xs">
                                        {traceId}
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleCopyTraceId}>
                                        {copied ? t("errors.copied") : t("errors.copy")}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="border-t border-border bg-muted/40 px-6 py-4">
                    <Button type="button" onClick={handleClose} className="min-h-[48px] md:min-h-0">
                        {t("common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
