import { useEffect, useLayoutEffect, useRef, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/stores/mainStore/hooks";
import { useGetDailyNotesQuery, incrementOldestPage, resetChat, setCurrentDate, setCurrentPosition } from "@/entities/daily-note";
import type { DailyNote } from "@/entities/daily-note";
import { useGetMeQuery } from "@/entities/account/api/accountApi";
import type { CurrentUserPosition } from "@/entities/auth";

export const useDailyNoteChat = () => {
    const dispatch = useAppDispatch();
    const { currentDate, currentPositionId, loadedOldestPage, pageSize } = useAppSelector((state) => state.dailyNote);

    // Fetch current user from /account/me to get their positions (accessible to all authenticated users)
    const { data: currentUser } = useGetMeQuery();
    const positions: CurrentUserPosition[] = currentUser?.positions ?? [];

    // Auto-select position when positions load and nothing is selected (or selection is no longer valid)
    useEffect(() => {
        if (positions.length === 0) return;

        const isCurrentPositionValid = positions.some((p) => p.id === currentPositionId);
        if (!isCurrentPositionValid) {
            dispatch(setCurrentPosition(positions[0].id));
        }
    }, [positions, currentPositionId, dispatch]);

    // Accumulated messages in chronological order (oldest first)
    const [messages, setMessages] = useState<DailyNote[]>([]);
    const prevDateRef = useRef(currentDate);
    const prevPositionRef = useRef(currentPositionId);
    const chatBottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollRestoreRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(null);

    // Fetch the current oldest page (sortDescending=true means page 1 = most recent)
    const { data, isLoading, isFetching } = useGetDailyNotesQuery({
        page: loadedOldestPage,
        pageSize,
        date: currentDate,
        positionId: currentPositionId ?? undefined,
        sortDescending: true
    });

    const isInitialLoading = isLoading && messages.length === 0;
    const isLoadingOlder = isFetching && messages.length > 0;
    const hasMoreOlder = data ? loadedOldestPage < data.totalPages : false;

    // When date or position changes: reset accumulated messages
    useEffect(() => {
        const dateChanged = prevDateRef.current !== currentDate;
        const positionChanged = prevPositionRef.current !== currentPositionId;

        if (dateChanged || positionChanged) {
            prevDateRef.current = currentDate;
            prevPositionRef.current = currentPositionId;
            setMessages([]);
            dispatch(resetChat());
        }
    }, [currentDate, currentPositionId, dispatch]);

    // When new page data arrives, prepend it (in chronological order) to accumulated messages
    useEffect(() => {
        if (!data || isFetching) return;

        // API returns DESC, so reverse to get ASC for display
        const pageMessages = [...data.data].reverse();

        // Capture scroll position before prepending so we can restore it after DOM update
        if (loadedOldestPage > 1 && scrollContainerRef.current) {
            scrollRestoreRef.current = {
                scrollHeight: scrollContainerRef.current.scrollHeight,
                scrollTop: scrollContainerRef.current.scrollTop,
            };
        }

        setMessages((prev) => {
            if (loadedOldestPage === 1) {
                // First load or after date/position reset: replace all
                return pageMessages;
            }
            // Prepend older messages; update any existing messages with fresh data
            const pageById = new Map(pageMessages.map((m) => [m.id, m]));
            const updatedPrev = prev.map((m) => pageById.get(m.id) ?? m);
            const newOnes = pageMessages.filter((m) => !updatedPrev.some((p) => p.id === m.id));
            return [...newOnes, ...updatedPrev];
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isFetching]);

    // Restore scroll position after older messages are prepended to the DOM
    useLayoutEffect(() => {
        if (scrollRestoreRef.current && scrollContainerRef.current) {
            const { scrollHeight, scrollTop } = scrollRestoreRef.current;
            const delta = scrollContainerRef.current.scrollHeight - scrollHeight;
            scrollContainerRef.current.scrollTop = scrollTop + delta;
            scrollRestoreRef.current = null;
        }
    }, [messages]);

    // Scroll to bottom on initial load
    useEffect(() => {
        if (!isInitialLoading && messages.length > 0 && loadedOldestPage === 1) {
            chatBottomRef.current?.scrollIntoView({ behavior: "instant" });
        }
    }, [isInitialLoading, messages.length, loadedOldestPage]);

    const handleLoadMore = useCallback(() => {
        if (!isFetching && hasMoreOlder) {
            dispatch(incrementOldestPage());
        }
    }, [isFetching, hasMoreOlder, dispatch]);

    const handleNoteCreated = useCallback((note: DailyNote) => {
        setMessages((prev) => [...prev, note]);
        setTimeout(() => {
            chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    }, []);

    const handleNoteUpdated = useCallback((updatedNote: DailyNote) => {
        setMessages((prev) =>
            prev.map((m) => (m.id === updatedNote.id ? updatedNote : m))
        );
    }, []);

    const handleNoteDeleted = useCallback((noteId: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== noteId));
    }, []);

    const changeDate = useCallback((date: string) => {
        dispatch(setCurrentDate(date));
    }, [dispatch]);

    const changePosition = useCallback((positionId: string) => {
        dispatch(setCurrentPosition(positionId));
    }, [dispatch]);

    return {
        messages,
        currentDate,
        currentPositionId,
        positions,
        isInitialLoading,
        isLoadingOlder,
        hasMoreOlder,
        chatBottomRef,
        scrollContainerRef,
        handleNoteCreated,
        handleNoteUpdated,
        handleNoteDeleted,
        handleLoadMore,
        changeDate,
        changePosition
    };
};
