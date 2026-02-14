import type { ReactNode } from "react";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "./drawer";
import { cn } from "@/shared/lib";

interface FormDrawerProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    contentClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    showCloseButton?: boolean;
}

export const FormDrawer = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    contentClassName,
    bodyClassName,
    footerClassName,
    showCloseButton = true,
}: FormDrawerProps) => {
    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            onClose();
        }
    };

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent showCloseButton={showCloseButton} className={contentClassName}>
                {(title || description !== undefined) && (
                    <DrawerHeader>
                        {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                        <DrawerDescription>{description || ""}</DrawerDescription>
                    </DrawerHeader>
                )}
                <div className={cn("flex-1 overflow-y-auto px-6 py-6 pb-6", bodyClassName)}>{children}</div>
                {footer ? <DrawerFooter className={footerClassName}>{footer}</DrawerFooter> : null}
            </DrawerContent>
        </Drawer>
    );
};

export type { FormDrawerProps };
