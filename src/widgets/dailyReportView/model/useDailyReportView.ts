import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import { setCurrentDate, setCurrentPosition } from "@/entities/daily-report";
import { useGetDailyReportByDateQuery } from "@/entities/daily-report";
import { useGetMeQuery } from "@/entities/account/api/accountApi";
import type { CurrentUserPosition } from "@/entities/auth";

const getTodayString = (): string => new Date().toISOString().split("T")[0];

export const useDailyReportView = () => {
    const dispatch = useAppDispatch();
    const { currentDate, currentPositionId } = useAppSelector((state) => state.dailyReport);

    // Fetch current user to get their positions
    const { data: currentUser } = useGetMeQuery();
    const positions: CurrentUserPosition[] = currentUser?.positions ?? [];

    // Reset to today if the stored date is in the future (stale state)
    useEffect(() => {
        const today = getTodayString();
        if (currentDate > today) {
            dispatch(setCurrentDate(today));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-select first position when positions load and selection is invalid
    useEffect(() => {
        if (positions.length === 0) return;
        const isCurrentValid = positions.some((p) => p.id === currentPositionId);
        if (!isCurrentValid) {
            dispatch(setCurrentPosition(positions[0].id));
        }
    }, [positions, currentPositionId, dispatch]);

    // Fetch all reports for the current date (always returns array, never 404)
    const { data: reports = [], isLoading, isError } = useGetDailyReportByDateQuery(currentDate);

    // Find the report for the currently selected position
    const report = currentPositionId
        ? (reports.find((r) => r.positionId === currentPositionId) ?? null)
        : null;

    const handleDateChange = useCallback((date: string) => {
        dispatch(setCurrentDate(date));
    }, [dispatch]);

    const handlePositionChange = useCallback((positionId: string) => {
        dispatch(setCurrentPosition(positionId));
    }, [dispatch]);

    return {
        currentDate,
        currentPositionId,
        positions,
        report,
        isLoading,
        isError,
        handleDateChange,
        handlePositionChange
    };
};
