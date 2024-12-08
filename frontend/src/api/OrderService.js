import { axios } from "./axios";

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post("/tourist/order", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating orderrrr:", error);
    throw error;
  }
};

export const completeOrder = async (orderData) => {
  try {
    const response = await axios.post("/tourist/stripe/payment", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get("/tourist/order");
    return response.data;
  } catch (error) {
    if (!error.response) {
      // Network error
      console.error("Network error:", error);
      throw new Error("Please check your internet connection.");
    } else {
      // Other errors
      console.error("Error getting orders:", error);
      throw new Error(
        "There was an issue getting your orders. Please try again."
      );
    }
  }
};
