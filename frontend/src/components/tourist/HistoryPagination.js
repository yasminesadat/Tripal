import React, { useState } from "react";

export default function Pagination({ range = 20, paginate, activeIndex, setActiveIndex }) {
  return (
    <div className="pagination justify-center">
      <button
        onClick={() => {
          if (activeIndex > 1) {
            paginate(activeIndex - 1);
          }
        }}
        className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
      >
        <i className="icon-arrow-left text-15"></i>
      </button>

      <div className="pagination__count">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => paginate(1)}
          className={activeIndex === 1 ? `is-active` : ""}
        >
          1
        </div>
        {range > 1 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => paginate(2)}
            className={activeIndex === 2 ? `is-active` : ""}
          >
            2
          </div>
        )}
        {range > 2 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => paginate(3)}
            className={activeIndex === 3 ? `is-active` : ""}
          >
            3
          </div>
        )}
        {range > 3 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => paginate(4)}
            className={activeIndex === 4 ? `is-active` : ""}
          >
            4
          </div>
        )}

        {activeIndex === 5 && range !== 5 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => paginate(5)}
            className={activeIndex === 5 ? `is-active` : ""}
          >
            5
          </div>
        )}

        {range > 5 && <div>...</div>}
        {activeIndex > 5 && activeIndex < range && (
          <div style={{ cursor: "pointer" }} onClick={() => paginate(activeIndex)} className="is-active">
            {activeIndex}
          </div>
        )}
        {range > 4 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => paginate(range)}
            className={activeIndex === range ? `is-active` : ""}
          >
            {range}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          if (activeIndex < range) {
            paginate(activeIndex + 1);
          }
        }}
        className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
      >
        <i className="icon-arrow-right text-15"></i>
      </button>
    </div>
  );
}
