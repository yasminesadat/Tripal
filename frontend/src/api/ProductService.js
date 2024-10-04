import axios from "axios";

const API_URL = "http://localhost:5050/api/products";

export const createProduct = (productData) => {
  return axios.post(API_URL, productData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const searchProductsByName = async (name) => {
  try {
    const response = await axios.get(
      `${API_URL}/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
