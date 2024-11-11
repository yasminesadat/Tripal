import React, { useState, useEffect } from "react";

export default function Pagination({ totalPages = 1, curr = 1, onPageChange }) {
  const [activeIndex, setActiveIndex] = useState(curr);

  useEffect(() => {
    setActiveIndex(curr);
  }, [curr]);

  const changePage = (newPage) => {
    setActiveIndex(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const getPageRange = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (activeIndex > 3) {
        pages.push("...");
      }

      const start = Math.max(2, activeIndex - 1);
      const end = Math.min(totalPages - 1, activeIndex + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (activeIndex < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination justify-center">
      <button
        onClick={() => changePage(activeIndex > 1 ? activeIndex - 1 : 1)}
        disabled={activeIndex === 1}
        className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "inherit",
        }}
      >
        <i className="icon-arrow-left text-15"></i>
      </button>

      <div className="pagination__count">
        {getPageRange().map((page, index) => (
          <div
            key={index}
            style={{ cursor: page !== "..." ? "pointer" : "default" }}
            onClick={() => page !== "..." && changePage(page)}
            className={activeIndex === page ? "is-active" : ""}
          >
            {page}
          </div>
        ))}
      </div>

      <button
        onClick={() => changePage(activeIndex < totalPages ? activeIndex + 1 : activeIndex)}
        disabled={activeIndex === totalPages}
        className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "inherit",
        }}
      >
        <i className="icon-arrow-right text-15"></i>
      </button>
    </div>
  );
}
