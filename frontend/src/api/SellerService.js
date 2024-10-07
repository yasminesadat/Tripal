import axios from "axios";

const baseURL = 'http://localhost:5050/api/seller'; 

export const createSeller = async (newSeller) => {
  try {
    const response = await axios.post(`${baseURL}`, newSeller);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSellerDetails = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const updateSeller = async (id, updatedData) => {
  try {
    const response = await axios.put(`${baseURL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
