import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/stores/mainStore";
import {
    setIncludeDeleted,
    setSort,
    resetFilters,
    type DepartmentSortField,
} from "@/entities/department/model";

export const useDepartmentFilters = () => {
    const dispatch: AppDispatch = useDispatch();
    const { includeDeleted, sortBy, sortDescending } = useSelector(
        (state: RootState) => state.department
    );

    const handleIncludeDeletedChange = useCallback(
        (value: boolean) => {
            dispatch(setIncludeDeleted(value));
        },
        [dispatch]
    );

    const handleSortChange = useCallback(
        (field: DepartmentSortField | null, descending: boolean) => {
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
