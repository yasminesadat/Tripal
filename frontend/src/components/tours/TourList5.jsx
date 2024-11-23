import { tourDataThree } from "@/data/tours";
import { fetchProducts } from "../../api/ProductService";
import React, { useState, useRef, useEffect } from "react";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import {
  durations,
  features,
  languages,
  rating,
  speedFeatures,
} from "@/data/tourFilteringOptions";
import RangeSlider from "../common/RangeSlider";

import { Link } from "react-router-dom";

export default function TourList5() {
  const [sortOption, setSortOption] = useState("");
  const [ddActives, setDdActives] = useState(false);
  const dropDownContainer = useRef();
  const dropDownContainer2 = useRef();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [curentDD, setCurentDD] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1);
  const errorDisplayedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  
  const getProducts = async (page = 1) => {
    setLoading(true);
    try {
      const productsData = await fetchProducts(
        page,
        searchValue,
        priceRange[0],
        priceRange[1],
        sortOrder ,
        );
        
        let filtered = productsData.products;
        console.log(filtered);
        if(productsData.totalPages)
          setTotalPages(productsData.totalPages);

        setProducts(filtered);
        setFilteredProducts(filtered);
        setCurrentPage(page); 
      } catch (error) {
      if (!errorDisplayedRef.current) {
        message.error("Network Error: Unable to fetch products. Please try again later.");
        errorDisplayedRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts(currentPage); 
  }, []);

  // useEffect(() => {
  //   const getExchangeRate = async () => {
  //     if (curr) {
  //       try {
  //         const rate = await getConversionRate(curr);
  //         setExchangeRate(rate);
  //       } catch (error) {
  //         message.error("Failed to fetch exchange rate.");
  //       }
  //     }
  //   };

  //   getExchangeRate();
  // }, [curr]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleGoClick = () => {
    getProducts(1); 
  };
  
  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return convertedPrice;
  };

  const formatPriceRange = () => {
    if (priceRange[1] === 3000) {
      return `${priceRange[0]} - ${priceRange[1]} & above`;
    }
    return `${priceRange[0]} - ${priceRange[1]}`;
  };

  const onPageChange = (page) => {
    if (page !== currentPage) {
      getProducts(page);
      window.scrollTo(0, 0); 
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setDdActives(false);
      }
      if (
        dropDownContainer2.current &&
        !dropDownContainer2.current.contains(event.target)
      ) {
        setCurentDD("");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <section className="layout-pt-lg layout-pb-xl">
      <div className="container">
        <div className="row  custom-dd-container justify-between items-center relative z-5">
          <div className="col-auto">
            <div
              ref={dropDownContainer2}
              className="row  custom-dd-container2 custom-dd-container x-gap-10 y-gap-10 items-center"
            >
              <div className="col-auto">
                <div
                  className={` dropdown -base -price js-dropdown js-form-dd  ${
                    curentDD == "priceFilter1" ? "is-active" : ""
                  } `}
                >
                  <div
                    onClick={() => {
                      setCurentDD((pre) =>
                        pre == "priceFilter1" ? "" : "priceFilter1",
                      );
                    }}
                    className="dropdown__button h-50 min-w-auto js-button"
                  >
                    <span className="js-title">Price</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-18 fw-500">Filter Price</h5>
                    <div className="pt-20">
                      <RangeSlider />
                    </div>
                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-30">
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div
                  className={` dropdown -base -price js-dropdown js-form-dd  ${
                    curentDD == "durationFilter1" ? "is-active" : ""
                  } `}
                >
                  <div
                    onClick={() => {
                      setCurentDD((pre) =>
                        pre == "durationFilter1" ? " " : "durationFilter1",
                      );
                    }}
                    className="dropdown__button h-50 min-w-auto js-button"
                  >
                    <span className="js-title">Hiiiiii</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-18 fw-500">Duration</h5>
                    <div className="pt-20">
                      <div className="d-flex flex-column y-gap-15">
                        {durations.map((elm, i) => (
                          <div key={i}>
                            <div className="d-flex items-center">
                              <div className="form-checkbox ">
                                <input type="checkbox" name="name" />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon">
                                    <img
                                      src="/img/icons/check.svg"
                                      alt="icon"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="lh-11 ml-10">{elm}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-20">
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div
                  className={` dropdown -base -price js-dropdown js-form-dd  ${
                    curentDD == "languageFilter1" ? "is-active" : ""
                  } `}
                >
                  <div
                    onClick={() => {
                      setCurentDD((pre) =>
                        pre == "languageFilter1" ? "" : "languageFilter1",
                      );
                    }}
                    className="dropdown__button h-50 min-w-auto js-button"
                  >
                    <span className="js-title">Languages</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-18 fw-500">Language</h5>
                    <div className="pt-20">
                      <div className="d-flex flex-column y-gap-15">
                        {languages.map((elm, i) => (
                          <div key={i}>
                            <div className="d-flex items-center">
                              <div className="form-checkbox ">
                                <input type="checkbox" name="name" />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon">
                                    <img
                                      src="/img/icons/check.svg"
                                      alt="icon"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="lh-11 ml-10">{elm}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-20">
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div
                  className={` dropdown -base -price js-dropdown js-form-dd  ${
                    curentDD == "ratingFilter1" ? "is-active" : ""
                  } `}
                >
                  <div
                    onClick={() => {
                      setCurentDD((pre) =>
                        pre == "ratingFilter1" ? "" : "ratingFilter1",
                      );
                    }}
                    className="dropdown__button h-50 min-w-auto js-button"
                  >
                    <span className="js-title">Rating</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-18 fw-500">Rating</h5>
                    <div className="pt-20">
                      <div className="d-flex flex-column y-gap-15">
                        {rating.map((elm, i) => (
                          <div key={i} className="d-flex">
                            <div className="form-checkbox">
                              <input type="checkbox" name="rating" />
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

                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-20">
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div
                  className={` dropdown -base -price js-dropdown js-form-dd  ${
                    curentDD == "featuresFilter1" ? "is-active" : ""
                  } `}
                >
                  <div
                    onClick={() => {
                      setCurentDD((pre) =>
                        pre == "featuresFilter1" ? "" : "featuresFilter1",
                      );
                    }}
                    className="dropdown__button h-50 min-w-auto js-button"
                  >
                    <span className="js-title">Specials</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-18 fw-500">Specials</h5>
                    <div className="pt-20">
                      <div className="d-flex flex-column y-gap-15">
                        {features.map((elm, i) => (
                          <div key={i}>
                            <div className="d-flex items-center">
                              <div className="form-checkbox ">
                                <input type="checkbox" name="name" />
                                <div className="form-checkbox__mark">
                                  <div className="form-checkbox__icon">
                                    <img
                                      src="/img/icons/check.svg"
                                      alt="icon"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="lh-11 ml-10">{elm}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-20">
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={dropDownContainer} className="col-auto">
            <div
              className={`dropdown -type-2 js-dropdown js-form-dd ${
                ddActives ? "is-active" : ""
              } `}
            >
              <div
                className="dropdown__button js-button"
                onClick={() => setDdActives((pre) => !pre)}
              >
                <span>Sort by: </span>
                <span className="js-title">
                  {sortOption ? sortOption : "Featured"}
                </span>
                <i className="icon-chevron-down"></i>
              </div>

              <div className="dropdown__menu js-menu-items">
                {speedFeatures.map((elm, i) => (
                  <div
                    onClick={() => {
                      setSortOption((pre) => (pre == elm ? "" : elm));
                      setDdActives(false);
                    }}
                    key={i}
                    className="dropdown__item"
                    data-value="fast"
                  >
                    {elm}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row y-gap-30 pt-30">
          {filteredProducts.map((product) => (
            <div className="col-lg-3 col-sm-6">
              <Link
                className="tourCard -type-1 py-10 px-10 border-1 rounded-12  -hover-shadow"
              >
                <div className="tourCard__header">
                  <div className="tourCard__image ratio ratio-28:20">
                    <img
                      src={product.picture}
                      alt="image"
                      className="img-ratio rounded-12"
                    />
                  </div>

                  <button className="tourCard__favorite">
                    <i className="icon-heart"></i>
                  </button>
                </div>

                <div className="tourCard__content px-10 pt-10">
                  <div className="tourCard__location d-flex items-center text-13 text-light-2">
                    <i className="d-flex text-16 text-light-2 mr-5"></i>
                    {/* {elm.location} */}
                  </div>

                  <h3 className="tourCard__title text-16 fw-500 mt-5">
                    <span>{product.name}</span>
                  </h3>
                  
                  <div className="tourCard__location d-flex items-center text-13 text-light-2">
                    <i className="d-flex text-16 text-light-2 mr-5"></i>
                    {product.description}
                  </div>

                  <div className="tourCard__rating d-flex items-center text-13 mt-5">
                    <div className="d-flex x-gap-5">
                      <Stars star={product.averageRating} />
                    </div>

                    <span className="text-dark-1 ml-10">
                      {/* {elm.rating} ({elm.ratingCount}) */}
                    </span>
                  </div>

                  <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                    <div className="d-flex items-center">
                      <i className="icon-clock text-16 mr-5"></i>
                      {/* {elm.duration} */}
                    </div>

                    <div>
                      From <span className="text-16 fw-500">${product.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="d-flex justify-center flex-column mt-60">
          <Pagination />

          <div className="text-14 text-center mt-20">
            Showing results 1-30 of 1,415
          </div>
        </div>
      </div>
    </section>
  );
}
