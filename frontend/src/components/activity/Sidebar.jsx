import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";

import ActivityCategoryService from '@/api/ActivityCategoryService'

import {
  durations,
  languages,
  toursTypes,
  features,
  rating,
} from "@/data/tourFilteringOptions";
import RangeSlider from "./RangeSlider";
import Stars from "../common/Stars";

export default function Sidebar({ setStartDate, setEndDate, setRatingFilter, setCategoryFilter, priceRange, setPriceRange }) {
  const [ddActives, setDdActives] = useState(["tourtype"]);

  const [selectedRatings, setSelectedRatings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRangeState, setPriceRangeState] = useState([0, 10000]); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRatingFilter(selectedRatings); 
  }, [selectedRatings, setRatingFilter]);

  const handleRatingChange = (ratingValue) => {
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(ratingValue)
        ? prevRatings.filter((rating) => rating !== ratingValue)
        : [...prevRatings, ratingValue]
    );
  };
  
  useEffect(() => {
    setRatingFilter(selectedRatings); 
  }, [selectedRatings, setRatingFilter]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ActivityCategoryService.getActivityCategories();
        setCategories(response);
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setCategoryFilter(selectedCategories);
  }, [selectedCategories, setCategoryFilter]);

  const handleCheckboxChange = (categoryName) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryName)) {
        return prevSelected.filter((cat) => cat !== categoryName);
      } else {
        return [...prevSelected, categoryName];
      }
    });
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRangeState(newRange);
    setPriceRange(newRange);
  };


  return (
    <div className="sidebar -type-1 rounded-12">
      <div className="sidebar__header bg-accent-1">
        <div className="text-15 text-white fw-500">When are you free?</div>

        <div className="mt-10">
          <div className="searchForm -type-1 -col-1 -narrow">
            <div className="searchForm__form">
              <div className="searchFormItem js-select-control js-form-dd js-calendar">
                <div className="searchFormItem__button" data-x-click="calendar">
                  <div className="pl-calendar d-flex items-center">
                    <i className="icon-calendar text-20 mr-15"></i>
                    <div>
                      <span className="js-first-date">
                        <Calendar setStartDate={setStartDate} setEndDate={setEndDate} />
                      </span>
                      <span className="js-last-date"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar__content">
        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("tourtype") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("tourtype")
                      ? [...pre.filter((elm) => elm != "tourtype")]
                      : [...pre, "tourtype"],
                  )
                }
              >
                <h5 className="text-18 fw-500">Category</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("tourtype") ? { maxHeight: "300px" } : {}
                }
              >
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {categories.map((elm, i) => (
                      <div key={i}>
                        <div className="d-flex items-center">
                          <div className="form-checkbox ">
                            <input 
                              type="checkbox" 
                              name="name" 
                              checked={selectedCategories.includes(elm.Name)} 
                              onChange={() => handleCheckboxChange(elm.Name)}
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <img src="/img/icons/check.svg" alt="icon" />
                              </div>
                            </div>
                          </div>

                          <div className="lh-11 ml-10">{elm.Name}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* <a
                    href="#"
                    className="d-flex text-15 fw-500 text-accent-2 mt-15"
                  >
                    See More
                  </a> */}

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${
                ddActives.includes("pricerange") ? "is-active" : ""
              } `}
            >
              <div
                className="accordion__button mb-10 d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("pricerange")
                      ? [...pre.filter((elm) => elm != "pricerange")]
                      : [...pre, "pricerange"],
                  )
                }
              >
                <h5 className="text-18 fw-500">Price</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  ddActives.includes("pricerange") ? { maxHeight: "300px" } : {}
                }
              >
                <div className="pt-15">
                  <RangeSlider priceRange={priceRangeState} setPriceRange={handlePriceRangeChange} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${ddActives.includes("rating") ? "is-active" : ""}`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() =>
                  setDdActives((pre) =>
                    pre.includes("rating") ? [...pre.filter((elm) => elm != "rating")] : [...pre, "rating"]
                  )
                }
              >
                <h5 className="text-18 fw-500">Rating</h5>

                <div className="accordion__icon flex-center">
                  <i className="icon-chevron-down"></i>
                  <i className="icon-chevron-down"></i>
                </div>
              </div>

              <div className="accordion__content" style={ddActives.includes("rating") ? { maxHeight: "300px" } : {}}>
                <div className="pt-15">
                  <div className="d-flex flex-column y-gap-15">
                    {rating.map((elm, i) => (
                      <div key={i} className="d-flex">
                        <div className="form-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(elm)} // Check if the rating is selected
                            onChange={() => handleRatingChange(elm)} // Update the selected ratings on change
                          />
                          <div className="form-checkbox__mark">
                            <div className="form-checkbox__icon">
                              <img src="/img/icons/check.svg" alt="icon" />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex x-gap-5 ml-10">
                          <Stars star={elm} font={13} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
