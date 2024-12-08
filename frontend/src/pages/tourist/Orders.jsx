import { useState, useEffect } from "react";
import { message } from "antd";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";
import { Link } from "react-router-dom";
import { getOrders } from "@/api/OrderService";

const metadata = {
  title: "Orders || Tripal",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="page-wrapper">
        <TouristHeader />
        <main className="page-content">
          <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-dark-purple">
              My Orders
            </h1>
            {orders?.length === 0 ? (
              <p className="text-center text-stone-light">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow 
                        bg-footer border-stone-light"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-stone">
                          Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-stone-light">
                          {new Date(order?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                        >
                          {order?.status}
                        </span>
                        <p className="font-bold text-pink">
                          ${order?.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/order-details/${order?._id}`}
                      className="block mt-4 text-center text-dark-purple 
                           hover:underline font-medium"
                    >
                      View Order Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        <FooterThree />
      </div>
      <style>
        {`
`}
      </style>
    </>
  );
};

export default Orders;
