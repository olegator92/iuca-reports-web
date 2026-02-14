import * as React from "react";

import { cn } from "@/shared/lib";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./pagination";

type BasePaginationProps = Omit<React.ComponentProps<typeof Pagination>, "children">;

type PaginationControlsProps = BasePaginationProps & {
    page: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    onNext?: () => void;
    onPrev?: () => void;
    canNext?: boolean;
    canPrev?: boolean;
    hideIfSinglePage?: boolean;
    getPageHref?: (page: number) => string;
    renderPageLabel?: (page: number) => React.ReactNode;
    pageLinkClassName?: string;
    previousClassName?: string;
    nextClassName?: string;
    contentClassName?: string;
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    page,
    totalPages,
    onPageChange,
    onNext,
    onPrev,
    canNext,
    canPrev,
    hideIfSinglePage = true,
    getPageHref = () => "#",
    renderPageLabel = (value) => value,
    pageLinkClassName,
    previousClassName,
    nextClassName,
    contentClassName,
    className,
    ...paginationProps
}) => {
    const resolvedCanPrev = canPrev ?? page > 1;
    const resolvedCanNext = canNext ?? page < totalPages;

    if (hideIfSinglePage && totalPages <= 1) {
        return null;
    }

    const handleNext = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!resolvedCanNext) {
            return;
        }
        if (onNext || onPageChange) {
            event.preventDefault();
            if (onNext) {
                onNext();
            } else if (onPageChange) {
                onPageChange(page + 1);
            }
        }
    };

    const handlePrev = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!resolvedCanPrev) {
            return;
        }
        if (onPrev || onPageChange) {
            event.preventDefault();
            if (onPrev) {
                onPrev();
            } else if (onPageChange) {
                onPageChange(page - 1);
            }
        }
    };

    const handlePageSelect = (targetPage: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!onPageChange || targetPage === page) {
            return;
        }
        event.preventDefault();
        onPageChange(targetPage);
    };

    return (
        <Pagination className={className} {...paginationProps}>
            <PaginationContent className={contentClassName}>
                <PaginationItem>
                    <PaginationPrevious
                        href={getPageHref(page - 1)}
                        onClick={handlePrev}
                        className={cn(
                            "text-muted-foreground hover:text-foreground",
                            !resolvedCanPrev && "pointer-events-none opacity-50",
                            previousClassName,
                        )}
                        aria-disabled={!resolvedCanPrev}
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                href={getPageHref(pageNumber)}
                                isActive={page === pageNumber}
                                onClick={handlePageSelect(pageNumber)}
                                className={cn("text-sm", pageLinkClassName)}
                            >
                                {renderPageLabel(pageNumber)}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext
                        href={getPageHref(page + 1)}
                        onClick={handleNext}
                        className={cn(
                            "text-muted-foreground hover:text-foreground",
                            !resolvedCanNext && "pointer-events-none opacity-50",
                            nextClassName,
                        )}
                        aria-disabled={!resolvedCanNext}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

