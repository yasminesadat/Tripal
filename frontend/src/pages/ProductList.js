import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Row, Col, Input } from "antd";
import { fetchProducts, searchProductsByName } from "../api/ProductsAPI";

const { Search } = Input;

const ProductList = () => {
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      const productsData = await fetchProducts();
      if (productsData) {
        setProducts(productsData);
        setFilteredProducts(productsData);
      }
    };

    getProducts();
  }, []);

  const handleSearch = async (value) => {
    if (value) {
      const searchResults = await searchProductsByName(value);
      setFilteredProducts(searchResults);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="productList">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1%",
          marginBottom: "1%",
        }}
      >
        <h1 style={{ margin: 0 }}>VIEW PRODUCTS</h1>
        <Search
          placeholder="Search products by name"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
          enterButton="Search"
          size="large"
        />
      </div>
      <div className="productGrid" style={{ marginLeft: "1%" }}>
        <Row gutter={[16, 16]}>
          {filteredProducts &&
            filteredProducts.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  picture={product.picture}
                  sellerID={product.sellerID}
                  quantity={product.quantity}
                />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductList;
