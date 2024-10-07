import { axios } from "./axios";

export async function createTourist(newUser) {
  try {
    await axios.post("/createTourist", newUser);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}
export async function getTouristInformation(id) {
  try {
    const response = await axios.get(`/getTouristInfo/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}
export async function updateTouristInformation(id) {
  try {
    const response = await axios.put(`/updateTourist/${id}`);
    return response.data;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}
