import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { getRatings } from "../../api/RatingService";
import { getProduct } from "@/api/ProductService";
import {
  Tour,
  Rate,
  Layout,
  Breadcrumb,
  Button,
  Divider,
  List,
  Typography,
  Avatar,
  Spin,
  message,
  InputNumber,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReviewBox from "../common/ReviewBox";
import ProductRevenue from "./ProductRevenue";
import {
  getConversionRate,
  getTouristCurrency,
} from "@/api/ExchangeRatesService";
import { getUserData } from "@/api/UserService";
import { addToCart } from "../../api/TouristService";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProductDetails = ({ homeURL, productsURL }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Initialize state with a safe, default structure
  const [product, setProduct] = useState({
    id: id || "",
    name: "",
    productSeller: "",
    seller: "",
    price: 0,
    description: "",
    quantity: 0,
    picture: "",
    averageRating: 0,
    sales: 0,
  });

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("EGP");
  const [open, setOpen] = useState(false);

  const refProdToCart = useRef(null);

  // Memoize complex calculations
  const displayPrice = useMemo(() => {
    const basePrice = product.price || 0;
    return userRole === "Tourist"
      ? `${currency || "EGP"} ${(basePrice * exchangeRate).toFixed(2)}`
      : `EGP ${basePrice.toFixed(2)}`;
  }, [product.price, userRole, currency, exchangeRate]);

  // Fetch exchange rate
  const getExchangeRate = async () => {
    try {
      const rate = await getConversionRate(currency);
      setExchangeRate(rate);
    } catch (error) {
      message.error("Failed to fetch exchange rate.");
    }
  };

  // Currency update effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCurrency = getTouristCurrency();
      setCurrency(newCurrency);
      getExchangeRate();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currency]);

  // Initial data fetch effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await getUserData();
        setUserRole(userData.data?.role || "");
        setUserId(userData.data?.id || "");

        // If no location state, fetch product details
        if (!location.state || !location.state.name) {
          const product = await getProduct(id);
          setProduct({
            id: id,
            name: product.name,
            productSeller: product.seller._id,
            seller: product.seller.name,
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            picture: product.picture,
            averageRating: product.averageRating,
            sales: product.sales,
          });
        } else {
          // Use location state if available
          setProduct({
            ...product,
            ...location.state,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load product details.");
      }
    };

    fetchData();
  }, [id, location.state]);

  // Fetch ratings effect
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (!product.id) return;
        const response = await getRatings(product.id, "products");
        setRatings(response.ratings || []);
      } catch (error) {
        console.error("Failed to fetch ratings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [product.id]);

  // Tour steps
  const steps = [
    {
      title: "Add Product to Cart",
      description: "You can finally checkout from there!",
      target: () => refProdToCart.current,
      onFinish: () => {
        setOpen(false);
        navigate("/tourist", { state: { fromTour: true, targetStep: 7 } });
      },
    },
  ];

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!selectedQuantity || selectedQuantity < 1) {
      message.error("Please select a valid quantity.");
      return;
    }
    try {
      await addToCart(userId, product.id, selectedQuantity);
      message.success("Product added to cart successfully!");
    } catch (error) {
      message.error("Error adding product to cart.");
    }
  };

  // User avatar color generator
  const getColorForUser = (userId) => {
    if (!userId || typeof userId !== "string") {
      return "#CCCCCC";
    }
    const colors = [
      "#8f5774",
      "#dac4d0",
      "#e0829d",
      "#036264",
      "#5a9ea0",
      "#11302a",
    ];
    const hash = userId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      <style jsx global>{`
        /* Base style for all dots */
        /* Try multiple selectors and approaches */
        .ant-tour .ant-tour-indicators > span {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          background: #dac4d0 !important;
        }
        .ant-tour .ant-tour-indicators > span[class*="active"] {
          background: #036264 !important;
        }

        /* Additional specificity */
        .ant-tour-indicators span[role="dot"][aria-current="true"] {
          background: #036264 !important;
        }

        .ant-tour .ant-tour-inner {
          border: 1px solid #5a9ea0;
          box-shadow: 0 4px 12px rgba(3, 98, 100, 0.15);
        }

        .ant-tour .ant-tour-content {
          color: #8f5774;
          font-weight: 500 !important;
          letter-spacing: 0.3px !important;
          text-rendering: optimizeLegibility !important;
        }

        .ant-tour .ant-tour-title {
          color: #5a9ea0;
          font-weight: 600;
        }

        .ant-tour .ant-tour-close {
          color: #5a9ea0;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ant-tour .ant-tour-close:hover {
          opacity: 1;
          color: #e5f8f8;
        }

        .ant-tour .ant-tour-buttons .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }
        .ant-tour .ant-tour-buttons .ant-btn-default {
          background: #036264;
          border: none;
          color: white;
          transition: all 0.2s;
        }

        .ant-tour .ant-tour-buttons .ant-btn-primary:hover,
        .ant-tour .ant-tour-buttons .ant-btn-default:hover {
          color: white;
          background: #5a9ea0;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(3, 98, 100, 0.2);
        }
        .ant-tour .ant-tour-arrow-content {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
      `}</style>
      <div className="productDetails">
        <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
        <div style={{ display: "flex", margin: "5%" }}>
          <div
            className="imagePlaceholder"
            style={{ flex: "0 0 25%", marginLeft: "20%" }}
          >
            {product.picture && (
              <div
                style={{
                  border: "2px solid #ccc",
                  padding: "2%",
                  borderRadius: "1%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <img
                  src={product.picture}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70%",
                    borderRadius: "5%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>
          <div
            className="contentPlaceholder"
            style={{ flex: "1", marginLeft: "3%" }}
          >
            <Content style={{ padding: "0 5%" }}>
              <Breadcrumb style={{ margin: "1.5%" }}>
                <Breadcrumb.Item>
                  <Link to={homeURL}>Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to={productsURL}>Products</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ minHeight: 280 }}>
                <Title level={1}>{product.name}</Title>
                <Paragraph>
                  <strong>Price:</strong> {displayPrice}
                </Paragraph>
                <Paragraph>
                  <strong>Seller:</strong> {product.seller}
                </Paragraph>
                <Paragraph>
                  <strong>Description:</strong> {product.description}
                </Paragraph>
                {(userId === product.productSeller || userRole === "Admin") && (
                  <div>
                    <Paragraph>
                      <strong>Quantity:</strong> {product.quantity}
                    </Paragraph>
                    <Paragraph>
                      <strong>Sales:</strong> {product.sales}
                    </Paragraph>
                  </div>
                )}
                <Paragraph>
                  <strong>Average Rating:</strong>{" "}
                  <Rate value={product.averageRating} disabled allowHalf />
                  <span style={{ marginLeft: "5%" }}>
                    ({product.averageRating?.toFixed(2)})
                  </span>
                </Paragraph>
                {userRole === "Tourist" && (
                  <>
                    {product.quantity === 0 ? (
                      <Paragraph style={{ color: "red", fontWeight: "bold" }}>
                        Product out of stock
                      </Paragraph>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <InputNumber
                          min={1}
                          max={product.quantity}
                          value={selectedQuantity}
                          onChange={(value) => setSelectedQuantity(value)}
                        />
                         <Button
                      className="button purple-button"
                      type="primary"
                      onClick={handleAddToCart}
                      ref={refProdToCart}
                    >
                      Add to Cart
                    </Button>
                      </div>
                    )}
                     <style>
                  {`
                  .purple-button {
                    background-color: #8f5774 !important; /* Purple-600 */
                    color: white !important;
                    transition: background-color 0.3s ease !important;
                  }

                  .purple-button:hover {
                    background-color: #5d384d !important; /* Purple-700 */
                  }
                  `}
                </style>
                  </>
                )}
              </div>
            </Content>
          </div>
        </div>
        <Divider
          orientation="left"
          style={{ padding: "0 10%", borderColor: "#aaa" }}
        >
          Reviews
        </Divider>
        <div className="reviewsSection" style={{ padding: "0 10%" }}>
          {loading ? (
            <Spin tip="Loading reviews..." style={{ marginBottom: "4%" }} />
          ) : ratings.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={ratings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getColorForUser(
                            item.userID?._id || ""
                          ),
                        }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={item.userID?.userName || "Unknown User"}
                    description={
                      <>
                        {item.rating !== 0 && (
                          <Rate value={item.rating} disabled allowHalf />
                        )}
                        <Paragraph>{item.review}</Paragraph>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <p>No reviews available for this product.</p>
          )}
          {(userId === product.productSeller || userRole === "Admin") && (
            <>
              <Divider orientation="left" style={{ borderColor: "#aaa" }}>
                Revenue
              </Divider>
              <ProductRevenue
                productSales={product.sales}
                price={product.price}
              />
            </>
          )}
          <Divider />
          {userRole === "Tourist" && (
            <ReviewBox id={product.id} type={"products"} />
          )}
          <br />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
