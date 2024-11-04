import { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Select,
  Slider,
  Spin,
  Empty,
  message,
} from "antd";
import { fetchProducts } from "../../api/ProductService";
import { getConversionRate } from "../../api/ExchangeRatesService";
import ProductCard from "./ProductCard";
import Footer from "../common/Footer";

const { Search } = Input;
const { Option } = Select;

const ProductList = ({ curr="EGP" })  => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1);
  const errorDisplayedRef = useRef(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        if (productsData) {
          const sortedProducts = productsData.sort((a, b) => b.averageRating - a.averageRating);
          setProducts(sortedProducts);
          setFilteredProducts(sortedProducts);
        }
      } catch (error) {
        if (!errorDisplayedRef.current) {
          message.error(
            "Network Error: Unable to fetch products. Please try again later."
          );
          errorDisplayedRef.current = true; // Set error displayed to true
        }
      } finally {
        setLoading(false);
      }
    };

    const getExchangeRate = async () => {
      if (curr) {
        try {
          const rate = await getConversionRate(curr);
          setExchangeRate(rate);
        } catch (error) {
          message.error("Failed to fetch exchange rate.");
        }
      }
    };

    getProducts();
    getExchangeRate();
  }, [curr]); 

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    filterProducts(searchValue, priceRange, value); 
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const filterProducts = (searchValue, priceRange, sortOrder) => {
    let results = products;
    
    if (results) {
        results = results.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    
    results = results.filter((product) => {
      if (priceRange[1] === 3000) {
        return formatPrice(product.price) >= priceRange[0];
      }
      return formatPrice(product.price) >= priceRange[0] && formatPrice(product.price) <= priceRange[1];
    });

    results = results.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });

    setFilteredProducts(results);
  };

  const handleGoClick = () => {
    filterProducts(searchValue, priceRange, sortOrder);
  };

  const formatPriceRange = () => {
    if (priceRange[1] === 3000) {
      return `${priceRange[0]} - ${priceRange[1]} & above`;
    }
    return `${priceRange[0]} - ${priceRange[1]}`;
  };

  const formatPrice = (price) => {
    const convertedPrice = (price * exchangeRate).toFixed(2);
    return convertedPrice; 
  };

  return (
    <>
      <div className="product-list-container">
        <div className="product-sidebar">
          <h2>Filter & Sort</h2>
          <div style={{ marginBottom: "10px" }}>
            <h3>Price Range</h3>
            <div style={{ marginBottom: "10px" }}>{formatPriceRange()}</div>
            <Slider
              range
              min={0}
              max={3000}
              value={priceRange}
              onChange={handlePriceChange}
              style={{ marginBottom: "10px" }}
            />
            <Button
              type="primary"
              style={{ width: "100%" }}
              onClick={handleGoClick}
            >
              Go
            </Button>
          </div>
          <Select
            defaultValue="desc"
            style={{ width: "100%" }}
            onChange={handleSortChange}
          >
            <Option value="desc">Sort by Rating: High to Low</Option>
            <Option value="asc">Sort by Rating: Low to High</Option>
          </Select>
        </div>
        <div className="product-list">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          >
            <Search
              placeholder="Search products by name"
              onChange={handleSearchChange}
              style={{ width: 300, marginLeft: "auto" }}
              allowClear
              onSearch={handleGoClick}
            />
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <Empty description="No relevant products to display" />
                </div>
              ) : (
                <div className="productGrid" style={{ marginBottom: "5%" }}>
                  <Row gutter={[16, 32]}>
                  {filteredProducts &&
                      filteredProducts.map((product) => (
                      <Col key={product._id} xs={24} sm={12} md={8}>
                        <ProductCard
                          id={product._id}
                          productSeller={product.seller._id}
                          name={product.name}
                          description={product.description}
                          price={`${curr} ${formatPrice(product.price)}`}
                          picture={product.picture}
                          seller={product.seller.name}
                          quantity={product.quantity}
                          averageRating={product.averageRating}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;