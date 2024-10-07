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
import ProductCard from "./ProductCard";

const { Search } = Input;
const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [, setSortOrder] = useState("asc");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const errorDisplayedRef = useRef(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
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

    getProducts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (value === "asc") {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });
    setFilteredProducts(sortedProducts);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const filterProducts = (searchValue, priceRange) => {
    let searchResults = products;
    if (searchValue) {
      searchResults = searchResults.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    searchResults = searchResults.filter((product) => {
      if (priceRange[1] === 3000) {
        return product.price >= priceRange[0];
      }
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });
    setFilteredProducts(searchResults);
  };

  const handleGoClick = () => {
    filterProducts(searchValue, priceRange);
  };

  const formatPriceRange = () => {
    if (priceRange[1] === 3000) {
      return `$${priceRange[0]} - $${priceRange[1]} & above`;
    }
    return `$${priceRange[0]} - $${priceRange[1]}`;
  };

  return (
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
          defaultValue="asc"
          style={{ width: "100%" }}
          onChange={handleSortChange}
        >
          <Option value="asc">Sort by Rating: Low to High</Option>
          <Option value="desc">Sort by Rating: High to Low</Option>
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
              <>
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
                            price={product.price}
                            picture={product.picture}
                            seller={product.seller.name}
                            quantity={product.quantity}
                            ratings={product.ratings}
                            averageRating={product.averageRating}
                          />
                        </Col>
                      ))}
                  </Row>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
