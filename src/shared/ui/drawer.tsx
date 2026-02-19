import * as React from "react";
import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            className,
        )}
        {...props}
    />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentProps
    extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
    showCloseButton?: boolean;
}

const DrawerContent = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Content>,
    DrawerContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => {
    const { t } = useTranslation();

    return (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
            ref={ref}
            style={{ "--tw-enter-translate-x": "100%", "--tw-exit-translate-x": "100%" } as React.CSSProperties}
            className={cn(
                "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-full flex-col border-l border-border bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right duration-300 sm:max-w-md lg:max-w-xl",
                className,
            )}
            {...props}
        >
            {showCloseButton && (
                <DrawerPrimitive.Close
                    className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">{t("common.close")}</span>
                </DrawerPrimitive.Close>
            )}
            <div className="flex h-full flex-col overflow-hidden">{children}</div>
        </DrawerPrimitive.Content>
    </DrawerPortal>
    );
});
DrawerContent.displayName = DrawerPrimitive.Content.displayName;

const DrawerHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col gap-1 border-b border-border/60 px-6 pb-4 pt-6 pr-14 text-left",
            className,
        )}
        {...props}
    />
);

const DrawerFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col gap-2 border-t border-border/60 px-6 pt-6 pb-8 sm:flex-row sm:justify-end",
            className,
        )}
        {...props}
    />
);

const DrawerTitle = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold text-foreground", className)}
        {...props}
    />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
    React.ElementRef<typeof DrawerPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
    Drawer,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
};
