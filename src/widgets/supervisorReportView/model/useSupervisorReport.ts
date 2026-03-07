import { useState, useCallback, useRef, useEffect } from "react";
import {
    useGetSupervisorReportMutation,
    useGetSupervisorDepartmentsQuery,
} from "@/entities/supervisor-report";
import type { SupervisorDepartmentNode, SupervisorReportFilter } from "@/entities/supervisor-report";

function collectAllFilters(nodes: SupervisorDepartmentNode[]): SupervisorReportFilter[] {
    const filters: SupervisorReportFilter[] = [];
    const visit = (ns: SupervisorDepartmentNode[]) =>
        ns.forEach((n) => {
            n.positions.forEach((p) =>
                p.users.forEach((u) =>
                    filters.push({ userId: u.userId, positionId: p.positionId })
                )
            );
            visit(n.subDepartments);
        });
    visit(nodes);
    return filters;
}

/** Format a Date as yyyy-MM-dd using local timezone. */
const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

/** Returns today's date string (local). */
const todayStr = (): string => formatDate(new Date());

/** Adds `days` calendar days to a yyyy-MM-dd string. */
const addDays = (dateStr: string, days: number): string => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return formatDate(d);
};

/** Default period: 30 days ending today. */
const defaultRange = () => {
    const to = todayStr();
    const from = addDays(to, -30);
    return { dateFrom: from, dateTo: to };
};

export const useSupervisorReport = () => {
    const [dateFrom, setDateFrom] = useState(() => defaultRange().dateFrom);
    const [dateTo, setDateTo] = useState(() => defaultRange().dateTo);
    const [selectedFilters, setSelectedFilters] = useState<SupervisorReportFilter[]>([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const contentRef = useRef<HTMLDivElement | null>(null);

    const [generateReport, { data: report, isLoading, isError, error }] =
        useGetSupervisorReportMutation();

    const { data: departments = [], isLoading: isLoadingDepartments } =
        useGetSupervisorDepartmentsQuery();

    // Pre-select all user-position pairs on first load
    const didInitDepts = useRef(false);
    useEffect(() => {
        if (!didInitDepts.current && departments.length > 0) {
            didInitDepts.current = true;
            setSelectedFilters(collectAllFilters(departments));
        }
    }, [departments]);

    const is409 =
        isError &&
        error != null &&
        "status" in error &&
        error.status === 409;

    /* ---- Date navigation ------------------------------------------------ */

    const handleDateRangeChange = useCallback((from: string, to: string) => {
        setDateFrom(from);
        setDateTo(to);
    }, []);

    /** Shift the entire period back by the same number of days. */
    const handlePrevPeriod = useCallback(() => {
        const d = new Date(dateFrom + "T00:00:00");
        const t2 = new Date(dateTo + "T00:00:00");
        const days = Math.round((t2.getTime() - d.getTime()) / 86_400_000) + 1;
        setDateFrom(addDays(dateFrom, -days));
        setDateTo(addDays(dateTo, -days));
    }, [dateFrom, dateTo]);

    /** Shift the entire period forward by the same number of days. */
    const handleNextPeriod = useCallback(() => {
        const d = new Date(dateFrom + "T00:00:00");
        const t2 = new Date(dateTo + "T00:00:00");
        const days = Math.round((t2.getTime() - d.getTime()) / 86_400_000) + 1;
        setDateFrom(addDays(dateFrom, days));
        setDateTo(addDays(dateTo, days));
    }, [dateFrom, dateTo]);

    const isNextDisabled = false;

    /* ---- Filter --------------------------------------------------------- */

    const handleFiltersChange = useCallback((filters: SupervisorReportFilter[]) => {
        setSelectedFilters(filters);
    }, []);

    const toggleFilter = useCallback(() => setIsFilterOpen((v) => !v), []);
    const closeFilter = useCallback(() => setIsFilterOpen(false), []);

    /* ---- Generate ------------------------------------------------------- */

    const doGenerate = useCallback(async () => {
        // If filters haven't been initialized yet (departments still loading),
        // fall back to all user-position pairs from the already-loaded departments.
        const filtersToSend = selectedFilters.length > 0
            ? selectedFilters
            : collectAllFilters(departments);
        try {
            const result = await generateReport({
                weekStart: dateFrom,
                weekEnd: dateTo,
                filters: filtersToSend,
            });
            if ("data" in result) {
                // success is visible from the rendered report
            }
        } catch {
            // errors handled by global error store or suppress options
        }
        setConfirmOpen(false);
    }, [generateReport, dateFrom, dateTo, selectedFilters, departments]);

    const handleGenerateRequest = useCallback(() => {
        if (report) {
            setConfirmOpen(true);
        } else {
            void doGenerate();
        }
    }, [report, doGenerate]);

    const handleConfirmRegenerate = useCallback(() => {
        void doGenerate();
    }, [doGenerate]);

    const handleCancelRegenerate = useCallback(() => {
        setConfirmOpen(false);
    }, []);

    /* ---- Copy ----------------------------------------------------------- */

    const handleCopy = useCallback(async () => {
        if (!contentRef.current) return;
        const html = contentRef.current.innerHTML;
        const plain = contentRef.current.innerText;
        await navigator.clipboard.write([
            new ClipboardItem({
                "text/html": new Blob([html], { type: "text/html" }),
                "text/plain": new Blob([plain], { type: "text/plain" }),
            }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    return {
        dateFrom,
        dateTo,
        report: report ?? null,
        isLoading,
        isError,
        is409,
        isGenerating: isLoading,
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
    };
};
