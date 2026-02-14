import { memo, type ReactNode } from "react";
import type { User } from "../model";
import { getProfilePhotoUrl } from "../lib";
import { cn } from "@/shared/lib";
import { useTranslation } from "react-i18next";
import { Avatar, Badge, Switch, Label } from "@/shared/ui";
import { useUserStatus } from "@/features/user-status";

interface UserCardProps {
    user: User;
    actions?: ReactNode;
    className?: string;
    onNameClick?: () => void;
    onStatusChange?: () => void;
}

const UserCardComponent = ({
    user,
    actions,
    className,
    onNameClick,
    onStatusChange,
}: UserCardProps) => {
    const { t } = useTranslation();
    const { handleEnable, handleDisable, isLoading: isStatusLoading } = useUserStatus(user.id, {
        onSuccess: onStatusChange,
    });

    const handleStatusToggle = async () => {
        if (isStatusLoading) return;
        if (user.isActive) {
            await handleDisable();
        } else {
            await handleEnable();
        }
    };

    return (
        <article
            className={cn(
                "group relative flex h-full flex-col rounded-xl border border-border/70 bg-card/80 p-5 transition-shadow hover:z-30 hover:shadow-md focus-within:z-30 focus-within:shadow-md",
                className,
            )}
        >
            {actions && (
                <div className="absolute right-5 top-5 z-20">
                    {actions}
                </div>
            )}
            <header className="relative z-10 pr-12">
                <div className="flex items-start gap-3">
                    <Avatar
                        src={getProfilePhotoUrl(user.profilePhotoUrl) || undefined}
                        alt={user.fullName}
                        fallback={user.fullName}
                        size="lg"
                        className="flex-shrink-0 bg-primary/10 text-primary"
                    />
                    <div className="flex-1 space-y-2 min-w-0">
                        <h2
                            className={cn(
                                "text-lg font-semibold text-foreground sm:text-xl truncate",
                                onNameClick && "cursor-pointer hover:text-primary transition-colors"
                            )}
                            onClick={onNameClick}
                        >
                            {user.fullName}
                        </h2>
                        <p className="text-sm text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </header>
            <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                        <Badge
                            key={role}
                            variant="outline"
                            className="text-xs"
                        >
                            {role}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Label
                        htmlFor={`user-status-${user.id}`}
                        className={cn(
                            "text-xs font-medium",
                            isStatusLoading && "opacity-50"
                        )}
                    >
                        {t("userCard.active")}
                    </Label>
                    <Switch
                        id={`user-status-${user.id}`}
                        checked={user.isActive}
                        onCheckedChange={handleStatusToggle}
                        disabled={isStatusLoading}
                        className={isStatusLoading ? "opacity-50" : ""}
                    />
                </div>
            </div>
        </article>
    );
};

// Custom comparison to prevent re-renders when user data hasn't changed
const arePropsEqual = (prevProps: UserCardProps, nextProps: UserCardProps) => {
    const prevUser = prevProps.user;
    const nextUser = nextProps.user;

    return (
        prevUser.id === nextUser.id &&
        prevUser.email === nextUser.email &&
        prevUser.fullName === nextUser.fullName &&
        prevUser.isActive === nextUser.isActive &&
        prevUser.profilePhotoUrl === nextUser.profilePhotoUrl &&
        prevUser.roles.length === nextUser.roles.length &&
        prevUser.roles.every((role, index) => role === nextUser.roles[index]) &&
        prevProps.className === nextProps.className
    );
};

export const UserCard = memo(UserCardComponent, arePropsEqual);
