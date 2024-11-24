import React, { useState, useEffect } from "react";

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    setActiveIndex(currentPage);
  }, [currentPage]);

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
            {pageNumbers.map((pageNumber) => (
            <div
                key={pageNumber}
                style={{ cursor: "pointer" }}
                onClick={() => handlePageClick(pageNumber)} 
                className={activeIndex === pageNumber ? `is-active` : ""}
            >
                {pageNumber}
            </div>
            ))}

            {totalPages > 5 && <div>...</div>}

            {totalPages > 4 && (
            <div
                style={{ cursor: "pointer" }}
                onClick={() => handlePageClick(totalPages)}  
                className={activeIndex === totalPages ? `is-active` : ""}
            >
                {totalPages}
            </div>
            )}
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
