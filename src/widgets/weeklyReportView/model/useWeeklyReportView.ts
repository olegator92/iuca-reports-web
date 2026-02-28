import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import { setWeek, setCurrentPosition } from "@/entities/weekly-report";
import { useGetWeeklyReportsByRangeQuery } from "@/entities/weekly-report";
import { useGetDailyReportsByRangeQuery } from "@/entities/daily-report";
import { useGetMeQuery } from "@/entities/account/api/accountApi";
import { getWorkWeekBounds } from "@/shared/lib";
import type { CurrentUserPosition } from "@/entities/auth";

export const useWeeklyReportView = () => {
    const dispatch = useAppDispatch();
    const { currentWeekStart, currentWeekEnd, currentPositionId } = useAppSelector(
        (state) => state.weeklyReport
    );

    // Fetch current user to get their positions
    const { data: currentUser } = useGetMeQuery();
    const positions: CurrentUserPosition[] = currentUser?.positions ?? [];

    // Reset to current week if the stored week is in the future (stale state)
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        if (currentWeekStart > today) {
            const { weekStart, weekEnd } = getWorkWeekBounds(new Date());
            dispatch(setWeek({ weekStart, weekEnd }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-select first position when positions load and current selection is invalid
    useEffect(() => {
        if (positions.length === 0) return;
        const isCurrentValid = positions.some((p) => p.id === currentPositionId);
        if (!isCurrentValid) {
            dispatch(setCurrentPosition(positions[0].id));
        }
    }, [positions, currentPositionId, dispatch]);

    // Fetch all weekly reports for the current week (one per position)
    const {
        data: weeklyReports = [],
        isLoading: isWeeklyLoading,
        isError: isWeeklyError
    } = useGetWeeklyReportsByRangeQuery(
        { weekStart: currentWeekStart, weekEnd: currentWeekEnd },
        { skip: !currentPositionId }
    );

    // Find the weekly report for the selected position
    const weeklyReport = currentPositionId
        ? (weeklyReports.find((r) => r.positionId === currentPositionId) ?? null)
        : null;

    // Fetch all daily reports in the week for the "Daily Reports" tab
    const {
        data: allDailyReports = [],
        isLoading: isDailyLoading,
        isError: isDailyError
    } = useGetDailyReportsByRangeQuery(
        { dateFrom: currentWeekStart, dateTo: currentWeekEnd },
        { skip: !currentPositionId }
    );

    // Filter daily reports to the selected position and only "Generated" ones
    const dailyReports = currentPositionId
        ? allDailyReports.filter((r) => r.positionId === currentPositionId && r.status === "Submitted")
        : [];

    const handleWeekChange = useCallback(
        (weekStart: string, weekEnd: string) => {
            dispatch(setWeek({ weekStart, weekEnd }));
        },
        [dispatch]
    );

    const handlePositionChange = useCallback(
        (positionId: string) => {
            dispatch(setCurrentPosition(positionId));
        },
        [dispatch]
    );

    return {
        currentWeekStart,
        currentWeekEnd,
        currentPositionId,
        positions,
        weeklyReport,
        dailyReports,
        isLoading: isWeeklyLoading || isDailyLoading,
        isError: isWeeklyError || isDailyError,
        handleWeekChange,
        handlePositionChange
    };
};
