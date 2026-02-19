import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetUsersQuery, type User } from "@/entities/user/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/stores/mainStore";

interface UseUserListResult {
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    users: User[];
    total: number;
    hasMore: boolean;
    loadedCount: number;
    loadMore: () => void;
    observerTargetRef: (node: HTMLDivElement | null) => void;
    refetch: () => Promise<void>;
    handleUserCreated: (user: User) => void;
    handleUserUpdated: (user: User) => void;
    handleUserDeleted: (userId: string) => void;
}

const mergeById = (existing: User[], incoming: User[]) => {
    if (incoming.length === 0) {
        return existing;
    }

    const incomingMap = new Map(incoming.map((user) => [user.id, user]));

    const updatedExisting = existing.map((item) =>
        incomingMap.get(item.id) ?? item,
    );

    const newItems = incoming.filter(
        (item) => !existing.some((existingItem) => existingItem.id === item.id),
    );

    return [...updatedExisting, ...newItems];
};

export const useUserList = (): UseUserListResult => {
    const { pageSize, searchQuery, filterIsActive, filterRoleName, sortBy, sortDescending } = useSelector(
        (state: RootState) => state.user,
    );

    const [trigger] = useLazyGetUsersQuery();

    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const pendingPageRef = useRef<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const latestSearchRef = useRef(searchQuery);
    const latestPageSizeRef = useRef(pageSize);
    const latestFilterIsActiveRef = useRef(filterIsActive);
    const latestFilterRoleNameRef = useRef(filterRoleName);
    const latestSortByRef = useRef(sortBy);
    const latestSortDescendingRef = useRef(sortDescending);
    const initialLoadAttemptRef = useRef(false);

    const resetState = useCallback(() => {
        initialLoadAttemptRef.current = false;
        setUsers([]);
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
                        isActive: latestFilterIsActiveRef.current ?? undefined,
                        roleName: latestFilterRoleNameRef.current ?? undefined,
                        sortBy: latestSortByRef.current ?? undefined,
                        sortDescending: latestSortByRef.current ? latestSortDescendingRef.current : undefined,
                    },
                    true,
                ).unwrap();

                setTotal(result.totalCount);
                setHasMore(result.hasNextPage);

                setUsers((prev) => {
                    if (isFirstPage || forceReset) {
                        return result.data;
                    }

                    return mergeById(prev, result.data);
                });

                setCurrentPage(page);
            } catch {
                if (isFirstPage) {
                    setUsers([]);
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
            latestFilterIsActiveRef.current !== filterIsActive ||
            latestFilterRoleNameRef.current !== filterRoleName ||
            latestSortByRef.current !== sortBy ||
            latestSortDescendingRef.current !== sortDescending;

        if (!shouldReset) {
            return;
        }

        latestSearchRef.current = searchQuery;
        latestPageSizeRef.current = pageSize;
        latestFilterIsActiveRef.current = filterIsActive;
        latestFilterRoleNameRef.current = filterRoleName;
        latestSortByRef.current = sortBy;
        latestSortDescendingRef.current = sortDescending;

        void loadInitial();
    }, [loadInitial, pageSize, searchQuery, filterIsActive, filterRoleName, sortBy, sortDescending]);

    useEffect(() => {
        if (
            !initialLoadAttemptRef.current &&
            users.length === 0 &&
            !isInitialLoading &&
            currentPage === 0
        ) {
            void loadInitial();
        }
    }, [currentPage, isInitialLoading, loadInitial, users.length]);

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

    const handleUserCreated = useCallback((user: User) => {
        setUsers((prev) => {
            const exists = prev.some((item) => item.id === user.id);
            if (exists) {
                return mergeById(prev, [user]);
            }

            return [user, ...prev];
        });
        setTotal((prev) => Math.max(prev + 1, 1));
    }, []);

    const handleUserUpdated = useCallback((user: User) => {
        setUsers((prev) => mergeById(prev, [user]));
    }, []);

    const handleUserDeleted = useCallback((userId: string) => {
        setUsers((prev) => prev.filter((item) => item.id !== userId));
        setTotal((prev) => Math.max(prev - 1, 0));
    }, []);

    const loadedCount = useMemo(() => users.length, [users]);

    return {
        isInitialLoading,
        isLoadingMore,
        users,
        total,
        hasMore,
        loadedCount,
        loadMore,
        observerTargetRef,
        refetch,
        handleUserCreated,
        handleUserUpdated,
        handleUserDeleted,
    };
};
