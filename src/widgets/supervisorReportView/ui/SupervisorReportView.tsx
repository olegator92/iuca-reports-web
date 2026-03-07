import { useTranslation } from "react-i18next";
import { RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import {
    Loader,
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "@/shared/ui";
import { useSupervisorReport } from "../model/useSupervisorReport";
import { SupervisorReportHeader } from "./SupervisorReportHeader";
import { SupervisorReportContent } from "./SupervisorReportContent";
import { DepartmentFilterTree } from "./DepartmentFilterTree";

export const SupervisorReportView = () => {
    const { t } = useTranslation();

    const {
        dateFrom,
        dateTo,
        report,
        isLoading,
        isError,
        is409,
        isGenerating,
        isNextDisabled,
        departments,
        isLoadingDepartments,
        selectedFilters,
        isFilterOpen,
        confirmOpen,
        copied,
        contentRef,
        handleDateRangeChange,
        handlePrevPeriod,
        handleNextPeriod,
        handleFiltersChange,
        handleGenerateRequest,
        handleConfirmRegenerate,
        handleCancelRegenerate,
        handleCopy,
        toggleFilter,
        closeFilter,
    } = useSupervisorReport();

    const hasContent = !!report;
    const showSidebar = !is409 && !isError && (departments.length > 0 || isLoadingDepartments);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center py-12">
                    <Loader />
                </div>
            );
        }

        if (is409) {
            return (
                <div className="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
                    <p className="text-muted-foreground text-sm">{t("supervisorReports.notSupervisor")}</p>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center gap-2 py-16 px-4 text-center">
                    <p className="text-muted-foreground text-sm">{t("errors.globalDefaultMessage")}</p>
                </div>
            );
        }

        return (
            <SupervisorReportContent
                content={report ?? null}
                hasReport={!!report}
                contentRef={contentRef}
            />
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <SupervisorReportHeader
                dateFrom={dateFrom}
                dateTo={dateTo}
                isNextDisabled={isNextDisabled}
                onDateRangeChange={handleDateRangeChange}
                onPrev={handlePrevPeriod}
                onNext={handleNextPeriod}
                onToggleFilter={showSidebar ? toggleFilter : undefined}
                activeFilterCount={selectedFilters.length}
            />

            {/* Main body: optional sidebar + scrollable content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar — always visible when departments available */}
                {showSidebar && (
                    <div className="hidden md:flex md:w-56 lg:w-64 shrink-0 flex-col border-r bg-background">
                        {isLoadingDepartments ? (
                            <div className="flex justify-center py-8">
                                <Loader />
                            </div>
                        ) : (
                            <DepartmentFilterTree
                                departments={departments}
                                selectedFilters={selectedFilters}
                                onChange={handleFiltersChange}
                            />
                        )}
                    </div>
                )}

                {/* Scrollable content */}
                <div className="custom-scrollbar flex flex-col flex-1 gap-4 p-4 overflow-y-auto bg-brand/5">
                    {renderContent()}
                </div>
            </div>

            {/* Footer action bar */}
            {!isLoading && !is409 && !isError && (
                <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t px-4 pt-3 pb-8 md:py-4">
                    {/* Generate / Regenerate */}
                    <Button
                        onClick={handleGenerateRequest}
                        disabled={isGenerating}
                        className="min-h-[48px] md:min-h-0"
                    >
                        {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="ml-1.5">
                            {report
                                ? t("supervisorReports.actions.regenerate")
                                : t("supervisorReports.actions.generate")}
                        </span>
                    </Button>

                    {/* Copy button */}
                    {hasContent && (
                        <Button
                            size="icon"
                            variant="outline"
                            className="min-h-[48px] min-w-[48px] md:min-h-0 md:min-w-0"
                            onClick={() => void handleCopy()}
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            )}

            {/* Mobile filter drawer */}
            {showSidebar && (
                <Drawer open={isFilterOpen} onOpenChange={(open) => !open && closeFilter()}>
                    <DrawerContent className="sm:max-w-xs">
                        <DrawerHeader>
                            <DrawerTitle>{t("supervisorReports.filterPositions")}</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex-1 overflow-hidden min-h-0">
                            <DepartmentFilterTree
                                departments={departments}
                                selectedFilters={selectedFilters}
                                onChange={handleFiltersChange}
                            />
                        </div>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button variant="outline" onClick={closeFilter} className="min-h-[48px] w-full">
                                    {t("common.close")}
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}

            {/* Regenerate confirmation dialog */}
            <Dialog open={confirmOpen} onOpenChange={(open) => !open && handleCancelRegenerate()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("supervisorReports.generate.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("supervisorReports.generate.confirmDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={handleCancelRegenerate}>
                                {t("common.cancel")}
                            </Button>
                        </DialogClose>
                        <Button onClick={handleConfirmRegenerate} disabled={isGenerating}>
                            {isGenerating && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                            {t("supervisorReports.generate.confirmButton")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
