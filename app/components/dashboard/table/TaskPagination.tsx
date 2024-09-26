import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface TaskPaginationProps {
  currentPage: number
  totalPages: number
  onCurrentPageChange: (page: number) => void
}
export default function TaskPagination({
  currentPage,
  totalPages,
  onCurrentPageChange,
}: TaskPaginationProps) {

  const isPageActive = (page: number) => {
    return currentPage === page;
  }
  const renderPaginationItems = () => {
    const pages = [];
    const pageRange = 2;

    // show first two pages
    pages.push(
      <PaginationItem key={1} onClick={() => onCurrentPageChange(1)}>
        <PaginationLink href="#" isActive={isPageActive(1)}>1</PaginationLink>
      </PaginationItem>
    );
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={2} onClick={() => onCurrentPageChange(2)}>
          <PaginationLink href="#" isActive={isPageActive(2)}>2</PaginationLink>
        </PaginationItem>
      );
    };

    // show ellipsis if currentPage is more than 2 pages away from the first page 
    if (currentPage >= pageRange + 2) {
      pages.push(
        <PaginationItem key={3}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    };

    // show current page and pages around it
    if (currentPage > 2 && currentPage < totalPages - 1) {
      for (let i = currentPage; i <= Math.min(totalPages - 2, currentPage + 1); i++) {
        pages.push(
          <PaginationItem key={i} onClick={() => onCurrentPageChange(i)}>
            <PaginationLink href="#" isActive={isPageActive(i)}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
    };


    // show ellipsis if currentPage is more than 2 pages away from the last page
    if (currentPage < totalPages - pageRange - 1) {
      pages.push(
        <PaginationItem key={totalPages - 2}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    };

    // show last two pages
    if (totalPages > 2) {
      pages.push(
        <PaginationItem key={totalPages - 1} onClick={() => onCurrentPageChange(totalPages - 1)}>
          <PaginationLink href="#" isActive={isPageActive(totalPages - 1)}>{totalPages - 1}</PaginationLink>
        </PaginationItem>
      );
    };
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages} onClick={() => onCurrentPageChange(totalPages)}>
          <PaginationLink href="#" isActive={isPageActive(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    };

    return pages;
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => onCurrentPageChange(currentPage - 1)} />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext href="#" onClick={() => onCurrentPageChange(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
