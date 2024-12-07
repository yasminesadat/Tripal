import React, { useState, useEffect } from "react";
import { getCart , removeFromCart, updateQuantity} from "../../api/TouristService"
// import TouristNavBar from "../../components/navbar/TouristNavBar"
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { getUserData } from "@/api/UserService";
import Spinner from "@/components/common/Spinner";
import MetaComponent from "@/components/common/MetaComponent";
import { Button , InputNumber} from "antd";

const metadata = {
    title: "My Cart || Tripal",
};

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [userData, setUserData] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    const fetchUserData = async () => {
        try {
            const user = await getUserData();
            setUserData(user.data.id);
        } catch (error) {
            message.error("Failed to fetch user data.");
        }
    };

    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCart(response.cart || []); 
        } catch (error) {
            message.error("Failed to fetch cart.");
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId) => {
      try {
          await removeFromCart(userData, productId); 
          message.success("Removed product from cart successfully!");
          setCart((prevCart) =>
              prevCart.filter((item) => item.product._id !== productId)
          );
      } catch (error) {
          message.error("Failed to remove product from cart.");
      }
  };
  

    useEffect(() => {
        fetchUserData();
        fetchCart();

    }, []);

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
      
          await updateQuantity(productId, newQuantity);
          fetchCart();
        } catch (error) {
          message.error("Failed to update product's quantity in cart.");
        }
      };
      
      

    if (loading) {
        return <Spinner />;
    }

    return (
        <>
            <MetaComponent meta={metadata} />
            <div className="page-wrapper">
                <TouristHeader />
                <main className="page-content">
                    <div className="complaints">
                        <div className="dashboard__content">
                            <div className="dashboard__content_content">
                                <h1 className="text-30">My Cart</h1>
                                <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 mt-60">
                                    <div className="overflowAuto">
                                    <table className="tableTest mb-30">
                                        <thead className="bg-light-1 rounded-12">
                                            <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {cart.map((item) => (
                                                <tr key={item.product._id}>
                                                    <td>
                                                    <span style={{ marginRight: "20px" }}>
                                                        {item.product.name}
                                                    </span>
                                                    <img
                                                        src={item.product.picture}
                                                        alt=""
                                                        style={{ width: "70px", height: "70px" }}
                                                    />
                                                    </td>
                                                    <td>{item.product.price.toFixed(2)}</td>
                                                    <td>
                                                    <InputNumber
                                                        value={item.quantity}
                                                        min={1}
                                                        formatter={(value) =>
                                                        `${value}`.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        )
                                                        }
                                                        parser={(value) =>
                                                        value?.replace(/\$\s?|(,*)/g, "")
                                                        }
                                                        onChange={(value) =>
                                                        handleQuantityChange(item.product._id, value)
                                                        }
                                                        style={{ textAlign: "center", width: "100px" }}
                                                    />
                                                    </td>
                                                    <td>
                                                    {(item.product.price * item.quantity).toFixed(2)}
                                                    </td>
                                                    <td>
                                                    <button
                                                        style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "red",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                        }}
                                                        onClick={() => removeItem(item.product._id)}
                                                    >
                                                        Remove
                                                    </button>
                                                    </td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {cart.length>0 &&(
                                        <Button
                                            type="primary"
                                            className="custom-button"
                                            onClick={() => navigate("/checkout", { state: { cart } })}
                                            style={{marginLeft:"83%"}}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <FooterThree />
            </div>
            {/* <ComplaintsForm
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSubmitSuccess={handleComplaintSubmit}
            /> */}
            <style>{`
      
      .header-section {
                    margin-bottom: 20px;
                }

                .add-complaint-btn {
                    position: absolute;
                    top: 60px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: var(--color-dark-purple);
                    border: none;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                .add-complaint-btn:hover {
                    background-color: var(--color-light-purple);
                    transform: scale(1.05);
                }

                .add-complaint-btn .anticon {
                    font-size: 20px;
                }

     .custom-button {
  background-color: var(--color-dark-purple) !important;
  border: 2px solid var(--color-dark-purple) !important;
  color: #fff !important; /* Text color */
  border-radius: 20px; /* Slightly smaller rounded edges */
  padding: 8px 16px; /* Reduced padding */
  font-size: 14px; /* Adjusted font size */
  font-weight: 500; /* Medium font weight */
  cursor: pointer; /* Pointer cursor on hover */
  transition: all 0.3s ease; /* Smooth transitions */
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-button:hover,
.custom-button:focus {
  background-color: var(--color-light-purple) !important;
  border-color: var(--color-light-purple) !important;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow on hover */
}

.custom-button:active {
  transform: scale(0.98); /* Slightly shrink the button on click */
}

.custom-button:disabled {
  background-color: #ccc !important;
  border-color: #ccc !important;
  color: #666 !important;
  cursor: not-allowed;
  box-shadow: none;
}
    `}</style>
        </>
    );
}

export default Cart;