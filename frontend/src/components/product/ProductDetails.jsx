import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getRatings } from "../../api/RatingService";
import {
  Rate,
  Layout,
  Breadcrumb,
  Button,
  Space,
  Divider,
  List,
  Typography,
  Avatar,
  Spin,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { InputNumber } from "antd";
import ReviewBox from "../common/ReviewBox";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const ProductDetails = ({ homeURL, productsURL }) => {
  const location = useLocation();
  const {
    id,
    name,
    seller,
    price,
    description,
    quantity,
    picture,
    averageRating,
    sales,
    userRole,
  } = location.state || {}; // Use 'id' from location.state
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        if (id === undefined) return;
        const response = await getRatings(id, "products");
        setRatings(response.ratings);
      } catch (error) {
        console.error("Failed to fetch ratings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [id]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <>
      <div className="productDetails">
        <div style={{ display: "flex", margin: "5%" }}>
          <div
            className="imagePlaceholder"
            style={{ flex: "0 0 25%", marginLeft: "20%" }}
          >
            {picture && (
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
                  src={picture}
                  alt={name}
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
                <Breadcrumb.Item>{name}</Breadcrumb.Item>
              </Breadcrumb>
              <div style={{ minHeight: 280 }}>
                <Title level={1}>{name}</Title>
                <Paragraph>
                  <strong>Price:</strong> {price}
                </Paragraph>
                <Paragraph>
                  <strong>Seller:</strong> {seller}
                </Paragraph>
                <Paragraph>
                  <strong>Description:</strong> {description}
                </Paragraph>
                {userRole !== "Tourist" && (
                  <div>
                    <Paragraph>
                      <strong>Quantity:</strong> {quantity}
                    </Paragraph>
                    <Paragraph>
                      <strong>Sales:</strong> {sales}
                    </Paragraph>
                  </div>
                )}
                <Paragraph>
                  <strong>Average Rating:</strong>{" "}
                  <Rate value={averageRating} disabled allowHalf />
                  <span style={{ marginLeft: "5%" }}>
                    ({averageRating ? averageRating.toFixed(2) : "N/A"})
                  </span>{" "}
                </Paragraph>
              </div>
              <Space
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                {userRole === "Tourist" && (
                  <>
                    <InputNumber
                      defaultValue={1}
                      min={1}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) => console.log("changed", value)}
                      style={{ textAlign: "center", width: "100px" }}
                    />
                    <Button
                      className="button purple-button"
                      type="primary"
                      style={{ marginLeft: "10px" }}
                    >
                      Add to Cart
                    </Button>

                    <style>{`
                  .purple-button {
                      background-color: #8f5774 !important;  /* Purple-600 */
                      color: white !important;
                      transition: background-color 0.3s ease !important;
                  }

                  .purple-button:hover {
                      background-color: #5d384d !important;  /* Purple-700 */
                  }
                  `}</style>
                  </>
                )}
              </Space>
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
          ) : ratings && ratings.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={ratings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: getRandomColor() }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <span>
                        {item.userID ? item.userID.userName : "Unknown User"}
                      </span>
                    }
                    description={
                      <div>
                        {item.rating !== 0 && (
                          <Rate value={item.rating} disabled allowHalf />
                        )}
                        <Paragraph>{item.review}</Paragraph>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <p>No reviews available for this product.</p>
          )}
          <Divider />
          {userRole === "Tourist" && <ReviewBox id={id} type={"products"} />}

          <br />
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
