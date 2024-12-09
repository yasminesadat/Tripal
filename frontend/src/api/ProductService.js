import { axios } from "./axios";

export const createProduct = (productData) => {
  return axios.post("/products", productData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchProducts = async (
  page,
  searchValue,
  minPrice,
  maxPrice,
  sortOrder,
  userRole
) => {
  try {
    const response = await axios.get("/products", {
      params: {
        page,
        searchValue,
        minPrice,
        maxPrice,
        sortOrder,
        userRole,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const fetchProductImages = async (productIds) => {
  try {
    const response = await axios.post("/products/images", {
      ids: productIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw new Error("Failed to fetch product images");
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

export const getRatings = async (id) => {
  try {
    const response = await axios.get(`/products/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const addRating = async (productID, ratingData) => {
  try {
    const response = await axios.post(
      `/products/${productID}/ratings`,
      ratingData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

export const archiveProduct = async (id) => {
  try {
    await axios.patch(`/products/${id}/archive`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error archiving product:", error);
    throw error;
  }
};

export const unArchiveProduct = async (id) => {
  try {
    await axios.patch(`/products/${id}/unarchive`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error unarchiving product:", error);
    throw error;
  }
};

export async function getRevenue() {
  try {
    const response = await axios.get(`/products/revenue`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue:", error);
    throw error;
  }
}

export const getIsArchived = async (id) => {
  try {
    const response = await axios.get(`/product/${id}/isArchived`);
    return response.data;
  } catch (error) {
    console.error("Error fetching isArchived:", error);
    throw new Error("Failed to fetch product details");
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};
