import type { AppDispatch, RootState } from "@/app/stores/mainStore";
import { setSearchQuery } from "@/entities/position";
import { useDebounce } from "@/shared/lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const usePositionSearch = () => {
    const dispatch: AppDispatch = useDispatch();
    const globalSearch = useSelector(
        (state: RootState) => state.position.searchQuery
    );

    const [localSearch, setLocalSearch] = useState(globalSearch);
    const debouncedSearch = useDebounce(localSearch, 300);

    useEffect(() => {
        setLocalSearch(globalSearch);
    }, [globalSearch]);

    useEffect(() => {
        if (debouncedSearch !== globalSearch) {
            dispatch(setSearchQuery(debouncedSearch));
        }
    }, [dispatch, debouncedSearch, globalSearch]);

    return {
        search: localSearch,
        setSearch: setLocalSearch
    };
};
