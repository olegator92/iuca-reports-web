import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetPositionsQuery, type Position } from "@/entities/position/model";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/stores/mainStore";

interface UsePositionListResult {
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    positions: Position[];
    total: number;
    hasMore: boolean;
    loadedCount: number;
    loadMore: () => void;
    observerTargetRef: (node: HTMLDivElement | null) => void;
    refetch: () => Promise<void>;
    handlePositionCreated: (position: Position) => void;
    handlePositionUpdated: (position: Position) => void;
    handlePositionDeleted: (positionId: string) => void;
}

const mergeById = (existing: Position[], incoming: Position[]) => {
    if (incoming.length === 0) {
        return existing;
    }

    const incomingMap = new Map(incoming.map((position) => [position.id, position]));

    const updatedExisting = existing.map((item) =>
        incomingMap.get(item.id) ?? item,
    );

    const newItems = incoming.filter(
        (item) => !existing.some((existingItem) => existingItem.id === item.id),
    );

    return [...updatedExisting, ...newItems];
};

export const usePositionList = (): UsePositionListResult => {
    const { pageSize, searchQuery, includeDeleted, sortBy, sortDescending } = useSelector(
        (state: RootState) => state.position,
    );

    const [trigger] = useLazyGetPositionsQuery();

    const [positions, setPositions] = useState<Position[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const pendingPageRef = useRef<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const latestSearchRef = useRef(searchQuery);
    const latestPageSizeRef = useRef(pageSize);
    const latestIncludeDeletedRef = useRef(includeDeleted);
    const latestSortByRef = useRef(sortBy);
    const latestSortDescendingRef = useRef(sortDescending);
    const initialLoadAttemptRef = useRef(false);

    const resetState = useCallback(() => {
        initialLoadAttemptRef.current = false;
        setPositions([]);
        setCurrentPage(0);
        setTotal(0);
        setHasMore(true);
    }, []);

    const fetchPage = useCallback(
        async (page: number, { forceReset = false } = {}) => {
            if (pendingPageRef.current === page) {
                return;
            }

            const isFirstPage = page === 1;

            pendingPageRef.current = page;
            if (isFirstPage) {
                setIsInitialLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            try {
                const result = await trigger(
                    {
                        page,
                        pageSize: latestPageSizeRef.current,
                        search: latestSearchRef.current,
                        includeDeleted: latestIncludeDeletedRef.current,
                        sortBy: latestSortByRef.current,
                        sortDescending: latestSortDescendingRef.current,
                    },
                    true,
                ).unwrap();

                setTotal(result.total);
                setHasMore(result.hasNextPage);

                setPositions((prev) => {
                    if (isFirstPage || forceReset) {
                        return result.data;
                    }

                    return mergeById(prev, result.data);
                });

                setCurrentPage(page);
            } catch {
                if (isFirstPage) {
                    setPositions([]);
                }
                setHasMore(false);
                if (observerRef.current) {
                    observerRef.current.disconnect();
                    observerRef.current = null;
                }
            } finally {
                pendingPageRef.current = null;
                if (isFirstPage) {
                    setIsInitialLoading(false);
                } else {
                    setIsLoadingMore(false);
                }
            }
        },
        [trigger],
    );

    const loadInitial = useCallback(async () => {
        resetState();
        initialLoadAttemptRef.current = true;
        await fetchPage(1, { forceReset: true });
    }, [fetchPage, resetState]);

    useEffect(() => {
        const shouldReset =
            latestSearchRef.current !== searchQuery ||
            latestPageSizeRef.current !== pageSize ||
            latestIncludeDeletedRef.current !== includeDeleted ||
            latestSortByRef.current !== sortBy ||
            latestSortDescendingRef.current !== sortDescending;

        if (!shouldReset) {
            return;
        }

        latestSearchRef.current = searchQuery;
        latestPageSizeRef.current = pageSize;
        latestIncludeDeletedRef.current = includeDeleted;
        latestSortByRef.current = sortBy;
        latestSortDescendingRef.current = sortDescending;

        void loadInitial();
    }, [loadInitial, pageSize, searchQuery, includeDeleted, sortBy, sortDescending]);

    useEffect(() => {
        if (
            !initialLoadAttemptRef.current &&
            positions.length === 0 &&
            !isInitialLoading &&
            currentPage === 0
        ) {
            void loadInitial();
        }
    }, [currentPage, isInitialLoading, loadInitial, positions.length]);

    const observerTargetRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (!node) {
                return;
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    if (
                        entry.isIntersecting &&
                        hasMore &&
                        !isLoadingMore &&
                        !isInitialLoading
                    ) {
                        void fetchPage(currentPage + 1);
                    }
                },
                {
                    rootMargin: "320px",
                },
            );

            observerRef.current.observe(node);
        },
        [currentPage, fetchPage, hasMore, isInitialLoading, isLoadingMore],
    );

    const loadMore = useCallback(() => {
        if (hasMore && !isInitialLoading && !isLoadingMore) {
            void fetchPage(currentPage + 1);
        }
    }, [currentPage, fetchPage, hasMore, isInitialLoading, isLoadingMore]);

    const refetch = useCallback(async () => {
        await fetchPage(1, { forceReset: true });
    }, [fetchPage]);

    const handlePositionCreated = useCallback((position: Position) => {
        setPositions((prev) => {
            const exists = prev.some((item) => item.id === position.id);
            if (exists) {
                return mergeById(prev, [position]);
            }

            return [position, ...prev];
        });
        setTotal((prev) => Math.max(prev + 1, 1));
    }, []);

    const handlePositionUpdated = useCallback((position: Position) => {
        setPositions((prev) => mergeById(prev, [position]));
    }, []);

    const handlePositionDeleted = useCallback((positionId: string) => {
        setPositions((prev) => prev.filter((item) => item.id !== positionId));
        setTotal((prev) => Math.max(prev - 1, 0));
    }, []);

    const loadedCount = useMemo(() => positions.length, [positions]);

    return {
        isInitialLoading,
        isLoadingMore,
        positions,
        total,
        hasMore,
        loadedCount,
        loadMore,
        observerTargetRef,
        refetch,
        handlePositionCreated,
        handlePositionUpdated,
        handlePositionDeleted,
    };
};
