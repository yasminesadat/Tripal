import { axios } from "./axios";
const path = '/seller'
export async function createSeller(newUser) {
  try {
    await axios.post(path, newUser);
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
    console.log(updatedData)
    const response = await axios.put(`${baseURL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
