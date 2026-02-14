import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/stores/mainStore";
import {
    setFilterIsActive,
    setFilterRoleName,
    setSort,
    resetFilters,
    type UserSortField,
} from "@/entities/user/model";

export const useUserFilters = () => {
    const dispatch: AppDispatch = useDispatch();
    const { filterIsActive, filterRoleName, sortBy, sortDescending } = useSelector(
        (state: RootState) => state.user
    );

    const handleFilterIsActiveChange = useCallback(
        (value: boolean | null) => {
            dispatch(setFilterIsActive(value));
        },
        [dispatch]
    );

    const handleFilterRoleNameChange = useCallback(
        (value: string | null) => {
            dispatch(setFilterRoleName(value));
        },
        [dispatch]
    );

    const handleSortChange = useCallback(
        (field: UserSortField | null, descending: boolean) => {
            dispatch(setSort({ sortBy: field, sortDescending: descending }));
        },
        [dispatch]
    );

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    return {
        filterIsActive,
        filterRoleName,
        sortBy,
        sortDescending,
        handleFilterIsActiveChange,
        handleFilterRoleNameChange,
        handleSortChange,
        handleResetFilters,
    };
};
