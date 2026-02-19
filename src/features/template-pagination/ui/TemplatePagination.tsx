import { PaginationControls } from "@/shared/ui";
import { useTemplatePagination } from "../model";

export const TemplatePagination = () => {
    const {
        page,
        totalPages,
        canNext,
        canPrev,
        handlePageChange,
        onNext,
        onPrev,
    } = useTemplatePagination();

    return (
        <PaginationControls
            page={page}
            totalPages={totalPages}
            canNext={canNext}
            canPrev={canPrev}
            onPageChange={handlePageChange}
            onNext={onNext}
            onPrev={onPrev}
            className="pt-4"
        />
    );
};
