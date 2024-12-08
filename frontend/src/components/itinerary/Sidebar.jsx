import { useState, useEffect } from "react";
import Calendar from "@/components/activity/Calendar";
import {rating,} from "@/data/tourFilteringOptions";
import RangeSlider from "@/components/activity/RangeSlider";
import Stars from "../common/Stars";
import { getTags } from "@/api/PreferenceTagService";
import languages from "@/assets/constants/Languages";

export default function Sidebar({ userRole, setStartDate, setEndDate, setCategoryFilter, setLanguageFilter, setRatingFilter, priceRange, setPriceRange }) {
  const [ddActives, setDdActives] = useState(["tourtype"]);

  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRangeState, setPriceRangeState] = useState([0, 10000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getTags();
        setCategories(response.data);
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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


  const handlePriceRangeChange = (newRange) => {
    setPriceRangeState(newRange);
    setPriceRange(newRange);
  };

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
    setLanguageFilter(language);
  };

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

  return (
    <div className="sidebar -type-1 rounded-12">
      <div className="sidebar__header bg-accent-1">
        {userRole !== 'Tour Guide' && <div className="text-15 text-white fw-500">When are you free?</div>}
        {userRole === 'Tour Guide' && <div className="text-15 text-white fw-450">Pick a Start date and an End date.</div>}

        <div className="mt-10">
          <div>
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
              className={`accordion__item js-accordion-item-active ${ddActives.includes("tourtype") ? "is-active" : ""
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
                <h5 className="text-18 fw-500">Preference Tags</h5>

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
                              checked={selectedCategories.includes(elm.name)}
                              onChange={() => handleCheckboxChange(elm.name)}
                            />
                            <div className="form-checkbox__mark">
                              <div className="form-checkbox__icon">
                                <img src="/img/icons/check.svg" alt="icon" />
                              </div>
                            </div>
                          </div>

                          <div className="lh-11 ml-10">{elm.name}</div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar__item">
          <div className="accordion -simple-2 js-accordion">
            <div
              className={`accordion__item js-accordion-item-active ${ddActives.includes("pricerange") ? "is-active" : ""
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

              <div className="sidebar__item">
                <div className="divider" style={{ height: "1px", backgroundColor: "#e0e0e0", margin: "15px 0", marginTop: "25px", marginBottom: "25px" }}></div>
              </div>

              <div className="sidebar__item">
                <div className="accordion -simple-2 js-accordion">
                  <div className={`accordion__item js-accordion-item-active ${ddActives.includes("language") ? "is-active" : ""}`}>
                    <div
                      className="accordion__button d-flex items-center justify-between"
                      onClick={() =>
                        setDdActives((pre) =>
                          pre.includes("language")
                            ? [...pre.filter((elm) => elm != "language")]
                            : [...pre, "language"],
                        )
                      }
                    >
                      <h5 className="text-18 fw-500">Language</h5>
                      <div className="accordion__icon flex-center">
                        <i className="icon-chevron-down"></i>
                        <i className="icon-chevron-down"></i>
                      </div>
                    </div>
                    <div
                      className="accordion__content"
                      style={ddActives.includes("language") ? { maxHeight: "300px" } : {}}
                    >
                                          <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="form-input"
                    >
                      <option value="">Select Language</option>
                      {languages.map((lang, index) => (
                        <option key={index} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    </div>
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
