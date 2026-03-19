'use client';
import { PaginationResult } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface PaginationProps extends PaginationResult {
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
}

export function Pagination({
    page,
    limit,
    totalPages,
    onPageChange,
    onLimitChange,
}: PaginationProps) {

    const canGoBack = page > 1;
    const canGoForward = page < totalPages;

    const nextPage = () => {
        if (page === totalPages) return
        onPageChange(page + 1)
    }

    const previousPage = () => {
        if (page === 1) return
        onPageChange(page - 1)
    }

    const goToFirstPage = () => {
        onPageChange(1)
    }

    const goToLastPage = () => {
        onPageChange(totalPages)
    }

    const setPageSize = (value: number) => {
        onLimitChange && onLimitChange(value)
    };

    return (
        <div className="flex items-center justify-between px-2 w-full">
            <div className="text-muted-foreground flex-1 text-sm"></div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                {onLimitChange && <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${limit}`}
                        onValueChange={(value) => setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={limit}
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[2, 10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>}
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {page} of{" "}
                    {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => goToFirstPage()}
                        disabled={!canGoBack}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => previousPage()}
                        disabled={!canGoBack}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => nextPage()}
                        disabled={!canGoForward}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden size-8 lg:flex"
                        onClick={() => goToLastPage()}
                        disabled={!canGoForward}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}
