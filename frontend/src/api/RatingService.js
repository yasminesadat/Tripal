import { axios } from "./axios";

export const getRatings = async (id, type) => {
  try {
    const response = await axios.get(`/${type}/${id}/ratings`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const addRating = async (id, type, ratingData) => {
  try {
    const response = await axios.post(`/${type}/${id}/ratings`, ratingData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};