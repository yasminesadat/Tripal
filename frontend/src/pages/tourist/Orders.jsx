import { useState, useEffect, useRef } from "react";
import { message, Modal } from "antd";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";
import Pagination from "../../components/common/Pagination";
import { getOrders, cancelOrder } from "@/api/OrderService";
import { fetchProductImages } from "@/api/ProductService";
import { Link } from "react-router-dom";
import defaultPlace from "../../assets/images/defaultPlace.png";
import { CheckCircleOutlined } from "@ant-design/icons";

const metadata = {
  title: "Orders || Tripal",
};

const tabs = ["Current Orders", "Past Orders"];

const statusClass = (status) => {
  if (status === "Delivered") return "text-purple-1";
  if (status === "Pending") return "text-yellow-1";
  if (status === "Shipped") return "text-blue-1";
  if (status === "Cancelled") return "text-red-2";
  return "";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("Current Orders");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const showError = useRef(false);

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        const ordersWithImages = await Promise.all(
          response.orders.map(async (order) => {
            const productIds = order.products.map((product) => product.product);
            const images = await fetchProductImages(productIds);
            return { ...order, images };
          })
        );
        setOrders(ordersWithImages);
      } catch (error) {
        if (!showError.current) {
          message.error(error.message);
          showError.current = true;
        }
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    try {
      const response = await cancelOrder(orderToCancel._id);
      setOrders(
        orders.map((order) =>
          order._id === orderToCancel._id
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
      setSuccessMessage(
        `Order canceled successfully. <strong>${response.orderPrice.toFixed(
          2
        )} EGP</strong> have been redeemed into your wallet. Your new wallet balance is <strong>${response.newWalletAmount.toFixed(
          2
        )} EGP</strong>.`
      );
      setIsSuccessModalVisible(true);
    } catch (error) {
      message.error("Failed to cancel order");
    } finally {
      setIsModalVisible(false);
      setOrderToCancel(null);
    }
  };

  const showCancelModal = (order) => {
    setOrderToCancel(order);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setOrderToCancel(null);
  };

  const filteredOrders = orders.filter((order) => {
    if (currentTab === "Current Orders") {
      return order.status === "Pending" || order.status === "Shipped";
    }
    return order.status === "Delivered" || order.status === "Cancelled";
  });

  return (
    <>
      <MetaComponent meta={metadata} />
      <div>
        <TouristHeader />
        <main className="page-content-hana">
          <div className="dashboard js-dashboard">
            <div className="dashboard__content">
              <div className="dashboard__content_content">
                <h1 className="text-30 ml-80">My Orders</h1>
                <div className="dashboard__content">
                  <div className="dashboard__content_content">
                    <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20">
                      <div className="tabs -underline-2 js-tabs">
                        <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
                          {tabs.map((tab, index) => (
                            <div
                              key={index}
                              className="col-auto"
                              onClick={() => setCurrentTab(tab)}
                            >
                              <button
                                className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 ${
                                  tab === currentTab ? "is-tab-el-active" : ""
                                }`}
                              >
                                {tab}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="overflowAuto mt-30">
                        <table className="tableTest mb-30">
                          <thead className="bg-light-1 rounded-12">
                            <tr>
                              <th>Order ID</th>
                              <th>Products</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>Total Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders?.length === 0 ? (
                              <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                  No {currentTab.toLowerCase()} found.
                                </td>
                              </tr>
                            ) : (
                              filteredOrders?.map((order, index) => (
                                <tr key={index}>
                                  <td>#{order._id.slice(-6)}</td>
                                  <td className="min-w-300">
                                    <div className="d-flex items-center">
                                      {order.images
                                        .slice(0, 5)
                                        .map((image, idx) => (
                                          <img
                                            key={idx}
                                            src={image || defaultPlace}
                                            alt="Order"
                                            style={{
                                              width: "70px", // Increased size
                                              height: "70px", // Increased size
                                              borderRadius: "4px",
                                              objectFit: "cover",
                                              marginRight: "10px", // Increased spacing
                                            }}
                                          />
                                        ))}
                                    </div>
                                  </td>
                                  <td>
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>
                                    <div
                                      className={`circle ${statusClass(
                                        order.status
                                      )}`}
                                    >
                                      {order.status}
                                    </div>
                                  </td>
                                  <td>{order.totalPrice.toFixed(2)} EGP</td>
                                  <td>
                                    <div
                                      className={`d-flex flex-column items-start ${
                                        order.status !== "Pending"
                                          ? "justify-center"
                                          : ""
                                      }`}
                                    >
                                      {order.status === "Pending" && (
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            showCancelModal(order);
                                          }}
                                          className="action-link cancel-link"
                                        >
                                          Cancel
                                        </a>
                                      )}
                                      <Link
                                        to={`/order/${order._id}`}
                                        className="action-link view-details-link"
                                      >
                                        View Details
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Pagination />
                      <div className="text-14 text-center mt-20">
                        Showing results 1-{filteredOrders?.length} of{" "}
                        {filteredOrders?.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <FooterThree />
      </div>
      <Modal
        title="Order Cancellation"
        open={isSuccessModalVisible}
        onOk={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
        footer={[
          <button
            key="Ok"
            style={{
              backgroundColor: "var(--color-stone)",
              borderColor: "var(--color-stone)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
            onClick={() => setIsSuccessModalVisible(false)}
          >
            Ok
          </button>,
        ]}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <CheckCircleOutlined
            style={{ color: "green", fontSize: "24px", marginRight: "8px" }}
          />
          <p dangerouslySetInnerHTML={{ __html: successMessage }}></p>
        </div>
      </Modal>
      ;
      <Modal
        title="Cancel Order"
        open={isModalVisible}
        onOk={handleCancelOrder}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
        className="custom-modal"
      >
        <p>Are you sure you want to cancel the order?</p>
      </Modal>
      <style>{`
        .cancel-button {
          background-color: red !important;
          color: white;
        }

        .info-button {
          background-color: var(--color-dark-purple) !important;
          color: white;
        }

        .cancel-button:hover {
          background-color: darkred !important;
        }

        .info-button:hover {
          background-color: var(--color-light-purple) !important;
        }

        .justify-center {
          justify-content: center;
        }

        .custom-modal .ant-modal-footer .ant-btn-primary {
          background-color: var(--color-stone) !important;
          border-color: var(--color-stone) !important;
        }
        
        .custom-modal .ant-modal-footer .ant-btn-primary:hover {
          background-color: var(--color-stone-light) !important;
          border-color: var(--color-stone-light) !important;
          color: white !important;
        }
        
        .custom-modal .ant-modal-footer .ant-btn-default {
          border-color: var(--color-stone) !important;
          color: var(--color-stone) !important;
        }

        .action-link {
          font-size: 14px;
          color: var(--color-dark-purple);
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 8px; /* Add spacing between links */
        }

        .action-link:last-child {
          margin-bottom: 0; /* Remove bottom margin for the last link */
        }

        .cancel-link {
          color: red;
        }

        .cancel-link:hover {
          color: darkred;
        }

        .view-details-link {
          color: var(--color-dark-purple);
        }

        .view-details-link:hover {
          color: var(--color-light-purple);
        }
        .justify-center {
          justify-content: center;
        }
        
        .custom-modal .ant-modal-footer .ant-btn-default:hover {
          border-color: var(--color-stone) !important;
          color: var(--color-stone) !important;
        }
      `}</style>
    </>
  );
};

export default Orders;
