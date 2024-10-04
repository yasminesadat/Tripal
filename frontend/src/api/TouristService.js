import { axios } from "./axios";

export async function createTourist(newUser) {
  try {
    console.log("the user", newUser, "end of user");
    await axios.post("/createTourist", newUser);
  } catch (error) {
    console.log("eee", error);
    throw error;
  }
}
export async function getTouristInformation(id) {
  try {
    const response = await axios.get(`/getTouristInfo/${id}`);
    return response.data;
  } catch (error) {
    console.log("eee", error);
    throw error;
  }
}
export async function updateTouristInformation(id) {
  try {
    const response = await axios.put(`/updateTourist/${id}`);
    return response.data;
  } catch (error) {
    console.log("eee", error);
    throw error;
  }
}
