import { useState, useEffect } from "react";

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    setActiveIndex(currentPage);
  }, [currentPage]);

  //#region 1. Event Handlers
  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const displayPageNumbers = () => {
    const visiblePages = [];
  
    if (totalPages <= 5) {
      return pageNumbers;
    }
    visiblePages.push(1);
    if (currentPage > 3) {
      visiblePages.push("...");
    } 
    for (let i = Math.max(currentPage - 1, 2); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
      visiblePages.push(i);
    }
    if (currentPage < totalPages - 2) {
      visiblePages.push("...");
    } 
    visiblePages.push(totalPages); 
    return visiblePages;
  };
  //#endregion
  
  return (
    <div>
      <div className="pagination justify-center">
        <button
          onClick={handlePrevClick}
          className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
        >
          <i className="icon-arrow-left text-15"></i>
        </button>

        <div className="pagination__count">
        {displayPageNumbers().map((pageNumber, index) => (
          <div
            key={index}
            style={{
              cursor: pageNumber === "..." ? "default" : "pointer",
              pointerEvents: pageNumber === "..." ? "none" : "auto",
            }}
            onClick={pageNumber !== "..." ? () => handlePageClick(pageNumber) : undefined}
            className={activeIndex === pageNumber ? `is-active` : ""}
          >
            {pageNumber}
          </div>
        ))}
        </div>

        <button
          onClick={handleNextClick}
          className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
        >
          <i className="icon-arrow-right text-15"></i>
        </button>
      </div>

      <div className="text-14 text-center mt-20">
        Showing results{" "}
        {currentPage === totalPages
          ? `${(currentPage - 1) * itemsPerPage + 1}-${totalItems}`
          : `${(currentPage - 1) * itemsPerPage + 1}-${
              currentPage * itemsPerPage
            }`}{" "}
        of {totalItems}
      </div>
    </div>
  );
}