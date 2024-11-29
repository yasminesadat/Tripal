import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, archiveProduct, unArchiveProduct} from "../../api/ProductService";
import {getUserData} from "../../api/UserService";
import Stars from "../common/Stars";
import Pagination from "../common/Pagination";
import Spinner from "../common/Spinner"; 
import ProductCard from "./ProductCard";
import { Card, Rate, message,Input,Select,Slider } from "antd"; 
const { Search } = Input;
const { Option } = Select;

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
        sortOrder ,
        userRole
        );
        let filtered = productsData.products;
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
    const fetchData = async () => {
      try {
        const userData = await getUserData();
        setUserRole(userData.data.role); 
        setUserId(userData.data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []); 
  
  useEffect(() => {
    if (userRole) {
      console.log('User role:', userRole);
      getProducts(currentPage); 
    }
  }, [userRole, sortOrder]); 
  

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
                    <span className="js-title">Filter Price</span>
                    <i className="icon-chevron-down ml-10"></i>
                  </div>

                  <div className="dropdown__menu px-30 py-30 shadow-1 border-1 js-">
                    <h5 className="text-22 fw-500" style={{marginBottom:"5%"}}>Filter Price</h5>
                    <div style={{ marginBottom: "-7%",textAlign:"center" }}>{formatPriceRange()}</div>
                    <div className="pt-20">
                      <Slider
                        range
                        min={0}
                        max={3000}
                        value={priceRange}
                        onChange={handlePriceChange}
                        style={{ marginBottom: "10px" }}
                      />                    
                      </div>
                    <button className="button px-25 py-15 lh-12 -accent-1 text-accent-1 bg-accent-1-05 border-accent-1 mt-30"
                    onClick={handleGoClick}>
                      Apply
                      <i className="icon-arrow-top-right text-16 ml-10"></i>
                    </button>
                  </div>
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
          <div className="col-auto" style={{width: 300, marginLeft: "auto"}}>
          <Select
            value={sortOrder} 
            style={{ width: "100%" }}
            onChange={handleSortChange}
          >
            <Option value="desc">Sort by Rating: High to Low</Option>
            <Option value="asc">Sort by Rating: Low to High</Option>
          </Select>
          </div>
        </div>
        {loading ? ( <Spinner/>) :
        (<>
          <div className="row y-gap-30 pt-30">
            {filteredProducts.map((product, i) => (
                <ProductCard 
                id={product._id}
                productSeller={product.seller._id}
                name={product.name}
                description={product.description}
                price={product.price}
                picture={product.picture}
                seller={product.seller.name}
                quantity={product.quantity}
                averageRating={product.averageRating}
                isArchived={product.isArchived}
                sales={product.sales}
                userRole = {userRole} 
                userId = {userId}/>
              ))}
        </div>

          <div className="d-flex justify-center flex-column mt-60">
          <Pagination curr ={currentPage} totalPages ={totalPages} onPageChange={onPageChange} />

            {/* <div className="text-14 text-center mt-20">
              Showing results 1-30 of 1,415
            </div> */}
          </div>
        </>
        )}
      </div>
    </section>
  );
}
