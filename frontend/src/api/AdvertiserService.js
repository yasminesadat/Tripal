import { axios } from "./axios";

export async function createAdvertiser(newUser) {
  try {
    await axios.post("/advertiser", newUser);
  } catch (error) {
    throw error;
  }
}
