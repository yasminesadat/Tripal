import { tourDataThree } from "@/data/tours";
import {
  fetchProducts,
  archiveProduct,
  unArchiveProduct,
} from "../../api/ProductService";
import { getUserData } from "../../api/UserService";
import React, { useState, useRef, useEffect } from "react";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import Spinner from "../common/Spinner";
import ProductCard from "./ProductCard";
import {
  durations,
  features,
  languages,
  rating,
  speedFeatures,
} from "@/data/tourFilteringOptions";
import RangeSlider from "../common/RangeSlider";
import { Link } from "react-router-dom";
import { Card, Rate, message, Input, Select, Slider } from "antd";
import MetaComponent from "../common/MetaComponent";
import { getConversionRate, getTouristCurrency } from "@/api/ExchangeRatesService";

const { Search } = Input;
const { Option } = Select;

const metadata = {
  title: "Products || Tripal",
};

export default function ProductList() {
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
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newIsArchived, setNewIsArchived] = useState(false);

  const getProducts = async (page = 1) => {
    setLoading(true);
    try {
      const productsData = await fetchProducts(
        page,
        searchValue,
        priceRange[0],
        priceRange[1],
        sortOrder,
        userRole
      );
      let filtered = productsData.products;
      console.log(filtered);
      if (productsData.totalPages) setTotalPages(productsData.totalPages);

      setProducts(filtered);
      setFilteredProducts(filtered);
      setCurrentPage(page);
    } catch (error) {
      if (!errorDisplayedRef.current) {
        message.error(
          "Network Error: Unable to fetch products. Please try again later."
        );
        errorDisplayedRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  const [currency, setCurrency] = useState( "EGP");

  const getExchangeRate = async () => {
    if (currency) {
      try {
        const rate = await getConversionRate(currency);
        setExchangeRate(rate);
      } catch (error) {
        message.error("Failed to fetch exchange rate.");
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1);  return () => clearInterval(intervalId);
  }, [currency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData();
        setUserRole(userData.data.role);
        setUserId(userData.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userRole) {
      console.log("User role:", userRole);
      getProducts(currentPage);
    }
  }, [userRole, sortOrder]);


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
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
    <>
      <MetaComponent meta={metadata} />
      <section className="layout-pt-lg layout-pb-xl">
        <div className="container">
          <div className="row custom-dd-container justify-between items-center relative z-5">
            <div className="col-auto">
              <div
                ref={dropDownContainer2}
                className="row custom-dd-container2 custom-dd-container x-gap-10 y-gap-10 items-center"
              >
                <div className="col-auto">
                  <div
                    className={`dropdown -base -price js-dropdown js-form-dd ${
                      curentDD === "priceFilter1" ? "is-active" : ""
                    }`}
                  >
                    {/* Dropdown Button */}
                    <div
                      onClick={() => {
                        setCurentDD((prev) =>
                          prev === "priceFilter1" ? "" : "priceFilter1"
                        );
                      }}
                      className="dropdown__button h-50 min-w-auto js-button"
                    >
                      <span className="js-title">Filter Price</span>
                      <i className="icon-chevron-down ml-10"></i>
                    </div>

                    {/* Dropdown Menu */}
                    {curentDD === "priceFilter1" && (
                      <div className="dropdown__menu px-30 py-30 shadow-1 border-1">
                        <h5
                          className="text-22 fw-500"
                          style={{ marginBottom: "5%" }}
                        >
                          Filter Price
                        </h5>
                        <div
                          style={{ marginBottom: "-7%", textAlign: "center" }}
                        >
                          {formatPriceRange()}
                        </div>
                        <div className="pt-20">
                          {/* Slider */}
                          <Slider
                            range
                            min={0}
                            max={3000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            className="pink-slider"
                          />
                        </div>

                        {/* Apply Button */}
                        <button
                          className="custom-apply-button button px-25 py-15 lh-12 text-accent-1 mt-30"
                          onClick={handleGoClick}
                        >
                          Apply
                          <i className="icon-arrow-top-right text-16 ml-10"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  <style>
                    {`
.pink-slider .ant-slider-track {
  background-color: var(--color-pink) !important; /* Track color */
}

.pink-slider .ant-slider-handle {
  background-color: var(--color-pink) !important; /* Handle background */
  border-color: var(--color-pink) !important; /* Handle border */
}

.pink-slider .ant-slider-handle:focus,
.pink-slider .ant-slider-handle:hover,
.pink-slider .ant-slider-handle:active {
  background-color: var(--color-pink) !important;
  border-color: var(--color-pink) !important;
  box-shadow: 0 0 0 5px rgba(255, 192, 203, 0.2) !important;
}

.pink-slider .ant-slider-rail {
  background-color: #e9e9e9 !important; /* Rail color */
}


    /* Apply Button Styles */
    .custom-apply-button {
      background-color: #8f5774; 
      color: white; /* White text */
      border: none; /* Remove default border */
      border-radius: 5px; /* Rounded corners */
      transition: background-color 0.3s ease;
    }

    .custom-apply-button:hover {
      background-color: #dac4d0; 
    }
     .dropdown__menu {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }
          .dropdown__button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
        .dropdown__button:hover {
        background-color: #8f5774;
      }
    .dropdown.is-active .dropdown__button {
        background-color: #8f5774;
        color: white;
      }
  `}
                  </style>
                </div>

                <div className="col-auto">
                  <div
                    className={`dropdown -base -price js-dropdown js-form-dd ${
                      curentDD === "ratingFilter1" ? "is-active" : ""
                    }`}
                  >
                    <div
                      onClick={() => {
                        setCurentDD((prev) =>
                          prev === "ratingFilter1" ? "" : "ratingFilter1"
                        );
                      }}
                      className="dropdown__button h-50 min-w-auto js-button"
                    >
                      <span className="js-title">Rating</span>
                      <i className="icon-chevron-down ml-10"></i>
                    </div>

                    {curentDD === "ratingFilter1" && (
                      <div className="dropdown__menu px-30 py-30 shadow-1 border-1">
                        <h5 className="text-18 fw-500">Rating</h5>
                        <div className="pt-20">
                          <div className="d-flex flex-column y-gap-15">
                            <div
                              className={`option ${
                                sortOrder === "desc" ? "is-active" : ""
                              }`}
                              onClick={() => handleSortChange("desc")}
                              style={{ cursor: "pointer" }}
                            >
                              Sort by Rating: High to Low
                            </div>
                            <div
                              className={`option ${
                                sortOrder === "asc" ? "is-active" : ""
                              }`}
                              onClick={() => handleSortChange("asc")}
                              style={{ cursor: "pointer" }}
                            >
                              Sort by Rating: Low to High
                            </div>
                          </div>
                        </div>
                        <style>
                          {`
      .option {
        padding: 5px 10px;
        border-radius: 3px;
        transition: background-color 0.3s ease;
      }

      .option:hover {
        background-color: #dac4d0;
      }

      .option.is-active {
        background-color: #8f5774; 
        color: white;
      }

      .dropdown__menu {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      .dropdown__button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }

      .dropdown__button:hover {
        background-color: #8f5774;
      }

      .dropdown.is-active .dropdown__button {
        background-color: #8f5774;
        color: white;
      }
    `}
                        </style>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Search
              placeholder="Search products by name"
              onChange={handleSearchChange}
              style={{ width: 300, marginLeft: "32%" }}
              allowClear
              onSearch={handleGoClick}
            />
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <div className="row y-gap-30 pt-30">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    id={product._id}
                    productSeller={product.seller._id}
                    name={product.name}
                    description={product.description}
                    price={`${currency} ${(product.price*exchangeRate).toFixed(2)}`}
                    picture={product.picture}
                    seller={product.seller.name}
                    quantity={product.quantity}
                    averageRating={product.averageRating}
                    isArchived={product.isArchived}
                    sales={product.sales}
                    userRole={userRole}
                    userId={userId}
                  />
                ))}
              </div>

              <div className="d-flex justify-center flex-column mt-60">
                <Pagination
                  curr={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />

                {/* <div className="text-14 text-center mt-20">
              Showing results 1-30 of 1,415
            </div> */}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
