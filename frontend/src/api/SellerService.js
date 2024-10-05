import { axios } from "./axios";

export async function createSeller(newUser) {
  try {
    await axios.post("/seller", newUser);
  } catch (error) {
    throw error;
  }
}
