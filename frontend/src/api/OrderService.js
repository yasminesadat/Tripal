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