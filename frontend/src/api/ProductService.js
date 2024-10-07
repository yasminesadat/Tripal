import { axios } from "./axios";

export const createProduct = (productData) => {
  return axios.post("/products", productData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const editProduct = async (id, productData) => {
  try {
    await axios.patch(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};
