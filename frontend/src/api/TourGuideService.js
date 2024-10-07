import { axios } from "./axios";

export async function createTourGuide(newUser) {
  try {
    await axios.post("/tour-guide", newUser);
  } catch (error) {
    throw error;
  }
}
