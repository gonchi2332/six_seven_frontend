import { useState } from "react";

const usePagination = <T,>(items: T[], pageSize: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = items.slice((safePage - 1) * pageSize, safePage * pageSize);
    const goToPage = (page: number) => setCurrentPage(page);
    const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
    const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
    const resetPage = () => setCurrentPage(1);

    const adjustAfterDelete = (pageLength: number) => {
        if (pageLength === 1 && safePage > 1) setCurrentPage((p) => p - 1);
    };

    return { currentPage: safePage, totalPages, paginated, goToPage, prevPage, nextPage, resetPage, adjustAfterDelete };
};

export default usePagination;