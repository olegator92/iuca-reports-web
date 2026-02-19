import type { AppDispatch, RootState } from "@/app/stores/mainStore";
import { setPage, useGetTemplatesQuery } from "@/entities/template/model";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useTemplatePagination = () => {
    const dispatch: AppDispatch = useDispatch();
    const { page, pageSize, searchQuery } = useSelector((state: RootState) => state.template);

    const queryArgs = useMemo(() => ({
        page,
        pageSize,
        search: searchQuery
    }), [page, pageSize, searchQuery]);

    const { data, isFetching } = useGetTemplatesQuery(queryArgs);

    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;
    const canNext = data?.hasNextPage ?? false;
    const canPrev = data?.hasPreviousPage ?? false;

    const handlePageChange = (newPage: number) => {
        if (newPage !== page) {
            dispatch(setPage(newPage));
        }
    };

    const onPrev = () => {
        if (canPrev) {
            dispatch(setPage(page - 1));
        }
    };

    const onNext = () => {
        if (canNext) {
            dispatch(setPage(page + 1));
        }
    };

    return {
        page,
        pageSize,
        total,
        totalPages,
        canNext,
        canPrev,
        isLoading: isFetching,
        handlePageChange,
        onPrev,
        onNext
    };
};
