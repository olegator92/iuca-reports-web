import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/stores/mainStore";
import {
    setIncludeDeleted,
    setSort,
    resetFilters,
    type PositionSortField,
} from "@/entities/position/model";

export const usePositionFilters = () => {
    const dispatch: AppDispatch = useDispatch();
    const { includeDeleted, sortBy, sortDescending } = useSelector(
        (state: RootState) => state.position
    );

    const handleIncludeDeletedChange = useCallback(
        (value: boolean) => {
            dispatch(setIncludeDeleted(value));
        },
        [dispatch]
    );

    const handleSortChange = useCallback(
        (field: PositionSortField | null, descending: boolean) => {
            dispatch(setSort({ sortBy: field, sortDescending: descending }));
        },
        [dispatch]
    );

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    return {
        includeDeleted,
        sortBy,
        sortDescending,
        handleIncludeDeletedChange,
        handleSortChange,
        handleResetFilters,
    };
};
