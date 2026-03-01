import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import {
    setCurrentDate as setReportCurrentDate,
    setCurrentPosition as setReportCurrentPosition,
    useGetDailyReportByDateQuery
} from "@/entities/daily-report";
import {
    setCurrentDate as setNoteCurrentDate,
    setCurrentPosition as setNoteCurrentPosition
} from "@/entities/daily-note";
import { useGetMeQuery } from "@/entities/account/api/accountApi";
import type { CurrentUserPosition } from "@/entities/auth";

const getTodayString = (): string => new Date().toISOString().split("T")[0];

export const useDailyView = () => {
    const dispatch = useAppDispatch();
    const { currentDate, currentPositionId } = useAppSelector((state) => state.dailyReport);

    const { data: currentUser } = useGetMeQuery();
    const positions: CurrentUserPosition[] = currentUser?.positions ?? [];

    // On mount: sync dailyNote slice to match dailyReport canonical state
    useEffect(() => {
        dispatch(setNoteCurrentDate(currentDate));
        if (currentPositionId) dispatch(setNoteCurrentPosition(currentPositionId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-select first position when positions load and selection is invalid
    useEffect(() => {
        if (positions.length === 0) return;
        const isCurrentValid = positions.some((p) => p.id === currentPositionId);
        if (!isCurrentValid) {
            dispatch(setReportCurrentPosition(positions[0].id));
            dispatch(setNoteCurrentPosition(positions[0].id));
        }
    }, [positions, currentPositionId, dispatch]);

    // Fetch report status for tab badge (RTK Query caches, no extra network request)
    const { data: reports = [] } = useGetDailyReportByDateQuery(currentDate);
    const report = currentPositionId
        ? (reports.find((r) => r.positionId === currentPositionId) ?? null)
        : null;

    const isNextDayDisabled = currentDate >= getTodayString();

    const handlePrevDay = useCallback(() => {
        const [y, m, d] = currentDate.split("-").map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));
        date.setUTCDate(date.getUTCDate() - 1);
        const newDate = date.toISOString().split("T")[0];
        dispatch(setReportCurrentDate(newDate));
        dispatch(setNoteCurrentDate(newDate));
    }, [currentDate, dispatch]);

    const handleNextDay = useCallback(() => {
        if (isNextDayDisabled) return;
        const [y, m, d] = currentDate.split("-").map(Number);
        const date = new Date(Date.UTC(y, m - 1, d));
        date.setUTCDate(date.getUTCDate() + 1);
        const newDate = date.toISOString().split("T")[0];
        dispatch(setReportCurrentDate(newDate));
        dispatch(setNoteCurrentDate(newDate));
    }, [currentDate, isNextDayDisabled, dispatch]);

    const handleDateChange = useCallback((date: string) => {
        dispatch(setReportCurrentDate(date));
        dispatch(setNoteCurrentDate(date));
    }, [dispatch]);

    const handlePositionChange = useCallback((positionId: string) => {
        dispatch(setReportCurrentPosition(positionId));
        dispatch(setNoteCurrentPosition(positionId));
    }, [dispatch]);

    return {
        currentDate,
        currentPositionId,
        positions,
        reportStatus: report?.status ?? null,
        isNextDayDisabled,
        handlePrevDay,
        handleNextDay,
        handleDateChange,
        handlePositionChange,
    };
};
