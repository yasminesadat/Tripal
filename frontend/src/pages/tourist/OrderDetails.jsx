import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "@/api/OrderService";
import { message } from "antd";
import { fetchProductImages } from "@/api/ProductService";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const metadata = {
  title: "Orders || Tripal",
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [images, setImages] = useState([]);
  const showError = useRef(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response);
        const productIds = response.products.map((product) => product.product);
        console.log("product ids", productIds);
        const images = await fetchProductImages(productIds);
        setImages(images);
      } catch (error) {
        if (!showError.current) {
          message.error("Failed to fetch order details.");
          showError.current = true;
        }
      }
    };

    fetchOrderDetails();
  }, [id]);

  const defaultTimeline = ["Pending", "Shipped", "Delivered"];
  const cancelledTimeline = ["Cancelled"];

  const getOrderTimeline = () => {
    if (order?.status === "Cancelled") return cancelledTimeline;
    return defaultTimeline;
  };

  const statusTimeline = getOrderTimeline();
  const currentStatusIndex = statusTimeline.indexOf(order?.status);

  const renderTimelineItem = (status, index) => {
    const isActive = index <= currentStatusIndex;
    const isLast = index === statusTimeline.length - 1;

    return (
      <div key={status} className="timeline-item">
        <div className={`timeline-circle ${isActive ? "active" : ""}`}>
          {isActive ? (
            status === "Cancelled" ? (
              <CloseCircleOutlined className="status-icon" />
            ) : (
              <CheckCircleOutlined className="status-icon" />
            )
          ) : null}
        </div>
        {!isLast && (
          <div className={`timeline-line ${isActive ? "active" : ""}`}></div>
        )}
        <span className={isActive ? "active-text" : ""}>{status}</span>
      </div>
    );
  };

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
          <div className="order-details-container">
            <h1>Order #{order?._id.slice(-6)}</h1>
            <div className="order-summary">
              <h2>Order Summary</h2>
              <p>
                <strong>Total Price:</strong> {order?.totalPrice.toFixed(2)} EGP
              </p>
              <p>
                <strong>Delivery Address:</strong>{" "}
                {`${order?.deliveryAddress.street}, ${order?.deliveryAddress.city}, ${order?.deliveryAddress.zipCode}, ${order?.deliveryAddress.country}`}
              </p>
              <p>
                <strong>Payment Method:</strong> {order?.paymentMethod}
              </p>
            </div>

            <div className="order-timeline">
              <h2>Order Status</h2>
              <div className="timeline">
                {statusTimeline.map(renderTimelineItem)}
              </div>
            </div>

            <div className="order-products">
              <h2>Ordered Products</h2>
              <div className="products-grid">
                {order?.products.map((item, index) => (
                  <div key={index} className="product-card">
                    <div className="product-image-container">
                      <img
                        src={images[index] || "/placeholder.jpg"}
                        alt={item.product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-details">
                      <h3>{item.product.name}</h3>
                      <div className="product-meta">
                        <div className="product-quantity">
                          <span>Quantity</span>
                          <strong>{item.quantity}</strong>
                        </div>
                        <div className="product-price">
                          <span>Price</span>
                          <strong>{item.price.toFixed(2)} EGP</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grand-total">
                <p>
                  <strong>Grand Total:</strong> {order?.totalPrice.toFixed(2)}{" "}
                  EGP
                </p>
              </div>
            </div>
          </div>
        </main>
        <FooterThree />
      </div>
      <style>{`
  .order-details-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', sans-serif;
  }

  h1 {
    color: var(--color-dark-purple);
    text-align: center;
    margin-bottom: 24px;
  }

  .order-summary {
    background: var(--color-light-purple);
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .order-timeline {
    margin: 24px 0;
  }

  .timeline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .timeline-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
  }

  .timeline-circle {
    width: 48px;
    height: 48px;
    border: 2px solid var(--color-stone-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    transition: all 0.3s ease;
  }

  .timeline-circle.active {
    border-color: var(--color-stone);
    background-color: var(--color-stone);
    color: white;
  }

  .status-icon {
    font-size: 24px;
  }

  .timeline-line {
    height: 2px;
    background: var(--color-stone-light);
    width: 94%;
    position: absolute;
    top: 24px;
    left: 50%;
    z-index: -1;
  }

  .timeline-line.active {
    background: var(--color-stone);
  }

  .timeline-item span {
    font-size: 14px;
    color: var(--color-stone-light);
    text-align: center;
  }

  .timeline-item .active-text {
    color: var(--color-stone);
    font-weight: 600;
  }

  .products-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .product-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid var(--color-stone-light);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    flex: 1;
    max-width: calc(50% - 20px); /* Adjust for two columns */
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .product-image-container {
    width: 40%; /* Image takes up 40% of the card width */
    height: 100%;
    overflow: hidden;
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .product-card:hover .product-image {
    transform: scale(1.05);
  }

  .product-details {
    width: 60%; /* Text takes up 60% of the card width */
    padding: 16px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-details h3 {
    margin-bottom: 12px;
    font-size: 18px;
    color: var(--color-dark-purple);
  }

  .product-meta {
    display: flex;
    flex-direction: column; /* Stack quantity and price */
    gap: 8px;
  }

  .product-meta > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align to the left */
  }

  .product-meta span {
    font-size: 12px;
    color: var(--color-stone-light);
    margin-bottom: 4px;
  }

  .product-meta strong {
    font-size: 16px;
    color: var(--color-dark-purple);
  }

  .grand-total {
    margin-top: 24px;
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: var(--color-dark-purple);
  }
`}</style>
    </>
  );
};

export default OrderDetails;
